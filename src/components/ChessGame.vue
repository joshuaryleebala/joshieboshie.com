<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Chess, type Square } from 'chess.js';
import { Chessground } from '@lichess-org/chessground';
import '@lichess-org/chessground/assets/chessground.base.css';
import '@lichess-org/chessground/assets/chessground.cburnett.css';
import { caroKann, kingsIndian, flexibleSetup, pickBookLine, type BookLine } from '../lib/chessBook';
import { getEngineMove, resetEngineGame } from '../lib/chessEngine';
import { fetchLiveRapidRating, DEFAULT_ELO } from '../lib/chessComRating';

const boardEl = ref<HTMLElement | null>(null);
const moveHistory = ref<string[]>([]);
const statusText = ref('Your move');
const gameOver = ref(false);
const thinking = ref(false);
const rating = ref<number | null>(null);
const ratingStatus = ref<'loading' | 'live' | 'unavailable'>('loading');
const showUndoMessage = ref(false);

let game = new Chess();
let cgApi: ReturnType<typeof Chessground> | null = null;

// Opening-book bookkeeping (plain closures — internal, doesn't need reactivity).
let bookLine: BookLine | null = null;
let bookPly = 0;
let flexibleActive = false;
let flexibleIndex = 0;

const movePairs = computed(() => {
  const pairs: { num: number; white: string; black?: string }[] = [];
  for (let i = 0; i < moveHistory.value.length; i += 2) {
    pairs.push({ num: i / 2 + 1, white: moveHistory.value[i], black: moveHistory.value[i + 1] });
  }
  return pairs;
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function computeDests(): Map<string, string[]> {
  const dests = new Map<string, string[]>();
  for (const m of game.moves({ verbose: true })) {
    const list = dests.get(m.from) ?? [];
    list.push(m.to);
    dests.set(m.from, list);
  }
  return dests;
}

function syncBoard(lastMove?: [string, string]) {
  cgApi?.set({
    fen: game.fen(),
    turnColor: game.turn() === 'w' ? 'white' : 'black',
    check: game.inCheck() ? (game.turn() === 'w' ? 'white' : 'black') : undefined,
    lastMove,
    movable: {
      color: 'white',
      dests: computeDests(),
    },
  });
}

function describeGameOver(): string | null {
  if (game.isCheckmate()) return game.turn() === 'w' ? 'Checkmate — Josh wins.' : 'Checkmate — you win!';
  if (game.isStalemate()) return 'Stalemate — draw.';
  if (game.isThreefoldRepetition()) return 'Draw by repetition.';
  if (game.isInsufficientMaterial()) return 'Draw — insufficient material.';
  if (game.isDraw()) return 'Draw.';
  return null;
}

function finishGameIfOver(): boolean {
  if (!game.isGameOver()) return false;
  gameOver.value = true;
  statusText.value = describeGameOver() ?? 'Game over';
  cgApi?.set({ movable: { color: undefined, dests: new Map() } });
  return true;
}

function updateBookStateAfterVisitorMove(san: string) {
  const plyIndex = game.history().length - 1;

  if (plyIndex === 0) {
    const line = pickBookLine(san);
    if (line) {
      bookLine = line;
      bookPly = 1;
    } else {
      bookLine = null;
      flexibleActive = true;
      flexibleIndex = 0;
    }
    return;
  }

  if (bookLine && bookPly < bookLine.moves.length && bookLine.moves[bookPly] === san) {
    bookPly++;
  } else if (bookLine) {
    bookLine = null;
  }
}

async function playBotReply() {
  thinking.value = true;
  await delay(450);

  let bookMoveSan: string | null = null;

  if (bookLine && bookPly < bookLine.moves.length) {
    bookMoveSan = bookLine.moves[bookPly];
    bookPly++;
  } else if (!bookLine && flexibleActive && flexibleIndex < flexibleSetup.length) {
    const candidate = flexibleSetup[flexibleIndex];
    flexibleIndex++;
    flexibleActive = game.moves().includes(candidate);
    bookMoveSan = flexibleActive ? candidate : null;
  }

  let applied: ReturnType<Chess['move']> | null = null;
  if (bookMoveSan) {
    try {
      applied = game.move(bookMoveSan);
    } catch {
      applied = null;
    }
  }

  if (!applied) {
    bookLine = null;
    flexibleActive = false;
    const elo = rating.value ?? DEFAULT_ELO;
    const engineMove = await getEngineMove(game.fen(), elo);
    try {
      applied = game.move({
        from: engineMove.from as Square,
        to: engineMove.to as Square,
        promotion: engineMove.promotion as 'q' | 'r' | 'b' | 'n' | undefined,
      });
    } catch {
      applied = null;
    }
  }

  thinking.value = false;

  if (!applied) {
    statusText.value = 'Your move';
    return;
  }

  moveHistory.value.push(applied.san);
  syncBoard([applied.from, applied.to]);
}

async function onVisitorMove(orig: string, dest: string) {
  const piece = game.get(orig as Square);
  const isPromotion = piece?.type === 'p' && dest[1] === '8';

  let move: ReturnType<Chess['move']> | null;
  try {
    move = game.move({ from: orig as Square, to: dest as Square, promotion: isPromotion ? 'q' : undefined });
  } catch {
    syncBoard();
    return;
  }

  moveHistory.value.push(move.san);
  updateBookStateAfterVisitorMove(move.san);
  syncBoard([move.from, move.to]);

  if (finishGameIfOver()) return;

  statusText.value = 'Josh is thinking...';
  await playBotReply();

  if (!finishGameIfOver()) {
    statusText.value = 'Your move';
  }
}

function newGame() {
  game = new Chess();
  bookLine = null;
  bookPly = 0;
  flexibleActive = false;
  flexibleIndex = 0;
  moveHistory.value = [];
  gameOver.value = false;
  thinking.value = false;
  statusText.value = 'Your move';
  showUndoMessage.value = false;
  resetEngineGame();
  syncBoard();
}

onMounted(async () => {
  if (boardEl.value) {
    cgApi = Chessground(boardEl.value, {
      fen: game.fen(),
      orientation: 'white',
      highlight: { lastMove: true, check: true },
      animation: { enabled: true, duration: 200 },
      movable: {
        free: false,
        color: 'white',
        dests: computeDests(),
        events: { after: onVisitorMove },
      },
    });
  }

  const liveRating = await fetchLiveRapidRating();
  if (liveRating) {
    rating.value = liveRating;
    ratingStatus.value = 'live';
  } else {
    rating.value = DEFAULT_ELO;
    ratingStatus.value = 'unavailable';
  }
});

onBeforeUnmount(() => {
  cgApi?.destroy();
});
</script>

<template>
  <div class="chess-content">
    <div class="chess-board-card">
      <div class="chess-board" ref="boardEl"></div>
    </div>

    <div class="chess-panel">
      <span class="tag chess-rating-badge">
        <template v-if="ratingStatus === 'loading'">Syncing chess.com rating…</template>
        <template v-else-if="ratingStatus === 'live'">Live Rating: {{ rating }}</template>
        <template v-else>Rating unavailable — playing at {{ rating }}</template>
      </span>

      <div class="chess-status-row">
        <img src="/assets/chess/josh_chess.png" alt="Josh" class="chess-avatar">
        <p class="chess-status chess-speech-bubble" :class="{ 'chess-game-over': gameOver }">
          {{ statusText }}<span v-if="thinking && statusText === 'Josh is thinking...'" class="chess-thinking-dots">…</span>
        </p>
      </div>

      <div class="chess-move-list">
        <div v-for="pair in movePairs" :key="pair.num" class="chess-move-row">
          <span class="chess-move-num">{{ pair.num }}.</span>
          <span class="chess-move-san">{{ pair.white }}</span>
          <span class="chess-move-san">{{ pair.black }}</span>
        </div>
      </div>

      <div class="chess-buttons-row">
        <button class="cta-button chess-new-game" @click="newGame">New Game</button>
        <button class="chess-undo-button" @click="showUndoMessage = !showUndoMessage">Undo</button>
      </div>
      <p v-if="showUndoMessage" class="chess-undo-message">There are no undo buttons in life. Learn to live with your mistakes.</p>
    </div>
  </div>
</template>
