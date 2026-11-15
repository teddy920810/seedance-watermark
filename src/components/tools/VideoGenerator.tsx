import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { PreviewWorkspaceCopy } from './PreviewToolWorkspace';
import { authClient } from '../auth/auth-client';
import { getPromptError, MAX_PROMPT_LENGTH, isVideoErrorCode, videoNotices, type VideoErrorCode } from '../../lib/video/errors';
import { DEFAULT_VIDEO_OPTIONS, VIDEO_DURATIONS, VIDEO_RESOLUTIONS, VIDEO_ASPECT_RATIOS, isVideoOptions, type VideoOptions } from '../../lib/video/options';
import { PREVIEW_OPTIONS } from '../../lib/video/preview-pilot';
import { demoScenarios, type DemoScenario } from '../../lib/video/demo';
import demoSample from '../../lib/video/demo-sample.webm?url';
import { useVideoDemo } from './useVideoDemo';

type Task = { id: string; status: 'submitting' | 'queued' | 'running' | 'completed' | 'failed'; options?: VideoOptions; error?: string; errorCode?: VideoErrorCode; videoUrl?: string; downloadUrl?: string; linksExpireAt?: number };
type Readiness = { configured: boolean; enabled: boolean; missing: string[] };
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
const demoStatus = {
  waiting: 'Waiting for quota to recover.',
  queued: 'Demo queued.',
  running: 'Running the demo.',
  completed: 'Demo complete.',
  failed: 'Demo failed. Your draft is ready for another try.',
  cancelled: 'Demo cancelled.',
  paused: 'Demo paused. Quota did not recover within the waiting window.',
};

