/**
 * 2048游戏的主要逻辑
 * 包含游戏初始化、移动、合并等功能
 */

// 获取DOM元素
const gameGrid = document.querySelector('.game-grid');
const restartButton = document.querySelector('.restart-button');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');

// 游戏状态变量
let board = [];
let score = 0;
let mergedTiles = new Set();
let newTiles = new Set();

/**
 * 初始化游戏
 * 重置游戏板、分数和状态
 */
function initGame() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    mergedTiles.clear();
    newTiles.clear();
    scoreElement.textContent = '0';
    gameOverElement.style.display = 'none';
    addNewTile();
    addNewTile();
    updateBoard();
}

/**
 * 添加新的数字块
 * 在空白位置随机添加2或4
 */
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
    }
}

/**
 * 更新游戏板显示
 * 根据board数组重新渲染DOM
 */
function updateBoard() {
    gameGrid.innerHTML = '';
    board.forEach((row, i) => {
        row.forEach((value, j) => {
            const tileContainer = document.createElement('div');
            tileContainer.className = 'tile-container';
            
            if (value !== 0) {
                const tile = document.createElement('div');
                tile.className = `tile tile-${value}`;
                if (newTiles.has(`${i}-${j}`)) {
                    tile.classList.add('pop-in');
                }
                if (mergedTiles.has(`${i}-${j}`)) {
                    tile.classList.add('merged');
                }
                tile.textContent = value;
                tileContainer.appendChild(tile);
            }
            
            gameGrid.appendChild(tileContainer);
        });
    });
    
    // 清除动画状态
    setTimeout(() => {
        mergedTiles.clear();
        newTiles.clear();
    }, 300);
}

/**
 * 移动数字块
 * @param {string} direction - 移动方向：'up', 'down', 'left', 'right'
 */
function move(direction) {
    const oldBoard = JSON.stringify(board);
    mergedTiles.clear();
    newTiles.clear();
    
    let newBoard = board.map(row => [...row]);
    
    // First rotate if needed
    if (direction === 'up' || direction === 'down') {
        newBoard = rotateBoard(newBoard);
    }
    
    // Reverse for right/down movements
    if (direction === 'right' || direction === 'down') {
        newBoard = newBoard.map(row => row.reverse());
    }
    
    // Process each row
    newBoard = newBoard.map((row, rowIndex) => {
        // Remove zeros and get non-empty tiles
        let newRow = row.filter(cell => cell !== 0);
        let merged = Array(4).fill(false);
        
        // Merge tiles
        for (let i = 0; i < newRow.length - 1; i++) {
            if (!merged[i] && newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                score += newRow[i];
                scoreElement.textContent = score;
                newRow.splice(i + 1, 1);
                merged[i] = true;
                mergedTiles.add(`${rowIndex}-${i}`);
            }
        }
        
        // Pad with zeros
        while (newRow.length < 4) {
            newRow.push(0);
        }
        
        return newRow;
    });
    
    // Reverse back if needed
    if (direction === 'right' || direction === 'down') {
        newBoard = newBoard.map(row => row.reverse());
    }
    
    // Rotate back if needed
    if (direction === 'up' || direction === 'down') {
        newBoard = rotateBoard(newBoard);
    }
    
    // Update board if changed
    if (oldBoard !== JSON.stringify(newBoard)) {
        board = newBoard;
        addNewTile();
    }
    
    updateBoard();
    
    if (isGameOver()) {
        gameOverElement.style.display = 'block';
    }
}

/**
 * 旋转游戏板
 * @param {number[][]} board - 当前游戏板
 * @returns {number[][]} 旋转后的游戏板
 */
function rotateBoard(board) {
    return board[0].map((_, i) => board.map(row => row[i]).reverse());
}

/**
 * 检查游戏是否结束
 * @returns {boolean} 游戏是否结束
 */
function isGameOver() {
    // 检查是否有空格
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) return false;
        }
    }
    
    // 检查是否可以合并
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === board[i][j + 1]) return false;
        }
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === board[i + 1][j]) return false;
        }
    }
    
    return true;
}

// 键盘事件监听
document.addEventListener('keydown', event => {
    if (gameOverElement.style.display === 'block') return;
    
    switch(event.key) {
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
});

// 触摸事件处理
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', event => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchend', event => {
    if (gameOverElement.style.display === 'block') return;
    
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
});

// 重新开始游戏按钮事件监听
restartButton.addEventListener('click', initGame);

// 初始化游戏
initGame();
