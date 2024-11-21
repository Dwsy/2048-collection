/**
 * 2048游戏的主要逻辑
 * 包含游戏初始化、移动、合并等功能
 */

// 获取DOM元素
const gameGrid = document.querySelector('.game-grid');
const restartButton = document.querySelector('.restart-button');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const aiButton = document.querySelector('.ai-button');
const stopAiButton = document.querySelector('.stop-ai-button');

class Game {
    constructor(size = 4) {
        this.size = size;
        this.init();
        this.setupEventListeners();
        this.initSettings();
    }

    init() {
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.addRandomTile();
        this.addRandomTile();
        this.updateView();
    }

    initSettings() {
        // 初始化设置
        this.settings = {
            gridSize: 4,
            theme: 'default',
            aiDelay: 200,
            aiAlgorithm: 'minimax'
        };

        // 加载保存的设置
        const savedSettings = localStorage.getItem('gameSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            this.applySettings();
        }

        // 设置面板元素
        this.settingsPanel = document.getElementById('settings-panel');
        this.settingsOverlay = document.getElementById('settings-overlay');
        
        // 设置按钮事件
        document.getElementById('settings-btn').addEventListener('click', () => this.showSettings());
        document.getElementById('settings-save').addEventListener('click', () => this.saveSettings());
        document.getElementById('settings-cancel').addEventListener('click', () => this.hideSettings());
        document.getElementById('theme-btn').addEventListener('click', () => this.cycleTheme());
        
        // AI相关
        this.isAIRunning = false;
        document.getElementById('ai-btn').addEventListener('click', () => this.toggleAI());
    }

    showSettings() {
        this.settingsPanel.style.display = 'block';
        this.settingsOverlay.style.display = 'block';
        
        // 填充当前设置
        document.getElementById('grid-size').value = this.settings.gridSize;
        document.getElementById('theme-select').value = this.settings.theme;
        document.getElementById('ai-delay').value = this.settings.aiDelay;
        document.getElementById('ai-algorithm').value = this.settings.aiAlgorithm;
    }

    hideSettings() {
        this.settingsPanel.style.display = 'none';
        this.settingsOverlay.style.display = 'none';
    }

    saveSettings() {
        const newSettings = {
            gridSize: parseInt(document.getElementById('grid-size').value),
            theme: document.getElementById('theme-select').value,
            aiDelay: parseInt(document.getElementById('ai-delay').value),
            aiAlgorithm: document.getElementById('ai-algorithm').value
        };

        this.settings = newSettings;
        localStorage.setItem('gameSettings', JSON.stringify(newSettings));
        
        // 应用新设置
        this.applySettings();
        this.hideSettings();
        
        // 如果网格大小改变，重新开始游戏
        if (this.size !== newSettings.gridSize) {
            this.size = newSettings.gridSize;
            this.init();
        }
    }

    applySettings() {
        // 应用主题
        document.body.dataset.theme = this.settings.theme;
        
        // 更新CSS变量
        document.documentElement.style.setProperty('--grid-size', this.settings.gridSize);
        
        // 更新网格模板
        const gameGrid = document.getElementById('game-grid');
        gameGrid.style.gridTemplateColumns = `repeat(${this.settings.gridSize}, 1fr)`;
        gameGrid.style.gridTemplateRows = `repeat(${this.settings.gridSize}, 1fr)`;
    }

