# 2048 游戏

一个使用原生 JavaScript 实现的 2048 游戏，具有多种主题和 AI 模式。

## 特性

- 🎮 经典的 2048 游戏玩法
- 🎨 多种主题选择（默认、深色、彩色）
- 🤖 多种 AI 算法支持
  - 极小化极大算法
  - 期望最大值算法
  - 蒙特卡洛树搜索
- 📱 响应式设计，支持移动设备
- ⚙️ 可自定义设置
  - 网格大小（3x3 到 6x6）
  - AI 决策时间
  - 主题选择

## 如何运行

1. 克隆仓库：
```bash
git clone https://github.com/yourusername/2048-game.git
cd 2048-game
```

2. 使用本地服务器运行（例如使用 Python）：
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

3. 在浏览器中打开：
```
http://localhost:8000
```

## 游戏控制

- 使用方向键（↑ ↓ ← →）控制方块移动
- 点击"新游戏"按钮开始新游戏
- 点击"设置"按钮调整游戏参数
- 点击"AI 模式"让 AI 开始游戏

## AI 模式

游戏支持多种 AI 算法：

1. 极小化极大算法（Minimax）
   - 通过评估多个移动步骤来选择最优移动
   - 适合需要策略性思考的情况

2. 期望最大值算法（Expectimax）
   - 考虑随机性的决策算法
   - 在有随机事件的游戏中表现更好

3. 蒙特卡洛树搜索（Monte Carlo Tree Search）
   - 通过模拟多次游戏来选择最佳移动
   - 能在复杂情况下找到好的解决方案

## 主题

游戏提供三种视觉主题：

1. 默认主题：经典的 2048 游戏外观
2. 深色主题：护眼的深色模式
3. 彩色主题：充满活力的色彩搭配

## 技术栈

- 原生 JavaScript（ES6+）
- CSS3 用于样式和动画
- HTML5

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License - 详见 LICENSE 文件
