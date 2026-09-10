/**
 * Josh's prepared Black repertoire. Kept short on purpose: the moment the
 * visitor's move stops matching, we hand off to Stockfish (see chessEngine.ts)
 * rather than trying to cover every deviation here.
 */
export interface BookLine {
  /** Alternating SAN moves starting with White: [w1, b1, w2, b2, ...] */
  moves: string[];
}

/** Caro-Kann, Classical Variation. Played against 1.e4. */
export const caroKann: BookLine = {
  moves: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Bf5'],
};

/** King's Indian Defense setup. Played against 1.d4. */
export const kingsIndian: BookLine = {
  moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6'],
};

/**
 * Fallback for any first move other than e4/d4: a flexible King's
 * Indian-style fianchetto setup. Unlike the two lines above, this doesn't
 * require White's moves to match anything — Black just plays its own plan
 * as long as each move is still legal.
 */
export const flexibleSetup: string[] = ['Nf6', 'g6', 'Bg7', 'd6'];

export function pickBookLine(firstMoveSan: string): BookLine | null {
  if (firstMoveSan === 'e4') return caroKann;
  if (firstMoveSan === 'd4') return kingsIndian;
  return null;
}