export default function VideoGenerator({ copy, preview = false, hostedDemo = false, hostedPilot = false }: {
  copy: PreviewWorkspaceCopy;
  preview?: boolean;
  hostedDemo?: boolean;
  hostedPilot?: boolean;
}) {
  const [mode, setMode] = useState<'preview' | 'demo' | 'pilot'>(hostedDemo ? 'demo' : preview ? 'preview' : 'pilot');
  const pilot = mode === 'pilot';
  const paidPreview = hostedPilot && pilot;
  const storageKey = hostedPilot ? 'seedances-fal-preview-task' : 'seedances-fal-local-task';
  const demo = useVideoDemo(mode === 'demo');
  const [scenario, setScenario] = useState<DemoScenario>('success');
  const [emptyPrompt, setEmptyPrompt] = useState(false);
  const [pendingExample, setPendingExample] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const shownDemoFailure = useRef<string | null>(null);
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
  const promptId = useId();
  const promptHelpId = useId();
  const promptErrorId = useId();
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
    const shouldOpen = notice || pendingExample;
    if (shouldOpen && dialog.current && !dialog.current.open) dialog.current.showModal();
    if (!shouldOpen && dialog.current?.open) dialog.current.close();
  }, [notice, pendingExample]);

  useEffect(() => {
    if (demo.task && demo.progress?.status === 'failed' && shownDemoFailure.current !== demo.task.id) {
      shownDemoFailure.current = demo.task.id;
      showNotice('GENERATION_FAILED', demoStatus.failed);
    }
  }, [demo.task, demo.progress?.status, showNotice]);

  useEffect(() => {
    if (editingDraft) promptInput.current?.focus();
  }, [editingDraft]);

  useEffect(() => {
    const controller = new AbortController();
    const requestedMode = new URLSearchParams(window.location.search).get('mode');
    const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
    const nextMode = requestedMode === 'preview' ? 'preview'
      : hostedPilot && requestedMode === 'pilot' ? 'pilot'
        : hostedDemo || (!preview && requestedMode === 'demo' && loopback) ? 'demo'
        : preview ? 'preview' : 'pilot';
    setMode(nextMode);
    if (nextMode === 'pilot') fetch('/api/video', { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error('Local generation is unavailable.');
      setReadiness(await response.json());
    }).catch(() => { if (!controller.signal.aborted) showNotice('SERVICE_UNAVAILABLE'); });
    try {
      const savedPrompt = localStorage.getItem(draftKey);
      setPrompt(savedPrompt || '');
      let savedOptions: unknown;
      try {
        savedOptions = JSON.parse(localStorage.getItem(optionsKey) || 'null');
        if (hostedPilot && nextMode === 'pilot') setOptions(PREVIEW_OPTIONS);
        else if (isVideoOptions(savedOptions)) setOptions(savedOptions);
      } catch { /* Invalid saved settings fall back to the defaults. */ }
      const saved = nextMode !== 'pilot' ? null : JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved?.id && /^[0-9a-f-]{36}$/i.test(saved.id)) {
        const submittedOptions = isVideoOptions(saved.options) ? saved.options : { ...DEFAULT_VIDEO_OPTIONS };
        setTask({ id: saved.id, status: 'submitting', options: submittedOptions });
        const resumeDraft = localStorage.getItem(draftModeKey) === saved.id;
        editingDraftRef.current = resumeDraft;
        setEditingDraft(resumeDraft);
        setPrompt(resumeDraft ? savedPrompt ?? saved.prompt ?? '' : saved.prompt || '');
        setOptions(hostedPilot ? PREVIEW_OPTIONS : resumeDraft && isVideoOptions(savedOptions) ? savedOptions : submittedOptions);
      }
    } catch { /* A malformed receipt must never trigger a paid request. */ }
    setInitialized(true);
    return () => controller.abort();
  }, [preview, hostedDemo, hostedPilot, showNotice, storageKey]);

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
    if (pilot && (!readiness?.configured || !readiness.enabled || !consent)) return;
    const promptError = getPromptError(prompt);
    if (promptError) {
      if (pilot) showNotice(promptError);
      else {
        setEmptyPrompt(promptError === 'PROMPT_REQUIRED');
        promptInput.current?.focus();
      }
      return;
    }
    if (mode === 'preview') {
      setError('');
      setPromptChecked(true);
      return;
    }
    if (mode === 'demo') {
      setError('');
      setCopyStatus('');
      demo.start(prompt, options, scenario);
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
      } else if (mode === 'demo' && notice === 'LINK_EXPIRED') {
        demo.renew();
        setError('');
        setNotice(null);
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
    if (paidPreview || !isVideoOptions(next)) return;
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

  const updatePrompt = useCallback((value: string) => {
    setPrompt(value);
    setEmptyPrompt(false);
    setPromptChecked(false);
    try { localStorage.setItem(draftKey, value); } catch { /* Keep the in-memory draft. */ }
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const useExample = (event: MouseEvent) => {
      const button = event.target instanceof Element && event.target.closest<HTMLButtonElement>('button[data-video-prompt]');
      const example = button && button.dataset.videoPrompt;
      if (!example || (task && !editingDraft)) return;
      if (prompt.trim() && prompt !== example) {
        setPendingExample(example);
      } else {
        updatePrompt(example);
        promptInput.current?.focus();
      }
    };
    document.addEventListener('click', useExample);
    return () => document.removeEventListener('click', useExample);
  }, [initialized, prompt, task, editingDraft, updatePrompt]);

  const submittedOptions = task?.options || DEFAULT_VIDEO_OPTIONS;
  const draftLocked = !initialized || (Boolean(task) && !editingDraft);
  const excess = Math.max(0, prompt.length - MAX_PROMPT_LENGTH);
  const inlinePromptError = !pilot && (excess
    ? `Shorten your prompt by ${excess.toLocaleString('en-US')} character${excess === 1 ? '' : 's'}.`
    : emptyPrompt ? 'Enter a prompt to continue.' : '');
  const demoTask = demo.task;
  const demoState = demo.progress?.status;

  return <section className="preview-workspace-card video-generator" aria-label="AI video generator">
    <div className="generation-prompt-header">
      <label htmlFor={promptId}>{copy.inputLabel}</label>
      <span id={promptHelpId} className="generation-caption">{prompt.length.toLocaleString('en-US')} / {MAX_PROMPT_LENGTH.toLocaleString('en-US')} characters</span>
    </div>
    <textarea id={promptId} ref={promptInput} className="preview-prompt" rows={3}
      aria-invalid={Boolean(inlinePromptError)} aria-describedby={inlinePromptError ? `${promptHelpId} ${promptErrorId}` : promptHelpId} placeholder={copy.placeholder}
      value={prompt} disabled={draftLocked} onChange={(event) => {
        updatePrompt(event.target.value);
        if (!task) setError('');
      }} />
    <p id={promptErrorId} className="generation-reminder" aria-live="polite" hidden={!inlinePromptError}>{inlinePromptError}</p>
    <fieldset className="generation-options" disabled={draftLocked || paidPreview}>
      <legend>Video settings</legend>
      <label>Aspect ratio<select aria-label="Aspect ratio" value={options.aspectRatio} onChange={(event) => changeOption('aspectRatio', event.target.value)}>
        {VIDEO_ASPECT_RATIOS.map((value) => <option key={value} value={value}>{value === 'auto' ? 'Auto' : value}</option>)}
      </select></label>
      <label>Resolution<select aria-label="Resolution" value={options.resolution} onChange={(event) => changeOption('resolution', event.target.value)}>
        {VIDEO_RESOLUTIONS.map((value) => <option key={value} value={value}>{value}</option>)}
      </select></label>
      <details ref={advancedSettings} className="generation-advanced">
        <summary><span>Duration &amp; audio</span> <span className="generation-caption">· {options.duration} sec · {options.generateAudio ? 'With audio' : 'No audio'}</span></summary>
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
    {mode === 'demo' ? <label className="generation-demo-scenario">Demo scenario
      <select value={scenario} onChange={(event) => {
        const next = demoScenarios.find((value) => value === event.target.value);
        if (next) setScenario(next);
      }}>
        <option value="success">Normal generation</option><option value="quota">Quota recovers</option>
        <option value="failure">Generation fails</option><option value="expired-link">Download link expires</option>
        <option value="quota-timeout">Quota wait times out</option>
      </select>
    </label> : <p className="generation-reminder">{pilot ? 'Longer videos, higher resolution and generated audio may cost more.' : 'Video generation is not open yet. You can review a prompt and save settings in this browser.'}</p>}
    {task && <div className="generation-setup" role="status">
      {editingDraft ? 'You can edit your draft. Your existing task is unchanged; another generation is currently locked.' : 'An existing task is saved. You can edit a draft without starting another generation.'}
      {!editingDraft && <button type="button" className="generation-status-button" onClick={editDraft}>Edit draft</button>}
    </div>}
    {readiness && (!readiness.configured || !readiness.enabled) && <p className="generation-setup" role="status">
      Local setup needed. {readiness.missing.length > 0 && `Configure: ${readiness.missing.join(', ')}. `}
      {!readiness.enabled && 'Paid generation is locked until the local test is enabled.'}
    </p>}
    {paidPreview && <p className="generation-caption">One private test video · 4 sec · 480p · 16:9 · No audio · US$1 maximum.</p>}
    {pilot && <label className="generation-consent"><input type="checkbox" checked={consent} disabled={!initialized || Boolean(task)} onChange={(event) => setConsent(event.target.checked)} />
      <span>I understand this uses paid fal credits and sends my prompt to fal. One local test only.</span>
    </label>}
    <div className="generation-actions">
      <div className="generation-mode generation-caption"><span>Seedance 2.0 Fast</span><span>{paidPreview ? 'PRIVATE PREVIEW · PAID GENERATION' : pilot ? 'LOCAL TEST · PAID GENERATION' : mode === 'demo' ? 'DEMO · NO CHARGE' : 'Settings preview'}</span></div>
      <button className="preview-workspace-action" type="button" onClick={() => { void generate(); }}
        disabled={!initialized || Boolean(task) || (pilot ? !readiness?.configured || !readiness.enabled || !consent : excess > 0 || demo.active)}>
        {pilot ? 'Generate now' : mode === 'demo' ? 'Run demo' : 'Review prompt'}
      </button>
    </div>
    {promptChecked && <div className="generation-caption" role="status">
      <strong>Prompt review</strong>
      <p>{prompt.trim().split(/\s+/).length < 8
        ? 'Add a specific subject, what it does, and where it happens.'
        : 'Check that the main subject, its action, and the setting are easy to identify. Add a camera direction if it matters.'}</p>
    </div>}
    {error && <p className="generation-error" role="alert">{error}</p>}
    {task && <div className="generation-result">
      <p role="status" className={task.error || task.status === 'failed' ? 'generation-reminder' : undefined}>{task.error || statuses[task.status]}</p>
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
    {mode === 'demo' && demoTask && demoState && <section className="generation-result" aria-label="Recent demo task">
      <h2>Recent demo task</h2>
      <p role="status">{demoStatus[demoState]}</p>
      <p className="generation-task-id">Task: {demoTask.id}</p>
      <p>Submitted settings: {demoTask.options.duration} sec · {demoTask.options.resolution} · {demoTask.options.aspectRatio} · {demoTask.options.generateAudio ? 'With audio' : 'No audio'}</p>
      {demoState === 'waiting' && <button type="button" className="generation-status-button" onClick={demo.cancel}>Cancel demo</button>}
      {demoState === 'completed' && <>
        <p className="generation-caption">This sample demonstrates playback and download. It is the same clip for every prompt and setting.</p>
        <video controls playsInline preload="auto" src={demoSample} aria-label="Demo video sample" />
        <a className="generation-download" href={demoSample} download="seedances-demo.webm" onClick={(event) => {
          if (demoTask.scenario === 'expired-link' && !demoTask.renewed) {
            event.preventDefault();
            showNotice('LINK_EXPIRED', 'The demo download link expired. Refresh it to download the sample.');
          }
        }}>Download sample</a>
        <button type="button" className="generation-status-button" onClick={async () => {
          try { await navigator.clipboard.writeText(demoTask.prompt); setCopyStatus('Prompt copied.'); }
          catch { setCopyStatus('Copy is unavailable. Select the submitted prompt below.'); }
        }}>Copy prompt</button>
        <p role="status" hidden={!copyStatus}>{copyStatus}</p>
        <details><summary>Submitted prompt</summary><p>{demoTask.prompt}</p></details>
      </>}
    </section>}
    <dialog ref={dialog} className="generation-dialog" aria-labelledby={titleId} aria-describedby={descriptionId}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}
      onCancel={(event) => { event.preventDefault(); setNotice(null); setPendingExample(null); }} onClose={() => {
        setNotice(null);
        setPendingExample(null);
        if (returnToPrompt.current) { returnToPrompt.current = false; promptInput.current?.focus(); }
        if (returnToSettings.current) {
          returnToSettings.current = false;
          if (advancedSettings.current) advancedSettings.current.open = true;
          durationInput.current?.focus();
        }
      }}>
      {pendingExample ? <>
        <h3 id={titleId}>Replace your draft?</h3>
        <p id={descriptionId} className="generation-reminder">This replaces the prompt in your editor. Your video settings will stay as selected.</p>
        <div className="generation-dialog-actions">
          <button type="button" className="generation-status-button" onClick={() => setPendingExample(null)}>Keep draft</button>
          <button type="button" className="generation-status-button" onClick={() => {
            updatePrompt(pendingExample);
            returnToPrompt.current = true;
            setPendingExample(null);
          }}>Replace draft</button>
        </div>
      </> : notice && <>
        <h3 id={titleId}>{videoNotices[notice].title}</h3>
        <p id={descriptionId} className="generation-reminder">{mode === 'demo' && error ? error : videoNotices[notice].message}</p>
        {(task || demoTask) && <p className="generation-task-id">Task: {(task || demoTask)?.id}</p>}
        {actionError && <p className="generation-reminder" role="status">{actionError}</p>}
        <div className="generation-dialog-actions">
          {task && !editingDraft && <button type="button" className="generation-status-button" onClick={editDraft}>Edit draft</button>}
          {(isPromptNotice || notice === 'INVALID_OPTIONS' || notice === 'LOGIN_REQUIRED' || task || (mode === 'demo' && notice === 'LINK_EXPIRED')) && <button type="button" className="generation-status-button" disabled={actionPending || checking} onClick={() => { void noticeAction(); }}>
            {actionPending ? 'Please wait…' : noticeActionLabel}
          </button>}
          <button type="button" className="generation-status-button" onClick={() => setNotice(null)}>Close</button>
        </div>
      </>}
    </dialog>
  </section>;
}
