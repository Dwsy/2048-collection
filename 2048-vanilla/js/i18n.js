const translations = {
    en: {
        title: '2048',
        score: 'Score',
        newGame: 'New Game',
        smartAI: 'Smart AI',
        randomAI: 'Random AI',
        stopAI: 'Stop AI',
        gameOver: 'Game Over!',
        boardSize: 'Board Size',
        language: 'Language',
        settings: 'Settings',
        apply: 'Apply',
        cancel: 'Cancel'
    },
    zh: {
        title: '2048',
        score: '分数',
        newGame: '新游戏',
        smartAI: '智能AI',
        randomAI: '随机AI',
        stopAI: '停止AI',
        gameOver: '游戏结束！',
        boardSize: '棋盘大小',
        language: '语言',
        settings: '设置',
        apply: '应用',
        cancel: '取消'
    },
    'zh-CN': {
        title: '2048 游戏',
        score: '分数',
        newGame: '新游戏',
        settings: '设置',
        theme: '主题',
        aiMode: 'AI 模式',
        stopAI: '停止 AI',
        gameOver: '游戏结束!',
        restart: '重新开始',
        settingsTitle: '游戏设置',
        gridSize: '网格大小',
        themeDefault: '默认',
        themeDark: '深色',
        themeColorful: '彩色',
        aiAlgorithm: 'AI 算法',
        aiMinimax: '极小化极大',
        aiExpectimax: '期望最大值',
        aiMontecarlo: '蒙特卡洛树搜索',
        aiDelay: 'AI 延迟 (ms)',
        save: '保存',
        cancel: '取消'
    }
};

class I18n {
    constructor() {
        this.currentLocale = localStorage.getItem('locale') || 'en';
    }

    setLocale(locale) {
        if (translations[locale]) {
            this.currentLocale = locale;
            localStorage.setItem('locale', locale);
            this.updateUI();
        }
    }

    t(key) {
        return translations[this.currentLocale]?.[key] || translations.en[key] || key;
    }

    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            if (key) {
                if (element.tagName === 'INPUT' && element.type === 'button') {
                    element.value = this.t(key);
                } else {
                    element.textContent = this.t(key);
                }
            }
        });
    }

    getCurrentLocale() {
        return this.currentLocale;
    }

    getAvailableLocales() {
        return Object.keys(translations);
    }
}

export default new I18n();
