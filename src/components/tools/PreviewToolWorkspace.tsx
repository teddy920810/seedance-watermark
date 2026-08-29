import { useState } from 'react';

export interface PreviewWorkspaceCopy {
  eyebrow: string;
  heading: string;
  inputLabel: string;
  inputHelp: string;
  placeholder: string;
  options: string[];
  actionLabel: string;
  previewNote: string;
}

interface Props {
  mode: 'video-preview' | 'prompt-preview';
  copy: PreviewWorkspaceCopy;
}

export default function PreviewToolWorkspace({ mode, copy }: Props) {
  const [fileName, setFileName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [showNote, setShowNote] = useState(false);
  const ready = mode === 'video-preview' ? Boolean(fileName) : Boolean(prompt.trim());

  return (
    <section className="preview-workspace-card" aria-label={copy.heading || copy.inputLabel}>
      {(copy.eyebrow || copy.heading) && <div className="preview-workspace-heading">
        {copy.eyebrow && <span className="eyebrow">{copy.eyebrow}</span>}
        {copy.heading && <h2>{copy.heading}</h2>}
      </div>}

      {mode === 'video-preview' ? (
        <label className="drop-zone preview-drop-zone">
          <span className="upload-icon" aria-hidden="true">↑</span>
          <strong>{fileName || copy.inputLabel}</strong>
          <span>{fileName ? 'Selected locally' : copy.inputHelp}</span>
          <input
            className="sr-only"
            type="file"
            accept="video/*"
            aria-label={copy.inputLabel}
            onChange={(event) => {
              setFileName(event.target.files?.[0]?.name ?? '');
              setShowNote(false);
            }}
          />
        </label>
      ) : (
        <textarea
          className="preview-prompt"
          value={prompt}
          placeholder={copy.placeholder}
          aria-label={copy.inputLabel}
          onChange={(event) => {
            setPrompt(event.target.value);
            setShowNote(false);
          }}
        />
      )}

      {copy.options.length > 0 && <div className="preview-options">{copy.options.map((option) => <span key={option}>{option}</span>)}</div>}
      <button className="preview-workspace-action" type="button" disabled={!ready} onClick={() => setShowNote(true)}>{copy.actionLabel} →</button>
      {showNote && <p className="workspace-preview-note" role="status">{copy.previewNote}</p>}
    </section>
  );
}
