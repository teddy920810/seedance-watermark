import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { expect, it } from 'vitest';
import { ffmpegPath, trimFreeVideo } from './trim-video';

const run = promisify(execFile);

it('returns an MP4 with exactly three seconds and no audio from a four-second source', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'seedances-trim-test-'));
  const source = join(dir, 'source.mp4');
  const output = join(dir, 'output.mp4');
  try {
    await run(ffmpegPath(), ['-f', 'lavfi', '-i', 'color=c=red:s=320x180:r=24', '-f', 'lavfi', '-i', 'sine', '-t', '4', source]);
    await writeFile(output, await trimFreeVideo(await readFile(source)));
    const { stderr } = await run(ffmpegPath(), ['-i', output, '-f', 'null', '-']);
    expect(stderr).toMatch(/Duration: 00:00:03\.00/);
    expect(stderr).toMatch(/Video: h264/);
    expect(stderr).not.toMatch(/Stream .*Audio:/);
    await expect(trimFreeVideo(new Uint8Array([1, 2, 3]))).rejects.toThrow();
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
