import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { PreviewWorkspaceCopy } from './PreviewToolWorkspace';
import { authClient } from '../auth/auth-client';
import { getPromptError, MAX_PROMPT_LENGTH, isVideoErrorCode, videoNotices, type VideoErrorCode } from '../../lib/video/errors';
import { DEFAULT_VIDEO_OPTIONS, VIDEO_DURATIONS, VIDEO_RESOLUTIONS, VIDEO_ASPECT_RATIOS, isVideoOptions, type VideoOptions } from '../../lib/video/options';

type Task = { id: string; status: 'submitting' | 'queued' | 'running' | 'completed' | 'failed'; options?: VideoOptions; error?: string; errorCode?: VideoErrorCode; videoUrl?: string; downloadUrl?: string; linksExpireAt?: number };
type Readiness = { configured: boolean; enabled: boolean; missing: string[] };
const storageKey = 'seedances-fal-local-task';
const draftKey = 'seedances-video-prompt';
const optionsKey = 'seedances-video-options';
const draftModeKey = 'seedances-video-draft-for-task';
const statuses = {
  submitting: 'Submission not yet confirmed. Check task status or your fal dashboard before retrying.',
  queued: 'Queued — waiting for a runner.',
  running: 'Generating your video. You can refresh this page without submitting again.',
  completed: 'Your video is ready. Download links expire after 10 minutes; check status to refresh them.',
  failed: 'Generation could not be completed.',
};

