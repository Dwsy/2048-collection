import { useState, useEffect, useCallback } from 'react';
import styles from '../styles/Game.module.css';

type Direction = 'up' | 'down' | 'left' | 'right';

export default function Game() {
  const [board, setBoard] = useState<number[][]>(Array(4).fill(null).map(() => Array(4).fill(0)));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [mergedTiles, setMergedTiles] = useState(new Set<string>());
  const [newTiles, setNewTiles] = useState(new Set<string>());

  // 初始化游戏
  const initGame = useCallback(() => {
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setMergedTiles(new Set());
    setNewTiles(new Set());
    addNewTile(newBoard);
    addNewTile(newBoard);
  }, []);

  // 添加新的数字块
  const addNewTile = useCallback((currentBoard: number[][]) => {
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
      setNewTiles(prev => new Set(prev).add(`${i}-${j}`));
      setBoard([...currentBoard]);
    }
  }, []);

  // 旋转游戏板
  const rotateBoard = useCallback((board: number[][]): number[][] => {
    return board[0].map((_, i) => board.map(row => row[i]).reverse());
  }, []);

  // 移动数字块
  const move = useCallback((direction: Direction) => {
    const currentBoard = board.map(row => [...row]);
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
          setMergedTiles(prev => new Set(prev).add(`${rowIndex}-${i}`));
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
        setMergedTiles(new Set());
        setNewTiles(new Set());
      }, 300);
    }

    // 检查游戏是否结束
    if (isGameOver(newBoard)) {
      setGameOver(true);
    }
  }, [board, rotateBoard, addNewTile]);

  // 检查游戏是否结束
  const isGameOver = useCallback((currentBoard: number[][]): boolean => {
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
  }, []);

  // 处理键盘事件
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (gameOver) return;

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
  }, [gameOver, move]);

  // 处理触摸事件
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

  const handleTouchStart = useCallback((event: TouchEvent) => {
    setTouchStart({
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    });
  }, []);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (gameOver) return;

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStart.x;
    const deltaY = touchEndY - touchStart.y;

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
  }, [gameOver, move, touchStart]);

  // 设置事件监听
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleKeyDown, handleTouchStart, handleTouchEnd]);

  // 初始化游戏
  useEffect(() => {
    initGame();
  }, [initGame]);

  return (
    <div className={styles['game-container']}>
      <div className={styles.header}>
        <h1 className={styles.title}>2048</h1>
        <div className={styles['score-container']}>
          <div className={styles['score-title']}>Score</div>
          <div className={styles.score}>{score}</div>
        </div>
        <button className={styles['restart-button']} onClick={initGame}>
          New Game
        </button>
      </div>

      <div className={styles['game-grid']}>
        {board.map((row, i) =>
          row.map((value, j) => (
            <div key={`${i}-${j}`} className={styles['tile-container']}>
              {value !== 0 && (
                <div
                  className={`${styles.tile} ${styles[`tile-${value}`]} 
                    ${mergedTiles.has(`${i}-${j}`) ? styles.merged : ''} 
                    ${newTiles.has(`${i}-${j}`) ? styles['pop-in'] : ''}`}
                >
                  {value}
                </div>
              )}
            </div>
          ))
        )}
        {gameOver && (
          <div className={styles['game-over']}>
            Game Over!
            <button className={styles['restart-button']} onClick={initGame}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
