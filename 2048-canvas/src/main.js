class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.tiles = [];
    this.score = 0;
    this.gameOver = false;
    this.touchStart = null;
    this.animating = false;
    this.animations = [];

    // Set canvas size
    this.handleResize();

    // Initialize game
    this.initGame();

    // Event listeners
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    document.querySelector('.new-game-button').addEventListener('click', () => this.initGame());

    // Start animation loop
    this.animate();
  }

  handleResize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    
    this.canvas.width = width;
    this.canvas.height = height;
    this.tileSize = Math.min(width, height) / 4;
    this.padding = this.tileSize * 0.1;

    this.render();
  }

  initGame() {
    this.tiles = [];
    this.score = 0;
    this.gameOver = false;
    document.getElementById('score').textContent = '0';
    this.animations = [];

    // Remove game over screen if exists
    const gameOver = document.querySelector('.game-over');
    if (gameOver) {
      gameOver.parentElement.removeChild(gameOver);
    }

    // Add initial tiles
    this.addRandomTile();
    this.addRandomTile();
    this.render();
  }

  addRandomTile() {
    const emptyCells = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!this.tiles.some(tile => tile.row === row && tile.col === col)) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.9 ? 2 : 4;
      const tile = {
        value,
        row,
        col,
        scale: 0,
        merging: false
      };
      this.tiles.push(tile);
      this.animations.push({
        tile,
        property: 'scale',
        start: 0,
        end: 1,
        duration: 200,
        startTime: performance.now()
      });
    }
  }

  getTileColor(value) {
    const colors = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e'
    };
    return colors[value] || '#cdc1b4';
  }

  getTileTextColor(value) {
    return value <= 4 ? '#776e65' : '#f9f6f2';
  }

  move(direction) {
    if (this.gameOver || this.animating) return;

    const directionMap = {
      up: { rowDelta: -1, colDelta: 0 },
      down: { rowDelta: 1, colDelta: 0 },
      left: { rowDelta: 0, colDelta: -1 },
      right: { rowDelta: 0, colDelta: 1 }
    };

    const { rowDelta, colDelta } = directionMap[direction];
    let moved = false;
    const tilesToRemove = [];
    this.animations = [];

    // Sort tiles based on direction
    const sortedTiles = [...this.tiles].sort((a, b) => {
      if (direction === 'up') return a.row - b.row;
      if (direction === 'down') return b.row - a.row;
      if (direction === 'left') return a.col - b.col;
      return b.col - a.col;
    });

    // Move tiles
    sortedTiles.forEach(tile => {
      let { row, col } = tile;
      let newRow = row;
      let newCol = col;

      while (true) {
        const nextRow = newRow + rowDelta;
        const nextCol = newCol + colDelta;

        if (nextRow < 0 || nextRow > 3 || nextCol < 0 || nextCol > 3) break;

        const nextTile = this.tiles.find(t => t.row === nextRow && t.col === nextCol && !tilesToRemove.includes(t));
        if (!nextTile) {
          newRow = nextRow;
          newCol = nextCol;
          moved = true;
        } else if (nextTile.value === tile.value && !tile.merging && !nextTile.merging) {
          newRow = nextRow;
          newCol = nextCol;
          tile.value *= 2;
          tile.merging = true;
          this.score += tile.value;
          tilesToRemove.push(nextTile);
          moved = true;
          break;
        } else {
          break;
        }
      }

      if (newRow !== row || newCol !== col) {
        this.animations.push({
          tile,
          property: 'row',
          start: row,
          end: newRow,
          duration: 150,
          startTime: performance.now()
        });
        this.animations.push({
          tile,
          property: 'col',
          start: col,
          end: newCol,
          duration: 150,
          startTime: performance.now()
        });
        if (tile.merging) {
          this.animations.push({
            tile,
            property: 'scale',
            start: 1,
            end: 1.2,
            duration: 100,
            startTime: performance.now()
          });
          this.animations.push({
            tile,
            property: 'scale',
            start: 1.2,
            end: 1,
            duration: 100,
            startTime: performance.now() + 100
          });
        }
        tile.row = newRow;
        tile.col = newCol;
      }
    });

    if (moved) {
      this.animating = true;
      document.getElementById('score').textContent = this.score;

      // Remove merged tiles after animation
      setTimeout(() => {
        this.tiles = this.tiles.filter(tile => !tilesToRemove.includes(tile));
        this.tiles.forEach(tile => tile.merging = false);
        this.addRandomTile();
        this.animating = false;
        this.checkGameOver();
      }, 150);
    }
  }

  checkGameOver() {
    if (this.tiles.length < 16) return;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const tile = this.tiles.find(t => t.row === row && t.col === col);
        if (tile) {
          const value = tile.value;
          // Check adjacent cells
          if (
            (row > 0 && this.tiles.find(t => t.row === row - 1 && t.col === col)?.value === value) ||
            (row < 3 && this.tiles.find(t => t.row === row + 1 && t.col === col)?.value === value) ||
            (col > 0 && this.tiles.find(t => t.row === row && t.col === col - 1)?.value === value) ||
            (col < 3 && this.tiles.find(t => t.row === row && t.col === col + 1)?.value === value)
          ) {
            return;
          }
        }
      }
    }

    this.gameOver = true;
    this.showGameOver();
  }

  showGameOver() {
    const gameOver = document.createElement('div');
    gameOver.className = 'game-over';
    gameOver.innerHTML = `
      <h2>Game Over!</h2>
      <button class="new-game-button">Try Again</button>
    `;
    document.querySelector('.game-container').appendChild(gameOver);
    gameOver.querySelector('button').addEventListener('click', () => {
      gameOver.parentElement.removeChild(gameOver);
      this.initGame();
    });
  }

  handleKeyDown(event) {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.move('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.move('down');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.move('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.move('right');
        break;
    }
  }

  handleTouchStart(event) {
    const touch = event.touches[0];
    this.touchStart = { x: touch.clientX, y: touch.clientY };
  }

  handleTouchEnd(event) {
    if (!this.touchStart) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.touchStart.x;
    const deltaY = touch.clientY - this.touchStart.y;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        this.move(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        this.move(deltaY > 0 ? 'down' : 'up');
      }
    }

    this.touchStart = null;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  render() {
    const now = performance.now();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid
    this.ctx.fillStyle = '#cdc1b4';
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const x = col * this.tileSize + this.padding;
        const y = row * this.tileSize + this.padding;
        const size = this.tileSize - this.padding * 2;
        this.ctx.fillRect(x, y, size, size);
      }
    }

    // Update animations
    this.animations = this.animations.filter(animation => {
      const elapsed = now - animation.startTime;
      if (elapsed >= animation.duration) {
        animation.tile[animation.property] = animation.end;
        return false;
      }
      const progress = elapsed / animation.duration;
      animation.tile[animation.property] = animation.start + (animation.end - animation.start) * progress;
      return true;
    });

    // Draw tiles
    this.tiles.forEach(tile => {
      const scale = tile.scale ?? 1;
      const x = tile.col * this.tileSize + this.padding;
      const y = tile.row * this.tileSize + this.padding;
      const size = (this.tileSize - this.padding * 2) * scale;
      const offsetX = (this.tileSize - size) / 2;
      const offsetY = (this.tileSize - size) / 2;

      // Draw tile background
      this.ctx.fillStyle = this.getTileColor(tile.value);
      this.ctx.fillRect(x + offsetX, y + offsetY, size, size);

      // Draw tile text
      this.ctx.fillStyle = this.getTileTextColor(tile.value);
      this.ctx.font = `bold ${size * 0.4}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(
        tile.value.toString(),
        x + offsetX + size / 2,
        y + offsetY + size / 2
      );
    });
  }
}

// Initialize game
new Game();
