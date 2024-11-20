import { component$, useSignal, useVisibleTask$, useStore, $ } from '@builder.io/qwik';
import styles from '../styles/Game.module.css';

type Tile = {
  value: number;
  id: number;
  x: number;
  y: number;
};

type GameState = {
  board: number[][];
  tiles: Tile[];
  score: number;
  bestScore: number;
  gameOver: boolean;
  nextId: number;
};

export default component$(() => {
  const gameState = useStore<GameState>({
    board: Array(4).fill(null).map(() => Array(4).fill(0)),
    tiles: [],
    score: 0,
    bestScore: 0,
    gameOver: false,
    nextId: 1,
  });

  const touchStart = useSignal<{ x: number; y: number } | null>(null);

  const addTile = $((board: number[][], tiles: Tile[]) => {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }

    if (emptyCells.length === 0) return;

    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    board[x][y] = value;
    tiles.push({ value, x, y, id: gameState.nextId });
    gameState.nextId++;
  });

  const initializeGame = $(() => {
    gameState.board = Array(4).fill(null).map(() => Array(4).fill(0));
    gameState.tiles = [];
    gameState.score = 0;
    gameState.gameOver = false;
    addTile(gameState.board, gameState.tiles);
    addTile(gameState.board, gameState.tiles);
  });

  const checkGameOver = $(() => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (gameState.board[i][j] === 0) return false;
        if (i < 3 && gameState.board[i][j] === gameState.board[i + 1][j]) return false;
        if (j < 3 && gameState.board[i][j] === gameState.board[i][j + 1]) return false;
      }
    }
    return true;
  });

  const move = $(async (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState.gameOver) return;

    const rotateBoard = (board: number[][], times: number): number[][] => {
      let newBoard = [...board.map(row => [...row])];
      for (let i = 0; i < times; i++) {
        const rotated = Array(4).fill(null).map(() => Array(4).fill(0));
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            rotated[i][j] = newBoard[3 - j][i];
          }
        }
        newBoard = rotated;
      }
      return newBoard;
    };

    const moveLeft = (board: number[][]): { board: number[][]; moved: boolean; score: number } => {
      let moved = false;
      let score = 0;
      const newBoard = board.map(row => {
        const newRow = row.filter(cell => cell !== 0);
        for (let i = 0; i < newRow.length - 1; i++) {
          if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            score += newRow[i];
            newRow.splice(i + 1, 1);
            moved = true;
          }
        }
        while (newRow.length < 4) newRow.push(0);
        if (newRow.join(',') !== row.join(',')) moved = true;
        return newRow;
      });
      return { board: newBoard, moved, score };
    };

    let rotations = 0;
    switch (direction) {
      case 'up': rotations = 1; break;
      case 'right': rotations = 2; break;
      case 'down': rotations = 3; break;
      default: rotations = 0;
    }

    let board = rotateBoard(gameState.board, rotations);
    const { board: movedBoard, moved, score } = moveLeft(board);
    board = rotateBoard(movedBoard, (4 - rotations) % 4);

    if (moved) {
      gameState.board = board;
      gameState.score += score;
      if (gameState.score > gameState.bestScore) {
        gameState.bestScore = gameState.score;
      }

      // Update tiles
      gameState.tiles = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (board[i][j] !== 0) {
            gameState.tiles.push({
              value: board[i][j],
              x: i,
              y: j,
              id: gameState.nextId++
            });
          }
        }
      }

      addTile(gameState.board, gameState.tiles);
      gameState.gameOver = await checkGameOver();
    }
  });

  useVisibleTask$(() => {
    initializeGame();

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleTouchStart = $((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.value = { x: touch.clientX, y: touch.clientY };
  });

  const handleTouchEnd = $((e: TouchEvent) => {
    if (!touchStart.value) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.value.x;
    const deltaY = touch.clientY - touchStart.value.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (Math.max(absDeltaX, absDeltaY) > 10) {
      if (absDeltaX > absDeltaY) {
        move(deltaX > 0 ? 'right' : 'left');
      } else {
        move(deltaY > 0 ? 'down' : 'up');
      }
    }

    touchStart.value = null;
  });

  return (
    <div class={styles.game}>
      <div class={styles.header}>
        <h1 class={styles.title}>2048</h1>
        <div class={styles.scores}>
          <div class={styles.score}>
            <div class={styles['score-label']}>SCORE</div>
            <div class={styles['score-value']}>{gameState.score}</div>
          </div>
          <div class={styles.score}>
            <div class={styles['score-label']}>BEST</div>
            <div class={styles['score-value']}>{gameState.bestScore}</div>
          </div>
        </div>
      </div>

      <div
        class={styles.grid}
        onTouchStart$={handleTouchStart}
        onTouchEnd$={handleTouchEnd}
      >
        {Array(4).fill(null).map((_, i) => (
          Array(4).fill(null).map((_, j) => (
            <div key={`cell-${i}-${j}`} class={styles.cell} />
          ))
        ))}
        {gameState.tiles.map((tile) => (
          <div
            key={tile.id}
            class={styles.tile}
            data-value={tile.value}
            style={{
              transform: `translate(${tile.y * 115 + 15}px, ${tile.x * 115 + 15}px)`,
            }}
          >
            {tile.value}
          </div>
        ))}
        {gameState.gameOver && (
          <div class={styles['game-over']}>
            <div class={styles['game-over-text']}>Game Over!</div>
            <button class={styles['retry-button']} onClick$={initializeGame}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
