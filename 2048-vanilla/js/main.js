import { Game } from './game.js';
import { AIPlayer } from './ai.js';

class GameManager {
    constructor() {
        this.game = new Game(4);
        this.aiPlayer = new AIPlayer(this.game);
        this.isAIRunning = false;
        this.settings = this.loadSettings();
        this.initEventListeners();
        this.applySettings();
        this.game.init();
    }

    loadSettings() {
        const defaultSettings = {
            gridSize: 4,
            theme: 'default',
            aiDelay: 200,
            aiAlgorithm: 'minimax'
        };

        const savedSettings = localStorage.getItem('gameSettings');
        return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('gameSettings', JSON.stringify(this.settings));
    }

    applySettings() {
        // 应用主题
        document.body.dataset.theme = this.settings.theme;
        
        // 更新网格大小
        if (this.game.size !== this.settings.gridSize) {
            this.game.setSize(this.settings.gridSize);
        }
        
        // 更新 AI 设置
        this.aiPlayer.setDelay(this.settings.aiDelay);
        this.aiPlayer.setAlgorithm(this.settings.aiAlgorithm);
    }

    initEventListeners() {
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (!this.isAIRunning) {
                switch(e.key) {
                    case 'ArrowUp': 
                        e.preventDefault();
                        this.game.move('up');
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.game.move('down');
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.game.move('left');
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.game.move('right');
                        break;
                }
            }
        });

        // 新游戏按钮
        document.getElementById('new-game').addEventListener('click', () => {
            this.game.init();
            if (this.isAIRunning) {
                this.stopAI();
            }
        });

        // 重新开始按钮
        document.getElementById('restart-btn').addEventListener('click', () => {
            document.getElementById('game-over').style.display = 'none';
            this.game.init();
        });

        // AI 控制
        document.getElementById('ai-btn').addEventListener('click', () => {
            if (this.isAIRunning) {
                this.stopAI();
            } else {
                this.startAI();
            }
        });

        // 主题切换
        document.getElementById('theme-btn').addEventListener('click', () => {
            const themes = ['default', 'dark', 'colorful'];
            const currentIndex = themes.indexOf(this.settings.theme);
            this.settings.theme = themes[(currentIndex + 1) % themes.length];
            this.applySettings();
            this.saveSettings();
        });

        // 设置按钮
        document.getElementById('settings-btn').addEventListener('click', () => {
            document.getElementById('settings-overlay').style.display = 'block';
            document.getElementById('settings-panel').style.display = 'block';
            
            // 填充当前设置
            document.getElementById('grid-size').value = this.settings.gridSize;
            document.getElementById('theme-select').value = this.settings.theme;
            document.getElementById('ai-algorithm').value = this.settings.aiAlgorithm;
            document.getElementById('ai-delay').value = this.settings.aiDelay;
        });

        // 保存设置
        document.getElementById('settings-save').addEventListener('click', () => {
            this.settings.gridSize = parseInt(document.getElementById('grid-size').value);
            this.settings.theme = document.getElementById('theme-select').value;
            this.settings.aiAlgorithm = document.getElementById('ai-algorithm').value;
            this.settings.aiDelay = parseInt(document.getElementById('ai-delay').value);
            
            this.applySettings();
            this.saveSettings();
            
            document.getElementById('settings-overlay').style.display = 'none';
            document.getElementById('settings-panel').style.display = 'none';
        });

        // 取消设置
        document.getElementById('settings-cancel').addEventListener('click', () => {
            document.getElementById('settings-overlay').style.display = 'none';
            document.getElementById('settings-panel').style.display = 'none';
        });
    }

    startAI() {
        this.isAIRunning = true;
        document.getElementById('ai-btn').textContent = 'Stop AI';
        this.aiPlayer.start();
    }

    stopAI() {
        this.isAIRunning = false;
        document.getElementById('ai-btn').textContent = 'AI 模式';
        this.aiPlayer.stop();
    }
}

// 启动游戏
window.onload = () => {
    new GameManager();
};
