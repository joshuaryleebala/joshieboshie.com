/**
 * Thin wrapper around the Stockfish Web Worker. The engine files
 * (public/engine/stockfish-18-lite-single.{js,wasm}, ~7MB) are only fetched
 * the first time getEngineMove() is actually called — i.e. once a visitor's
 * game leaves Josh's prepared opening book. Most visitors who stay in book
 * never download it at all.
 */
export interface EngineMove {
  from: string;
  to: string;
  promotion?: string;
}

const ELO_MIN = 1320;
const ELO_MAX = 3190;
const MOVE_TIME_MS = 1200;

let worker: Worker | null = null;
let readyPromise: Promise<void> | null = null;
let configuredElo = -1;

function waitForMessage(w: Worker, matches: (line: string) => boolean): Promise<string> {
  return new Promise((resolve) => {
    function handler(event: MessageEvent<string>) {
      if (matches(event.data)) {
        w.removeEventListener('message', handler);
        resolve(event.data);
      }
    }
    w.addEventListener('message', handler);
  });
}

function ensureWorker(): Worker {
  if (!worker) {
    worker = new Worker('/engine/stockfish-18-lite-single.js');
  }
  return worker;
}

async function ensureReady(): Promise<Worker> {
  const w = ensureWorker();
  if (!readyPromise) {
    readyPromise = (async () => {
      const uciOk = waitForMessage(w, (line) => line === 'uciok');
      w.postMessage('uci');
      await uciOk;
      const ready = waitForMessage(w, (line) => line === 'readyok');
      w.postMessage('isready');
      await ready;
    })();
  }
  await readyPromise;
  return w;
}

/** Call once per new game so the engine drops any prior search history. */
export function resetEngineGame(): void {
  worker?.postMessage('ucinewgame');
}

export async function getEngineMove(fen: string, targetElo: number): Promise<EngineMove> {
  const elo = Math.max(ELO_MIN, Math.min(ELO_MAX, Math.round(targetElo)));
  const w = await ensureReady();

  if (configuredElo !== elo) {
    w.postMessage('setoption name UCI_LimitStrength value true');
    w.postMessage(`setoption name UCI_Elo value ${elo}`);
    configuredElo = elo;
  }

  const bestMove = waitForMessage(w, (line) => line.startsWith('bestmove'));
  w.postMessage(`position fen ${fen}`);
  w.postMessage(`go movetime ${MOVE_TIME_MS}`);

  const line = await bestMove;
  const uciMove = line.split(' ')[1];
  return {
    from: uciMove.slice(0, 2),
    to: uciMove.slice(2, 4),
    promotion: uciMove.length > 4 ? uciMove.slice(4, 5) : undefined,
  };
}
