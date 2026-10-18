/// <reference lib="webworker" />
import { factorInteger } from './factorization-engine';
addEventListener('message', ({ data }: MessageEvent<{ input: string; timeMs: number | null; requireProof?: boolean }>) => {
  try {
    const result = factorInteger(data.input, { timeMs: data.timeMs, requireProof: data.requireProof, onProgress: result => postMessage({ kind: 'progress', result }) });
    postMessage({ kind: 'result', result });
  } catch (error) {
    postMessage({ kind: 'error', message: error instanceof Error ? error.message : String(error) });
  }
});
