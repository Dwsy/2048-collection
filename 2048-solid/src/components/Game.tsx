import { createSignal, createEffect, onMount, onCleanup } from 'solid-js';
import styles from '../styles/Game.module.css';

type Direction = 'up' | 'down' | 'left' | 'right';

export default function Game() {
  const [board, setBoard] = createSignal<number[][]>(Array(4).fill(null).map(() => Array(4).fill(0)));
  const [score, setScore] = createSignal(0);
  const [gameOver, setGameOver] = createSignal(false);
  const [mergedTiles, setMergedTiles] = createSignal(new Set<string>());
  const [newTiles, setNewTiles] = createSignal(new Set<string>());

  // 初始化游戏
  const initGame = () => {
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setMergedTiles(new Set<string>());
    setNewTiles(new Set<string>());
    addNewTile(newBoard);
    addNewTile(newBoard);
  };

  // 添加新的数字块
  const addNewTile = (currentBoard: number[][]) => {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentBoard[i][j] = Math.random() < 0.9 ? 2 : 4;
      setNewTiles(prev => {
        const next = new Set(prev);
        next.add(`${i}-${j}`);
        return next;
      });
      setBoard([...currentBoard]);
    }
  };

  // 旋转游戏板
  const rotateBoard = (board: number[][]): number[][] => {
    return board[0].map((_, i) => board.map(row => row[i]).reverse());
  };

  // 移动数字块
  const move = (direction: Direction) => {
    const currentBoard = board().map(row => [...row]);
    let newBoard = currentBoard.map(row => [...row]);
    let changed = false;

    // 根据方向旋转棋盘
    if (direction === 'up' || direction === 'down') {
      newBoard = rotateBoard(newBoard);
    }

    if (direction === 'right' || direction === 'down') {
      newBoard = newBoard.map(row => row.reverse());
    }

    // 处理每一行
    newBoard = newBoard.map((row, rowIndex) => {
      let newRow = row.filter(cell => cell !== 0);
      const merged = Array(4).fill(false);
      
      // 合并相同的数字
      for (let i = 0; i < newRow.length - 1; i++) {
        if (!merged[i] && newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          setScore(prev => prev + newRow[i]);
          newRow.splice(i + 1, 1);
          merged[i] = true;
          setMergedTiles(prev => {
            const next = new Set(prev);
            next.add(`${rowIndex}-${i}`);
            return next;
          });
        }
      }

      // 补充空白
      while (newRow.length < 4) {
        newRow.push(0);
      }

      return newRow;
    });

    // 还原旋转
    if (direction === 'right' || direction === 'down') {
      newBoard = newBoard.map(row => row.reverse());
    }

    if (direction === 'up' || direction === 'down') {
      newBoard = rotateBoard(newBoard);
    }

    // 检查是否有变化
    changed = JSON.stringify(currentBoard) !== JSON.stringify(newBoard);

    if (changed) {
      setBoard(newBoard);
      addNewTile(newBoard);

      // 清除动画状态
      setTimeout(() => {
        setMergedTiles(new Set<string>());
        setNewTiles(new Set<string>());
      }, 300);
    }

    // 检查游戏是否结束
    if (isGameOver(newBoard)) {
      setGameOver(true);
    }
  };

  // 检查游戏是否结束
  const isGameOver = (currentBoard: number[][]): boolean => {
    // 检查是否有空格
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i][j] === 0) return false;
      }
    }

    // 检查是否可以合并
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i][j] === currentBoard[i][j + 1]) return false;
      }
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i][j] === currentBoard[i + 1][j]) return false;
      }
    }

    return true;
  };

  // 处理键盘事件
  const handleKeyDown = (event: KeyboardEvent) => {
    if (gameOver()) return;

    switch (event.key) {
      case 'ArrowUp':
        move('up');
        break;
      case 'ArrowDown':
        move('down');
        break;
      case 'ArrowLeft':
        move('left');
        break;
      case 'ArrowRight':
        move('right');
        break;
    }
  };

  // 处理触摸事件
  let touchStartX = 0;
  let touchStartY = 0;

  const handleTouchStart = (event: TouchEvent) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (gameOver()) return;

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        move('right');
      } else {
        move('left');
      }
    } else {
      if (deltaY > 0) {
        move('down');
      } else {
        move('up');
      }
    }
  };

  // 设置事件监听
  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    initGame();
  });

  // 清理事件监听
  onCleanup(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchend', handleTouchEnd);
  });

  return (
    <div class={styles['game-container']}>
      <div class={styles.header}>
        <h1 class={styles.title}>2048</h1>
        <div class={styles['score-container']}>
          <div class={styles['score-title']}>Score</div>
          <div class={styles.score}>{score()}</div>
        </div>
        <button class={styles['restart-button']} onClick={initGame}>
          New Game
        </button>
      </div>

      <div class={styles['game-grid']}>
        {board().map((row, i) =>
          row.map((value, j) => (
            <div class={styles['tile-container']}>
              {value !== 0 && (
                <div
                  class={`${styles.tile} ${styles[`tile-${value}`]} 
                    ${mergedTiles().has(`${i}-${j}`) ? styles.merged : ''} 
                    ${newTiles().has(`${i}-${j}`) ? styles['pop-in'] : ''}`}
                >
                  {value}
                </div>
              )}
            </div>
          ))
        )}
        {gameOver() && (
          <div class={styles['game-over']}>
            Game Over!
            <button class={styles['restart-button']} onClick={initGame}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
