import { useEffect, useRef, useState } from 'react';
import { demoStorageKey, getDemoProgress, readDemoTask, type DemoScenario, type DemoTask } from '../../lib/video/demo';
import type { VideoOptions } from '../../lib/video/options';

export function useVideoDemo(enabled: boolean) {
  const [task, setTask] = useState<DemoTask | null>(null);
  const [now, setNow] = useState(0);
  const receipt = useRef<DemoTask | null>(null);
  const progress = task ? getDemoProgress(task, now) : null;
  const nextAt = progress && 'nextAt' in progress ? progress.nextAt ?? null : null;

  useEffect(() => {
    if (!enabled) return;
    const restore = () => {
      receipt.current = readDemoTask(localStorage);
      setTask(receipt.current);
      setNow(Date.now());
    };
    restore();
    const sync = (event: StorageEvent) => {
      if (event.key === demoStorageKey || event.key === null) restore();
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [enabled]);

  useEffect(() => {
    if (!enabled || nextAt === null) return;
    const timer = window.setTimeout(() => setNow(Math.max(nextAt, Date.now())), Math.max(0, nextAt - Date.now()));
    return () => window.clearTimeout(timer);
  }, [enabled, nextAt]);

  function save(next: DemoTask) {
    receipt.current = next;
    setTask(next);
    setNow(Date.now());
    try { localStorage.setItem(demoStorageKey, JSON.stringify(next)); }
    catch { /* The demo can still run in this tab. */ }
  }

  function start(prompt: string, options: VideoOptions, scenario: DemoScenario) {
    const existing = readDemoTask(localStorage) ?? receipt.current;
    if (existing && 'nextAt' in getDemoProgress(existing, Date.now())) return;
    save({ id: crypto.randomUUID(), prompt, options, scenario, startedAt: Date.now() });
  }

  return {
    task, progress, active: nextAt !== null, start,
    cancel() {
      if (receipt.current && 'nextAt' in getDemoProgress(receipt.current, Date.now())) {
        save({ ...receipt.current, cancelled: true });
      }
    },
    renew() {
      if (receipt.current) save({ ...receipt.current, renewed: true });
    },
  };
}
