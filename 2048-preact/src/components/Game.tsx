import { useEffect, useState } from 'preact/hooks';
import styles from '../styles/Game.module.css';

interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
}

export function Game() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const initializeGame = () => {
    const newTiles: Tile[] = [];
    addRandomTile(newTiles);
    addRandomTile(newTiles);
    setTiles(newTiles);
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    initializeGame();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addRandomTile = (currentTiles: Tile[]) => {
    const emptyCells = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!currentTiles.some(tile => tile.row === row && tile.col === col)) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newTile: Tile = {
        id: Date.now() + Math.random(),
        value: Math.random() < 0.9 ? 2 : 4,
        row,
        col,
      };
      currentTiles.push(newTile);
    }
  };

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    const newTiles = [...tiles];
    let moved = false;
    let newScore = score;

    // Sort tiles based on direction
    const sortedTiles = newTiles.sort((a, b) => {
      if (direction === 'up') return a.row - b.row;
      if (direction === 'down') return b.row - a.row;
      if (direction === 'left') return a.col - b.col;
      return b.col - a.col;
    });

    // Move and merge tiles
    sortedTiles.forEach(tile => {
      let { row, col } = tile;
      let newRow = row;
      let newCol = col;

      while (true) {
        let nextRow = direction === 'up' ? newRow - 1 : direction === 'down' ? newRow + 1 : newRow;
        let nextCol = direction === 'left' ? newCol - 1 : direction === 'right' ? newCol + 1 : newCol;

        if (nextRow < 0 || nextRow > 3 || nextCol < 0 || nextCol > 3) break;

        const nextTile = sortedTiles.find(t => t !== tile && t.row === nextRow && t.col === nextCol);
        if (!nextTile) {
          newRow = nextRow;
          newCol = nextCol;
          moved = moved || newRow !== row || newCol !== col;
        } else if (nextTile.value === tile.value) {
          newRow = nextRow;
          newCol = nextCol;
          tile.value *= 2;
          newScore += tile.value;
          const index = sortedTiles.indexOf(nextTile);
          sortedTiles.splice(index, 1);
          moved = true;
          break;
        } else {
          break;
        }
      }

      tile.row = newRow;
      tile.col = newCol;
    });

    if (moved) {
      addRandomTile(sortedTiles);
      setTiles(sortedTiles);
      setScore(newScore);
      checkGameOver(sortedTiles);
    }
  };

  const checkGameOver = (currentTiles: Tile[]) => {
    if (currentTiles.length < 16) return;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const tile = currentTiles.find(t => t.row === row && t.col === col);
        if (tile) {
          const value = tile.value;
          // Check adjacent cells
          if (
            (row > 0 && currentTiles.find(t => t.row === row - 1 && t.col === col)?.value === value) ||
            (row < 3 && currentTiles.find(t => t.row === row + 1 && t.col === col)?.value === value) ||
            (col > 0 && currentTiles.find(t => t.row === row && t.col === col - 1)?.value === value) ||
            (col < 3 && currentTiles.find(t => t.row === row && t.col === col + 1)?.value === value)
          ) {
            return;
          }
        }
      }
    }

    setGameOver(true);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (gameOver) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        move('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        move('down');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        move('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        move('right');
        break;
    }
  };

  const handleTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (!touchStart || gameOver) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        move(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        move(deltaY > 0 ? 'down' : 'up');
      }
    }
  };

  return (
    <div class={styles['game-container']}>
      <div class={styles.score}>Score: {score}</div>
      <div
        class={styles['game-board']}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {Array.from({ length: 16 }).map((_, index) => {
          const row = Math.floor(index / 4);
          const col = index % 4;
          const tile = tiles.find(t => t.row === row && t.col === col);

          return (
            <div key={index} class={styles.cell}>
              {tile && (
                <div
                  class={`${styles.tile} ${styles[`tile-${tile.value}`]}`}
                  style={{
                    transform: `translate(${(tile.col - col) * 100}%, ${(tile.row - row) * 100}%)`,
                  }}
                >
                  {tile.value}
                </div>
              )}
            </div>
          );
        })}
        {gameOver && (
          <div class={styles['game-over']}>
            <div>Game Over!</div>
            <button class={styles['new-game-button']} onClick={initializeGame}>
              New Game
            </button>
          </div>
        )}
      </div>
      <button class={styles['new-game-button']} onClick={initializeGame}>
        New Game
      </button>
    </div>
  );
}
