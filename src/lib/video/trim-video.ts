import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const require = createRequire(import.meta.url);

export function ffmpegPath() {
  const directory = dirname(require.resolve('ffmpeg-static/package.json'));
  return join(directory, process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');
}

export async function trimFreeVideo(bytes: Uint8Array): Promise<Uint8Array> {
  const dir = await mkdtemp(join(tmpdir(), 'seedances-free-video-'));
  try {
    const input = join(dir, 'source.mp4');
    const output = join(dir, 'result.mp4');
    await writeFile(input, bytes);
    const { stdout } = await run(ffmpegPath(), [
      '-nostdin', '-v', 'error', '-xerror', '-protocol_whitelist', 'file', '-f', 'mov', '-i', input,
      '-map', '0:v:0', '-an', '-vf', 'fps=24', '-frames:v', '72', '-c:v', 'libx264', '-preset', 'veryfast',
      '-threads', '2', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-progress', 'pipe:1', output,
    ], { timeout: 20_000, maxBuffer: 256 * 1024, env: {} });
    if (!/^frame=72\s*$/m.test(stdout)) throw new Error('Incomplete free video');
    return await readFile(output);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