export default function VideoGenerator({ copy, preview = false }: { copy: PreviewWorkspaceCopy; preview?: boolean }) {
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<VideoOptions>({ ...DEFAULT_VIDEO_OPTIONS });
  const [initialized, setInitialized] = useState(false);
  const [consent, setConsent] = useState(false);
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [editingDraft, setEditingDraft] = useState(false);
  const editingDraftRef = useRef(false);
  const [error, setError] = useState('');
  const [promptChecked, setPromptChecked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [notice, setNotice] = useState<VideoErrorCode | null>(null);
  const [actionPending, setActionPending] = useState(false);
  const [actionError, setActionError] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const promptInput = useRef<HTMLTextAreaElement>(null);
  const durationInput = useRef<HTMLSelectElement>(null);
  const advancedSettings = useRef<HTMLDetailsElement>(null);
  const returnToPrompt = useRef(false);
  const returnToSettings = useRef(false);
  const promptHelpId = useId();
  const titleId = useId();
  const descriptionId = useId();
  const submitting = useRef(false);

  const showNotice = useCallback((code: VideoErrorCode, detail?: string) => {
    returnToPrompt.current = code === 'PROMPT_REQUIRED' || code === 'PROMPT_TOO_LONG';
    returnToSettings.current = code === 'INVALID_OPTIONS';
    setError(detail || videoNotices[code].message);
    setActionError('');
    setNotice(code);
  }, []);

  useEffect(() => {
    if (notice && dialog.current && !dialog.current.open) dialog.current.showModal();
    if (!notice && dialog.current?.open) dialog.current.close();
  }, [notice]);

  useEffect(() => {
    if (editingDraft) promptInput.current?.focus();
  }, [editingDraft]);

  useEffect(() => {
    const controller = new AbortController();
    if (!preview) fetch('/api/video', { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error('Local generation is unavailable.');
      setReadiness(await response.json());
    }).catch(() => { if (!controller.signal.aborted) showNotice('SERVICE_UNAVAILABLE'); });
    try {
      const savedPrompt = localStorage.getItem(draftKey);
      setPrompt(savedPrompt || '');
      let savedOptions: unknown;
      try {
        savedOptions = JSON.parse(localStorage.getItem(optionsKey) || 'null');
        if (isVideoOptions(savedOptions)) setOptions(savedOptions);
      } catch { /* Invalid saved settings fall back to the defaults. */ }
      const saved = preview ? null : JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved?.id && /^[0-9a-f-]{36}$/i.test(saved.id)) {
        const submittedOptions = isVideoOptions(saved.options) ? saved.options : { ...DEFAULT_VIDEO_OPTIONS };
        setTask({ id: saved.id, status: 'submitting', options: submittedOptions });
        const resumeDraft = localStorage.getItem(draftModeKey) === saved.id;
        editingDraftRef.current = resumeDraft;
        setEditingDraft(resumeDraft);
        setPrompt(resumeDraft ? savedPrompt ?? saved.prompt ?? '' : saved.prompt || '');
        setOptions(resumeDraft && isVideoOptions(savedOptions) ? savedOptions : submittedOptions);
      }
    } catch { /* A malformed receipt must never trigger a paid request. */ }
    setInitialized(true);
    return () => controller.abort();
  }, [preview, showNotice]);

  const checkStatus = useCallback(async (id: string) => {
    setChecking(true);
    try {
      const response = await fetch(`/api/video/${encodeURIComponent(id)}`);
      const data = await response.json();
      if (!response.ok) {
        const code: VideoErrorCode = response.status === 401 ? 'LOGIN_REQUIRED' :
          isVideoErrorCode(data.code) ? data.code : 'SERVICE_UNAVAILABLE';
        if (editingDraftRef.current) setError(data.error || videoNotices[code].message);
        else showNotice(code, data.error);
        return false;
      }
      setTask(data);
      if (!editingDraftRef.current && isVideoOptions(data.options)) setOptions(data.options);
      setError('');
      if (data.status === 'failed' || data.errorCode) {
        const code: VideoErrorCode = isVideoErrorCode(data.errorCode) ? data.errorCode : 'GENERATION_FAILED';
        if (editingDraftRef.current) setError(videoNotices[code].message);
        else showNotice(code);
        return false;
      }
      return true;
    } catch {
      if (editingDraftRef.current) setError(videoNotices.SERVICE_UNAVAILABLE.message);
      else showNotice('SERVICE_UNAVAILABLE');
      return false;
    } finally { setChecking(false); }
  }, [showNotice]);

  useEffect(() => {
    if (!task || !['submitting', 'queued', 'running'].includes(task.status) || error || submitting.current) return;
    const timer = setTimeout(() => { void checkStatus(task.id); }, task.status === 'submitting' ? 0 : 5000);
    return () => clearTimeout(timer);
  }, [task, error, checkStatus]);

  async function generate() {
    if (!initialized || submitting.current || task) return;
    if (!preview && (!readiness?.configured || !readiness.enabled || !consent)) return;
    const promptError = getPromptError(prompt);
    if (promptError) { showNotice(promptError); return; }
    if (preview) {
      setError('');
      setPromptChecked(true);
      return;
    }
    submitting.current = true;
    setError('');
    const id = crypto.randomUUID();
    try {
      localStorage.setItem(storageKey, JSON.stringify({ id, prompt, options }));
      setTask({ id, status: 'submitting', options });
      const response = await fetch('/api/video', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, prompt, options }),
      });
      const data = await response.json();
      if (!response.ok) {
        // These route responses occur before any billable submission. Allow the
        // user to sign in or correct input; ambiguous failures keep the receipt.
        if ([400, 401, 403].includes(response.status)) {
          localStorage.removeItem(storageKey);
          setTask(null);
        }
        const code = response.status === 401 ? 'LOGIN_REQUIRED' : isVideoErrorCode(data.code) ? data.code :
          [400, 403, 429].includes(response.status) ? 'SERVICE_UNAVAILABLE' : 'SUBMISSION_UNKNOWN';
        showNotice(code, data.error);
        return;
      }
      setTask(data);
      if (data.status === 'failed' || data.errorCode) showNotice(isVideoErrorCode(data.errorCode) ? data.errorCode : 'GENERATION_FAILED');
    } catch {
      showNotice('SUBMISSION_UNKNOWN');
    } finally { submitting.current = false; }
  }

  async function noticeAction() {
    setActionPending(true);
    setActionError('');
    try {
      if (notice === 'PROMPT_REQUIRED' || notice === 'PROMPT_TOO_LONG') {
        setNotice(null);
      } else if (notice === 'INVALID_OPTIONS') {
        setNotice(null);
      } else if (notice === 'LOGIN_REQUIRED') {
        localStorage.setItem(draftKey, prompt);
        const result = await authClient.signIn.social({ provider: 'google', callbackURL: window.location.href });
        if (result.error) throw new Error('Sign in could not be started. Please try again.');
      } else if (task && (notice === 'LINK_EXPIRED' || notice === 'SUBMISSION_UNKNOWN' || notice === 'SERVICE_UNAVAILABLE')) {
        if (await checkStatus(task.id)) setNotice(null);
      } else if (task) {
        await navigator.clipboard.writeText(task.id);
        setActionError('Task ID copied.');
      }
    } catch {
      setActionError(notice === 'LOGIN_REQUIRED' ? 'Sign in could not be started. Please try again.' : 'Unable to copy the task ID. You can select and copy it below.');
    } finally { setActionPending(false); }
  }

  const isPromptNotice = notice === 'PROMPT_REQUIRED' || notice === 'PROMPT_TOO_LONG';
  const noticeActionLabel = notice === 'INVALID_OPTIONS' ? 'Edit settings' : isPromptNotice ? 'Edit prompt' : notice === 'LOGIN_REQUIRED' ? 'Sign in' : notice === 'LINK_EXPIRED' ? 'Refresh link' :
    notice === 'SUBMISSION_UNKNOWN' || notice === 'SERVICE_UNAVAILABLE' ? 'Check status' : 'Copy task ID';

  function changeOption(key: keyof VideoOptions, value: string | boolean) {
    const next = { ...options, [key]: value };
    if (!isVideoOptions(next)) return;
    setOptions(next);
    setConsent(false);
    try { localStorage.setItem(optionsKey, JSON.stringify(next)); } catch { /* In-memory settings remain available. */ }
  }

  function editDraft() {
    editingDraftRef.current = true;
    setEditingDraft(true);
    setConsent(false);
    returnToPrompt.current = true;
    setNotice(null);
    try {
      if (task) localStorage.setItem(draftModeKey, task.id);
      localStorage.setItem(draftKey, prompt);
      localStorage.setItem(optionsKey, JSON.stringify(options));
    } catch { /* Editing still works without persistent storage. */ }
    if (!dialog.current?.open) promptInput.current?.focus();
  }

  const submittedOptions = task?.options || DEFAULT_VIDEO_OPTIONS;
  const draftLocked = !initialized || (Boolean(task) && !editingDraft);

  return <section className="preview-workspace-card video-generator" aria-label="AI video generator">
    <div className="preview-workspace-heading"><span className="eyebrow">{preview ? 'Settings preview' : 'LOCAL TEST · PAID GENERATION'}</span><h2>Seedance 1.5 Pro</h2></div>
    <textarea ref={promptInput} className="preview-prompt" aria-label={copy.inputLabel} aria-describedby={promptHelpId} placeholder={copy.placeholder}
      value={prompt} disabled={draftLocked} onChange={(event) => {
        setPrompt(event.target.value);
        setPromptChecked(false);
        if (!task) setError('');
        try { localStorage.setItem(draftKey, event.target.value); } catch { /* Keep the in-memory draft if storage is unavailable. */ }
      }} />
    <p id={promptHelpId} className="generation-prompt-count">{prompt.length.toLocaleString('en-US')} / {MAX_PROMPT_LENGTH.toLocaleString('en-US')} characters</p>
    <fieldset className="generation-options" disabled={draftLocked}>
      <legend>Video settings</legend>
      <label>Aspect ratio<select aria-label="Aspect ratio" value={options.aspectRatio} onChange={(event) => changeOption('aspectRatio', event.target.value)}>
        {VIDEO_ASPECT_RATIOS.map((value) => <option key={value} value={value}>{value === 'auto' ? 'Auto' : value}</option>)}
      </select></label>
      <label>Resolution<select aria-label="Resolution" value={options.resolution} onChange={(event) => changeOption('resolution', event.target.value)}>
        {VIDEO_RESOLUTIONS.map((value) => <option key={value} value={value}>{value}</option>)}
      </select></label>
      <details ref={advancedSettings} className="generation-advanced">
        <summary>Duration &amp; audio</summary>
        <div className="generation-advanced-options">
          <label>Duration<select ref={durationInput} aria-label="Duration" value={options.duration} onChange={(event) => changeOption('duration', event.target.value)}>
            {VIDEO_DURATIONS.map((value) => <option key={value} value={value}>{value} seconds</option>)}
          </select></label>
          <label>Audio<select aria-label="Audio" value={String(options.generateAudio)} onChange={(event) => changeOption('generateAudio', event.target.value === 'true')}>
            <option value="false">No audio</option><option value="true">With audio</option>
          </select></label>
        </div>
      </details>
    </fieldset>
    <p className="generation-prompt-count">{preview ? 'Video generation is currently unavailable on this site.' : 'Longer videos, higher resolution and generated audio may cost more.'}</p>
    {task && <div className="generation-setup" role="status">
      {editingDraft ? 'You can edit your draft. Your existing task is unchanged; another generation is currently locked.' : 'An existing task is saved. You can edit a draft without starting another generation.'}
      {!editingDraft && <button type="button" className="generation-status-button" onClick={editDraft}>Edit draft</button>}
    </div>}
    {readiness && (!readiness.configured || !readiness.enabled) && <p className="generation-setup" role="status">
      Local setup needed. {readiness.missing.length > 0 && `Configure: ${readiness.missing.join(', ')}. `}
      {!readiness.enabled && 'Paid generation is locked until the local test is enabled.'}
    </p>}
    {!preview && <label className="generation-consent"><input type="checkbox" checked={consent} disabled={!initialized || Boolean(task)} onChange={(event) => setConsent(event.target.checked)} />
      <span>I understand this uses paid fal credits and sends my prompt to fal. One local test only.</span>
    </label>}
    <button className="preview-workspace-action" type="button" onClick={() => { void generate(); }}
      disabled={!initialized || Boolean(task) || (!preview && (!readiness?.configured || !readiness.enabled || !consent))}>{preview ? 'Check prompt' : 'Generate video'}</button>
    {promptChecked && <p role="status">Prompt validated.</p>}
    {error && <p className="generation-error" role="alert">{error}</p>}
    {task && <div className="generation-result">
      <p role="status">{task.error || statuses[task.status]}</p>
      <p className="generation-task-id">Task: {task.id}</p>
      <p>Submitted settings: {submittedOptions.duration} sec · {submittedOptions.resolution} · {submittedOptions.aspectRatio} · {submittedOptions.generateAudio ? 'With audio' : 'No audio'}</p>
      <button type="button" className="generation-status-button" disabled={checking} onClick={() => { void checkStatus(task.id); }}>{checking ? 'Checking…' : 'Check task status'}</button>
      {task.videoUrl && <video controls playsInline preload="metadata" src={task.videoUrl} aria-label="Generated video" onError={() => {
        // A player error alone does not prove that a signed link has expired.
        if (task.linksExpireAt && Date.now() >= task.linksExpireAt) showNotice('LINK_EXPIRED');
      }} />}
      {task.downloadUrl && <a className="generation-download" href={task.downloadUrl} onClick={(event) => {
        if (task.linksExpireAt && Date.now() >= task.linksExpireAt) {
          event.preventDefault();
          showNotice('LINK_EXPIRED');
        }
      }}>Download video</a>}
    </div>}
    <dialog ref={dialog} className="generation-dialog" aria-labelledby={titleId} aria-describedby={descriptionId}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}
      onCancel={(event) => { event.preventDefault(); setNotice(null); }} onClose={() => {
        setNotice(null);
        if (returnToPrompt.current) { returnToPrompt.current = false; promptInput.current?.focus(); }
        if (returnToSettings.current) {
          returnToSettings.current = false;
          if (advancedSettings.current) advancedSettings.current.open = true;
          durationInput.current?.focus();
        }
      }}>
      {notice && <>
        <h3 id={titleId}>{videoNotices[notice].title}</h3>
        <p id={descriptionId}>{videoNotices[notice].message}</p>
        {task && <p className="generation-task-id">Task: {task.id}</p>}
        {actionError && <p role="status">{actionError}</p>}
        <div className="generation-dialog-actions">
          {task && !editingDraft && <button type="button" className="generation-status-button" onClick={editDraft}>Edit draft</button>}
          {(isPromptNotice || notice === 'INVALID_OPTIONS' || notice === 'LOGIN_REQUIRED' || task) && <button type="button" className="generation-status-button" disabled={actionPending || checking} onClick={() => { void noticeAction(); }}>
            {actionPending ? 'Please wait…' : noticeActionLabel}
          </button>}
          <button type="button" className="generation-status-button" onClick={() => setNotice(null)}>Close</button>
        </div>
      </>}
    </dialog>
  </section>;
}
