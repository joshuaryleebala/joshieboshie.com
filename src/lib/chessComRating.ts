const CHESS_COM_USERNAME = 'joshieboshie07';
export const DEFAULT_ELO = 1500;

interface ChessComStats {
  chess_rapid?: {
    last?: { rating?: number };
  };
}

/** Live chess.com Rapid rating, fetched fresh on every page load. */
export async function fetchLiveRapidRating(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.chess.com/pub/player/${CHESS_COM_USERNAME}/stats`);
    if (!res.ok) return null;
    const data: ChessComStats = await res.json();
    const rating = data.chess_rapid?.last?.rating;
    return typeof rating === 'number' ? rating : null;
  } catch {
    return null;
  }
}
