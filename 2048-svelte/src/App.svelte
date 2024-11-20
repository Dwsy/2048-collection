<script>
  import Board from './components/Board.svelte';
  
  let board = Array(4).fill().map(() => Array(4).fill(0));
  let mergedTiles = new Set();
  let newTiles = new Set();
  let score = 0;
  let gameOver = false;
  
  // 初始化游戏
  function initGame() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    mergedTiles = new Set();
    newTiles = new Set();
    score = 0;
    gameOver = false;
    addNewTile();
    addNewTile();
  }
  
  // 添加新的数字块
  function addNewTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[i][j] = Math.random() < 0.9 ? 2 : 4;
      newTiles.add(`${i}-${j}`);
      board = [...board];
    }
  }
  
  // 移动和合并逻辑
  function moveBoard(direction) {
    const oldBoard = JSON.stringify(board);
    mergedTiles.clear();
    newTiles.clear();
    
    // 移动前的数组复制
    let newBoard = board.map(row => [...row]);
    
    // 根据方向旋转数组
    if (direction === 'up' || direction === 'down') {
      newBoard = rotateBoard(newBoard);
    }
    if (direction === 'right' || direction === 'down') {
      newBoard = newBoard.map(row => row.reverse());
    }
    
    // 对每一行进行移动和合并
    newBoard = newBoard.map((row, rowIndex) => {
      // 先移除所有的0
      let newRow = row.filter(cell => cell !== 0);
      let merged = new Array(newRow.length).fill(false);
      
      // 从左到右检查相邻的数字是否可以合并
      for (let i = 0; i < newRow.length - 1; i++) {
        if (!merged[i] && !merged[i + 1] && newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          score += newRow[i];
          newRow.splice(i + 1, 1);
          merged[i] = true;
          
          // 记录合并的位置
          let actualRow = rowIndex;
          let actualCol = i;
          if (direction === 'up' || direction === 'down') {
            [actualRow, actualCol] = [actualCol, actualRow];
          }
          if (direction === 'right' || direction === 'down') {
            actualCol = 3 - actualCol;
          }
          mergedTiles.add(`${actualRow}-${actualCol}`);
        }
      }
      
      // 补充0到4个格子
      while (newRow.length < 4) {
        newRow.push(0);
      }
      return newRow;
    });
    
    // 还原数组方向
    if (direction === 'right' || direction === 'down') {
      newBoard = newBoard.map(row => row.reverse());
    }
    if (direction === 'up' || direction === 'down') {
      newBoard = rotateBoard(newBoard).map(row => [...row]);
    }
    
    // 检查是否有变化
    if (oldBoard !== JSON.stringify(newBoard)) {
      board = newBoard;
      setTimeout(() => {
        addNewTile();
        checkGameOver();
      }, 200);
    }
  }
  
  function rotateBoard(board) {
    return board[0].map((_, i) => board.map(row => row[i]).reverse());
  }
  
  function checkGameOver() {
    // 检查是否有空格
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return;
      }
    }
    
    // 检查水平方向是否可以合并
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === board[i][j + 1]) return;
      }
    }
    
    // 检查垂直方向是否可以合并
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === board[i + 1][j]) return;
      }
    }
    
    gameOver = true;
  }
  
  function isMerged(i, j) {
    return mergedTiles.has(`${i}-${j}`);
  }
  
  function isNew(i, j) {
    return newTiles.has(`${i}-${j}`);
  }
  
  // 处理移动事件
  function handleMove(event) {
    if (!gameOver) {
      moveBoard(event.detail);
    }
  }
  
  // 初始化游戏
  initGame();
</script>

<main class="game-container">
  <div class="header">
    <h1>2048</h1>
    <div class="info">
      <div class="score">分数: {score}</div>
      <button
        class="restart-button"
        on:click={initGame}
      >
        重新开始
      </button>
    </div>
  </div>
  
  <Board 
    {board} 
    {isMerged}
    {isNew}
    on:move={handleMove} 
  />
  
  {#if gameOver}
    <div class="game-over">
      游戏结束！
    </div>
  {/if}
</main>

<style>
  .game-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background-color: #faf8ef;
    margin: 0;
    box-sizing: border-box;
  }
  
  .header {
    width: min(400px, 100%);
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem;
    box-sizing: border-box;
  }
  
  h1 {
    font-size: clamp(1.5rem, 5vw, 2.5rem);
    font-weight: bold;
    color: #776e65;
    margin: 0;
  }
  
  .info {
    text-align: right;
  }
  
  .score {
    font-size: clamp(1rem, 4vw, 1.5rem);
    font-weight: bold;
    color: #776e65;
    margin-bottom: 0.5rem;
  }
  
  .restart-button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    color: white;
    background-color: #8f7a66;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .restart-button:hover {
    background-color: #7f6a56;
  }
  
  .game-over {
    margin-top: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
    color: #f65e3b;
  }
</style>