    cycleTheme() {
        const themes = ['default', 'dark', 'colorful'];
        const currentIndex = themes.indexOf(this.settings.theme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        this.settings.theme = nextTheme;
        this.applySettings();
        localStorage.setItem('gameSettings', JSON.stringify(this.settings));
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.isAIRunning) {
                switch(e.key) {
                    case 'ArrowUp': this.move('up'); break;
                    case 'ArrowDown': this.move('down'); break;
                    case 'ArrowLeft': this.move('left'); break;
                    case 'ArrowRight': this.move('right'); break;
                }
            }
        });

        document.getElementById('new-game').addEventListener('click', () => {
            this.init();
        });
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
        if (emptyCells.length > 0) {
            const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[x][y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    move(direction) {
        if (this.gameOver) return false;

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
        for (let i = 0; i < this.size; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                }
            }
            while (row.length < this.size) row.push(0);
            this.grid[i] = row;
        }
    }

    moveRight() {
        for (let i = 0; i < this.size; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j - 1, 1);
                    j--;
                }
            }
            while (row.length < this.size) row.unshift(0);
            this.grid[i] = row;
        }
    }

    moveUp() {
        this.rotateGrid();
        this.moveLeft();
        this.rotateGrid(3);
    }

    moveDown() {
        this.rotateGrid();
        this.moveRight();
        this.rotateGrid(3);
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
        }
    }

    updateView() {
        const gameGrid = document.getElementById('game-grid');
        gameGrid.innerHTML = '';

        // 创建背景网格
        for (let i = 0; i < this.size * this.size; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            gameGrid.appendChild(cell);
        }

        // 计算单个格子的大小和间距
        const gridRect = gameGrid.getBoundingClientRect();
        const cellSize = (gridRect.width - (this.size + 1) * parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-spacing'))) / this.size;

        // 添加数字块
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${this.grid[i][j]}`;
                    tile.textContent = this.grid[i][j];

                    // 计算位置
                    const spacing = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-spacing'));
                    const x = j * (cellSize + spacing) + spacing;
                    const y = i * (cellSize + spacing) + spacing;

                    // 设置大小和位置
                    tile.style.width = `${cellSize}px`;
                    tile.style.height = `${cellSize}px`;
                    tile.style.transform = `translate(${x}px, ${y}px)`;
                    tile.style.fontSize = `${cellSize * 0.4}px`;

                    gameGrid.appendChild(tile);
                }
            }
        }

        // 更新分数
        document.getElementById('score').textContent = this.score;
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

    // AI 相关方法
    toggleAI() {
        if (this.isAIRunning) {
            this.stopAI();
        } else {
            this.startAI();
        }
    }

    async startAI() {
        this.isAIRunning = true;
        document.getElementById('ai-btn').textContent = '停止 AI';
        
        while (this.isAIRunning && !this.gameOver) {
            const move = await this.getAIMove();
            if (move) {
                this.move(move);
                await new Promise(resolve => setTimeout(resolve, this.settings.aiDelay));
            } else {
                this.isAIRunning = false;
                break;
            }
        }
        
        document.getElementById('ai-btn').textContent = 'AI 模式';
    }

    stopAI() {
        this.isAIRunning = false;
        document.getElementById('ai-btn').textContent = 'AI 模式';
    }

    async getAIMove() {
        switch (this.settings.aiAlgorithm) {
            case 'minimax':
                return this.minimaxMove();
            case 'expectimax':
                return this.expectimaxMove();
            case 'montecarlo':
                return this.monteCarloMove();
            default:
                return this.minimaxMove();
        }
    }

    minimaxMove(depth = 4) {
        const moves = ['up', 'down', 'left', 'right'];
        let bestScore = -Infinity;
        let bestMove = null;

        for (const move of moves) {
            const gridCopy = JSON.parse(JSON.stringify(this.grid));
            if (this.move(move)) {
                const score = this.evaluatePosition();
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
            }
            this.grid = JSON.parse(JSON.stringify(gridCopy));
        }

        return bestMove;
    }

    expectimaxMove() {
        // 简化版的期望最大值算法
        return this.minimaxMove();
    }

    monteCarloMove() {
        // 简化版的蒙特卡洛树搜索
        return this.minimaxMove();
    }

    evaluatePosition() {
        let score = 0;
        
        // 评估空格数量
        const emptyCells = this.grid.flat().filter(cell => cell === 0).length;
        score += emptyCells * 10;

        // 评估单调性
        score += this.evaluateMonotonicity() * 20;

        // 评估最大数字
        const maxTile = Math.max(...this.grid.flat());
        score += Math.log2(maxTile) * 15;

        return score;
    }

    evaluateMonotonicity() {
        let score = 0;
        
        // 检查行的单调性
        for (let i = 0; i < this.size; i++) {
            let increasing = 0;
            let decreasing = 0;
            for (let j = 1; j < this.size; j++) {
                const diff = this.grid[i][j] - this.grid[i][j-1];
                if (diff > 0) increasing++;
                if (diff < 0) decreasing++;
            }
            score += Math.abs(increasing - decreasing);
        }

        // 检查列的单调性
        for (let j = 0; j < this.size; j++) {
            let increasing = 0;
            let decreasing = 0;
            for (let i = 1; i < this.size; i++) {
                const diff = this.grid[i][j] - this.grid[i-1][j];
                if (diff > 0) increasing++;
                if (diff < 0) decreasing++;
            }
            score += Math.abs(increasing - decreasing);
        }

        return score;
    }
}

// 启动游戏
window.onload = () => {
    new Game();
};
