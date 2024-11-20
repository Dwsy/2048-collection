import * as THREE from 'three';
import { gsap } from 'gsap';

class Game {
  constructor() {
    this.tiles = [];
    this.score = 0;
    this.gameOver = false;
    this.touchStart = null;

    // Initialize Three.js scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.z = 10;

    // Initialize renderer
    this.canvas = document.getElementById('game-canvas');
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0xbbada0);

    // Create game board
    this.createBoard();

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 20, 10);
    this.scene.add(directionalLight);

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
    this.handleResize();
  }

  createBoard() {
    // Create board geometry
    const boardGeometry = new THREE.BoxGeometry(8, 8, 0.5);
    const boardMaterial = new THREE.MeshPhongMaterial({ color: 0xbbada0 });
    this.board = new THREE.Mesh(boardGeometry, boardMaterial);
    this.scene.add(this.board);

    // Create grid lines
    const gridGeometry = new THREE.BoxGeometry(7.8, 0.1, 0.6);
    const gridMaterial = new THREE.MeshPhongMaterial({ color: 0xcdc1b4 });
    
    for (let i = 0; i < 3; i++) {
      const horizontalLine = new THREE.Mesh(gridGeometry, gridMaterial);
      horizontalLine.position.y = -3 + (i + 1) * 2;
      horizontalLine.position.z = 0.1;
      this.board.add(horizontalLine);

      const verticalLine = new THREE.Mesh(gridGeometry, gridMaterial);
      verticalLine.rotation.z = Math.PI / 2;
      verticalLine.position.x = -3 + (i + 1) * 2;
      verticalLine.position.z = 0.1;
      this.board.add(verticalLine);
    }
  }

  createTile(value, row, col) {
    const tileGeometry = new THREE.BoxGeometry(1.8, 1.8, 0.5);
    const color = this.getTileColor(value);
    const tileMaterial = new THREE.MeshPhongMaterial({ color });
    const tile = new THREE.Mesh(tileGeometry, tileMaterial);

    // Position tile
    tile.position.x = -3 + col * 2;
    tile.position.y = 3 - row * 2;
    tile.position.z = 0.3;

    // Add text
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = value <= 4 ? '#776e65' : '#f9f6f2';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 64px Arial';
    ctx.fillText(value.toString(), 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const textGeometry = new THREE.PlaneGeometry(1.5, 1.5);
    const textMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.z = 0.3;
    tile.add(textMesh);

    return tile;
  }

  getTileColor(value) {
    const colors = {
      2: 0xeee4da,
      4: 0xede0c8,
      8: 0xf2b179,
      16: 0xf59563,
      32: 0xf67c5f,
      64: 0xf65e3b,
      128: 0xedcf72,
      256: 0xedcc61,
      512: 0xedc850,
      1024: 0xedc53f,
      2048: 0xedc22e
    };
    return colors[value] || 0xcdc1b4;
  }

  initGame() {
    // Clear existing tiles
    this.tiles.forEach(tile => this.scene.remove(tile.mesh));
    this.tiles = [];
    this.score = 0;
    this.gameOver = false;
    document.getElementById('score').textContent = '0';

    // Add initial tiles
    this.addRandomTile();
    this.addRandomTile();
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
      const mesh = this.createTile(value, row, col);
      this.scene.add(mesh);
      this.tiles.push({ value, row, col, mesh });
    }
  }

  move(direction) {
    if (this.gameOver) return;

    const directionMap = {
      up: { rowDelta: -1, colDelta: 0 },
      down: { rowDelta: 1, colDelta: 0 },
      left: { rowDelta: 0, colDelta: -1 },
      right: { rowDelta: 0, colDelta: 1 }
    };

    const { rowDelta, colDelta } = directionMap[direction];
    let moved = false;
    const tilesToRemove = [];

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

        const nextTile = this.tiles.find(t => t.row === nextRow && t.col === nextCol);
        if (!nextTile) {
          newRow = nextRow;
          newCol = nextCol;
          moved = true;
        } else if (nextTile.value === tile.value && !tilesToRemove.includes(nextTile)) {
          newRow = nextRow;
          newCol = nextCol;
          tile.value *= 2;
          this.score += tile.value;
          tilesToRemove.push(nextTile);
          moved = true;
          break;
        } else {
          break;
        }
      }

      if (newRow !== row || newCol !== col) {
        tile.row = newRow;
        tile.col = newCol;
        gsap.to(tile.mesh.position, {
          x: -3 + newCol * 2,
          y: 3 - newRow * 2,
          duration: 0.15
        });
      }
    });

    // Remove merged tiles
    tilesToRemove.forEach(tile => {
      this.scene.remove(tile.mesh);
      this.tiles = this.tiles.filter(t => t !== tile);
    });

    if (moved) {
      document.getElementById('score').textContent = this.score;
      this.addRandomTile();
      this.checkGameOver();
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
    document.getElementById('app').appendChild(gameOver);
    gameOver.querySelector('button').addEventListener('click', () => {
      document.getElementById('app').removeChild(gameOver);
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

  handleResize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.board.rotation.x = 0.1;
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize game
new Game();
