// 游戏核心逻辑
export class Game {
    constructor(size = 4) {
        this.size = size;
        this.init();
    }

    init() {
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.mergedTiles = [];
        this.newTiles = [];
        this.addRandomTile();
        this.addRandomTile();
        this.updateView();
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        if (emptyCells.length) {
            const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[x][y] = Math.random() < 0.9 ? 2 : 4;
            this.newTiles.push({x, y});
        }
    }

    move(direction) {
        if (this.gameOver) return false;

        this.newTiles = [];
        this.mergedTiles = [];
        const prevGrid = JSON.stringify(this.grid);
        
        switch(direction) {
            case 'up': this.moveUp(); break;
            case 'down': this.moveDown(); break;
            case 'left': this.moveLeft(); break;
            case 'right': this.moveRight(); break;
        }

        const moved = prevGrid !== JSON.stringify(this.grid);
        if (moved) {
            this.addRandomTile();
            this.updateView();
            this.checkGameOver();
        }
        return moved;
    }

    moveLeft() {
        let moved = false;
        for (let i = 0; i < this.size; i++) {
            const row = this.grid[i];
            const newRow = new Array(this.size).fill(0);
            let writePos = 0;
            let readPos = 0;
            let lastMerged = false;

            // 移动和合并
            while (readPos < this.size) {
                if (row[readPos] === 0) {
                    readPos++;
                    continue;
                }

                if (writePos === 0 || newRow[writePos - 1] === 0) {
                    newRow[writePos] = row[readPos];
                    if (writePos !== readPos) {
                        moved = true;
                    }
                    lastMerged = false;
                    writePos++;
                } else if (!lastMerged && newRow[writePos - 1] === row[readPos]) {
                    newRow[writePos - 1] *= 2;
                    this.score += newRow[writePos - 1];
                    this.mergedTiles.push({x: i, y: writePos - 1});
                    moved = true;
                    lastMerged = true;
                } else {
                    newRow[writePos] = row[readPos];
                    if (writePos !== readPos) {
                        moved = true;
                    }
                    lastMerged = false;
                    writePos++;
                }
                readPos++;
            }

            if (moved) {
                this.grid[i] = newRow;
            }
        }
        return moved;
    }

    moveRight() {
        // 先反转网格，使用 moveLeft，再反转回来
        this.grid = this.grid.map(row => row.reverse());
        const moved = this.moveLeft();
        this.grid = this.grid.map(row => row.reverse());
        // 更新合并方块的位置
        this.mergedTiles = this.mergedTiles.map(({x, y}) => ({
            x: x,
            y: this.size - 1 - y
        }));
        return moved;
    }

    moveUp() {
        this.rotateGrid();
        const moved = this.moveLeft();
        this.rotateGrid(3);
        return moved;
    }

    moveDown() {
        this.rotateGrid();
        const moved = this.moveRight();
        this.rotateGrid(3);
        return moved;
    }

    rotateGrid(times = 1) {
        for (let t = 0; t < times; t++) {
            const newGrid = Array(this.size).fill().map(() => Array(this.size).fill(0));
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    newGrid[j][this.size - 1 - i] = this.grid[i][j];
                }
            }
            this.grid = newGrid;
            
            // 更新合并和新增方块的位置
            this.mergedTiles = this.mergedTiles.map(({x, y}) => ({
                x: y,
                y: this.size - 1 - x
            }));
            this.newTiles = this.newTiles.map(({x, y}) => ({
                x: y,
                y: this.size - 1 - x
            }));
        }
    }

    updateView() {
        const gameGrid = document.getElementById('game-grid');
        gameGrid.innerHTML = '';
        gameGrid.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;

        // 计算单个格子的大小
        const containerWidth = gameGrid.offsetWidth;
        const spacing = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-spacing'));
        const cellSize = (containerWidth - (this.size + 1) * spacing) / this.size;
        
        // 更新CSS变量
        document.documentElement.style.setProperty('--cell-size', cellSize + 'px');

        // 创建背景网格
        for (let i = 0; i < this.size * this.size; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            gameGrid.appendChild(cell);
        }

        // 添加数字块
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${this.grid[i][j]}`;
                    tile.textContent = this.grid[i][j];
                    
                    // 计算位置
                    const x = j * (cellSize + spacing) + spacing;
                    const y = i * (cellSize + spacing) + spacing;
                    
                    tile.style.transform = `translate(${x}px, ${y}px)`;
                    
                    // 添加动画类
                    const isNew = this.newTiles.some(t => t.x === i && t.y === j);
                    const isMerged = this.mergedTiles.some(t => t.x === i && t.y === j);
                    
                    if (isNew) {
                        tile.classList.add('new');
                    } else if (isMerged) {
                        tile.classList.add('merged');
                    }
                    
                    gameGrid.appendChild(tile);
                }
            }
        }

        // 更新分数
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }

    checkGameOver() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) return false;
                if (i < this.size - 1 && this.grid[i][j] === this.grid[i + 1][j]) return false;
                if (j < this.size - 1 && this.grid[i][j] === this.grid[i][j + 1]) return false;
            }
        }
        this.gameOver = true;
        document.getElementById('game-over').style.display = 'flex';
        return true;
    }

    getGrid() {
        return this.grid;
    }

    getScore() {
        return this.score;
    }

    isGameOver() {
        return this.gameOver;
    }

    setSize(size) {
        this.size = size;
        this.init();
    }
}
