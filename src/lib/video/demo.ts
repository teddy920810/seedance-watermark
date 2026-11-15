import { isVideoOptions, type VideoOptions } from './options';

export const demoStorageKey = 'seedances-video-demo-task';
export const demoScenarios = ['success', 'quota', 'failure', 'expired-link', 'quota-timeout'] as const;
export type DemoScenario = typeof demoScenarios[number];
export type DemoTask = {
  id: string;
  prompt: string;
  options: VideoOptions;
  scenario: DemoScenario;
  startedAt: number;
  cancelled?: boolean;
  renewed?: boolean;
};

export function readDemoTask(storage: Storage): DemoTask | null {
  try {
    const task = JSON.parse(storage.getItem(demoStorageKey) || 'null') as DemoTask | null;
    return task && typeof task.id === 'string' && typeof task.prompt === 'string' &&
      isVideoOptions(task.options) && demoScenarios.includes(task.scenario) &&
      Number.isFinite(task.startedAt) ? task : null;
  } catch {
    return null;
  }
}

export function getDemoProgress(task: DemoTask, now: number) {
  if (task.cancelled) return { status: 'cancelled' } as const;
  const elapsed = now - task.startedAt;
  if (task.scenario === 'quota-timeout' && elapsed >= 6000) return { status: 'paused' } as const;
  const wait = task.scenario === 'quota' || task.scenario === 'quota-timeout' ? 6000 : 0;
  if (elapsed < wait) return { status: 'waiting', nextAt: task.startedAt + wait } as const;
  if (elapsed < wait + 1200) return { status: 'queued', nextAt: task.startedAt + wait + 1200 } as const;
  if (elapsed < wait + 3000) return { status: 'running', nextAt: task.startedAt + wait + 3000 } as const;
  return { status: task.scenario === 'failure' ? 'failed' : 'completed' } as const;
}
