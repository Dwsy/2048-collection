// AI玩家逻辑
class AI2048 {
    constructor(game) {
        this.game = game;
        this.isPlaying = false;
        this.timeoutId = null;
        this.moveDelay = 300;
        this.mode = 'smart'; // 'smart' or 'random'
        this.aiPlayer = new AIPlayer(game);
    }

    // 评估当前游戏局面
    evaluateBoard(board) {
        let score = 0;
        const weights = [
            [4, 3, 2, 1],
            [3, 2, 1, 0],
            [2, 1, 0, -1],
            [1, 0, -1, -2]
        ];

        // 1. 基于权重的位置评分
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                score += board[i][j] * weights[i][j];
            }
        }

        // 2. 空格子数量评分
        const emptyCells = board.flat().filter(cell => cell === 0).length;
        score += emptyCells * 10;

        // 3. 相邻相同数字评分
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] !== 0 && board[i][j] === board[i][j + 1]) {
                    score += board[i][j] * 2;
                }
                if (board[j][i] !== 0 && board[j][i] === board[j + 1][i]) {
                    score += board[j][i] * 2;
                }
            }
        }

        // 4. 单调性评分
        let monotonicity = 0;
        for (let i = 0; i < 4; i++) {
            let current = 0;
            for (let j = 0; j < 3; j++) {
                if (board[i][j] >= board[i][j + 1]) current++;
            }
            monotonicity += Math.max(current, 3 - current);
            
            current = 0;
            for (let j = 0; j < 3; j++) {
                if (board[j][i] >= board[j + 1][i]) current++;
            }
            monotonicity += Math.max(current, 3 - current);
        }
        score += monotonicity * 20;

        return score;
    }

    // 模拟移动
    simulateMove(board, direction) {
        let newBoard = board.map(row => [...row]);
        let moved = false;
        let score = 0;

        const positions = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                positions.push({row: i, col: j});
            }
        }

        switch (direction) {
            case 'right':
                positions.sort((a, b) => b.col - a.col);
                break;
            case 'down':
                positions.sort((a, b) => b.row - a.row);
                break;
        }

        positions.forEach(pos => {
            if (newBoard[pos.row][pos.col] === 0) return;

            let value = newBoard[pos.row][pos.col];
            let newRow = pos.row;
            let newCol = pos.col;
            let merged = false;

            while (true) {
                let nextRow = newRow;
                let nextCol = newCol;

                switch (direction) {
                    case 'up': nextRow--; break;
                    case 'down': nextRow++; break;
                    case 'left': nextCol--; break;
                    case 'right': nextCol++; break;
                }

                if (nextRow < 0 || nextRow >= 4 || nextCol < 0 || nextCol >= 4) break;

                if (newBoard[nextRow][nextCol] === 0) {
                    newRow = nextRow;
                    newCol = nextCol;
                    moved = true;
                } else if (newBoard[nextRow][nextCol] === value && !merged) {
                    newRow = nextRow;
                    newCol = nextCol;
                    value *= 2;
                    score += value;
                    merged = true;
                    moved = true;
                    break;
                } else {
                    break;
                }
            }

            if (newRow !== pos.row || newCol !== pos.col) {
                newBoard[pos.row][pos.col] = 0;
                newBoard[newRow][newCol] = value;
            }
        });

        return [newBoard, moved, score];
    }

    // 获取智能AI的下一步移动
    getSmartMove() {
        const directions = ['up', 'down', 'left', 'right'];
        let bestScore = -Infinity;
        let bestMove = 'up';
        const board = this.game.getBoard();

        for (const direction of directions) {
            const [newBoard, moved, moveScore] = this.simulateMove(board, direction);
            if (!moved) continue;

            let totalScore = 0;
            let simulations = 3;
            
            for (let i = 0; i < simulations; i++) {
                let simulationBoard = newBoard.map(row => [...row]);
                let currentScore = moveScore;
                let depth = 3;
                
                while (depth > 0) {
                    let bestSimScore = -Infinity;
                    let validMoves = 0;
                    
                    for (const simDirection of directions) {
                        const [nextBoard, moved, score] = this.simulateMove(simulationBoard, simDirection);
                        if (!moved) continue;
                        validMoves++;
                        
                        const evalScore = this.evaluateBoard(nextBoard) + score;
                        bestSimScore = Math.max(bestSimScore, evalScore);
                    }
                    
                    if (validMoves === 0) break;
                    currentScore += bestSimScore;
                    depth--;
                }
                
                totalScore += currentScore;
            }

            const averageScore = totalScore / simulations;
            if (averageScore > bestScore) {
                bestScore = averageScore;
                bestMove = direction;
            }
        }

        return bestMove;
    }

    // 获取随机移动
    getRandomMove() {
        const directions = ['up', 'down', 'left', 'right'];
        return directions[Math.floor(Math.random() * directions.length)];
    }

    // 开始AI游戏
    start(mode = 'smart') {
        if (this.isPlaying) return;
        
        this.mode = mode;
        this.isPlaying = true;
        this.step();
    }

    // 执行一步
    step() {
        if (!this.isPlaying) return;
        
        const direction = this.mode === 'smart' ? this.getSmartMove() : this.aiPlayer.getNextMove();
        const moved = this.game.move(direction);
        
        if (!moved || this.game.isGameOverState()) {
            this.stop();
            return;
        }
        
        this.timeoutId = setTimeout(() => this.step(), this.moveDelay);
    }

    // 停止AI游戏
    stop() {
        this.isPlaying = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    // 设置移动延迟
    setMoveDelay(delay) {
        this.moveDelay = delay;
    }

    // 检查AI是否正在运行
    isRunning() {
        return this.isPlaying;
    }
}

export class AIPlayer {
    constructor(game) {
        this.game = game;
        this.delay = 200;
        this.algorithm = 'minimax';
        this.isRunning = false;
        this.moveQueue = [];
    }

    setDelay(delay) {
        this.delay = delay;
    }

    setAlgorithm(algorithm) {
        this.algorithm = algorithm;
    }

    start() {
        this.isRunning = true;
        this.makeMove();
    }

    stop() {
        this.isRunning = false;
        this.moveQueue = [];
    }

    async makeMove() {
        while (this.isRunning && !this.game.isGameOver()) {
            const move = this.getNextMove();
            if (move) {
                this.game.move(move);
                await new Promise(resolve => setTimeout(resolve, this.delay));
            } else {
                this.stop();
                break;
            }
        }
    }

    getNextMove() {
        // 简单的AI策略：随机选择一个有效的移动方向
        const directions = ['up', 'right', 'down', 'left'];
        const validMoves = directions.filter(dir => {
            const gridCopy = JSON.parse(JSON.stringify(this.game.getGrid()));
            const scoreCopy = this.game.getScore();
            const moved = this.game.move(dir);
            
            // 恢复游戏状态
            this.game.grid = gridCopy;
            this.game.score = scoreCopy;
            
            return moved;
        });

        if (validMoves.length === 0) return null;
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    // 后续可以添加更复杂的AI算法
    minimaxMove() {
        // TODO: 实现极小化极大算法
    }

    expectimaxMove() {
        // TODO: 实现期望最大值算法
    }

    monteCarloMove() {
        // TODO: 实现蒙特卡洛树搜索
    }
}

export default AI2048;
