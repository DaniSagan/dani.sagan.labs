/// <reference lib="webworker" />
import { calculatePi } from './pi-engine';
addEventListener('message', ({ data }: MessageEvent<{ digits: number }>) => {
  try {
    const result = calculatePi(data.digits, progress => postMessage({ kind: 'progress', progress }));
    postMessage({ kind: 'result', result });
  } catch (error) {
    postMessage({ kind: 'error', message: error instanceof Error ? error.message : String(error) });
  }
});
