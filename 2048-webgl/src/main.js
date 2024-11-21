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
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 10, 15);
    this.camera.lookAt(0, 0, 0);

    // Mouse control variables
    this.isDragging = false;
    this.previousMousePosition = {
      x: 0,
      y: 0
    };
    this.currentRotation = {
      x: 0,
      y: 0
    };
    this.targetRotation = {
      x: 0,
      y: 0
    };

    // Create game container group
    this.gameContainer = new THREE.Group();
    this.scene.add(this.gameContainer);

    // Initialize renderer with error handling
    try {
      this.canvas = document.getElementById('game-canvas');
      this.renderer = new THREE.WebGLRenderer({ 
        canvas: this.canvas, 
        antialias: true,
        alpha: true 
      });
      
      // Set size and pixel ratio
      this.updateRendererSize();
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setClearColor(0xfaf8ef, 1);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      
    } catch (error) {
      console.error('WebGL initialization failed:', error);
      document.body.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <h2>WebGL Error</h2>
          <p>Your browser doesn't support WebGL or it's disabled. Please enable WebGL or try a different browser.</p>
        </div>
      `;
      return;
    }

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Create game board
    this.createBoard();

    // Add initial tiles
    this.addRandomTile();
    this.addRandomTile();

    // Event listeners
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    document.querySelector('.new-game-button').addEventListener('click', () => this.initGame());

    // Mouse event listeners
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.onMouseUp.bind(this));

    // Start animation loop
    this.animate();
    this.handleResize();
  }

  createBoard() {
    // Create board geometry
    const boardGeometry = new THREE.BoxGeometry(8, 1, 8);
    const boardMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xbbada0
    });
    this.board = new THREE.Mesh(boardGeometry, boardMaterial);
    this.board.receiveShadow = true;
    this.gameContainer.add(this.board);

    // Create grid lines
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cellGeometry = new THREE.BoxGeometry(1.8, 0.2, 1.8);
        const cellMaterial = new THREE.MeshPhongMaterial({ 
          color: 0xcdc1b4,
          transparent: true,
          opacity: 0.5
        });
        const cell = new THREE.Mesh(cellGeometry, cellMaterial);
        cell.position.set(-3 + j * 2, 0.1, -3 + i * 2);
        cell.receiveShadow = true;
        this.board.add(cell);
      }
    }

    // Add board edges
    const edgeGeometry = new THREE.BoxGeometry(8.4, 1.2, 0.2);
    const edgeMaterial = new THREE.MeshPhongMaterial({ color: 0x8f7a66 });
    
    const edges = [
      { position: [0, 0, -4.1], rotation: [0, 0, 0] },
      { position: [0, 0, 4.1], rotation: [0, 0, 0] },
      { position: [-4.1, 0, 0], rotation: [0, Math.PI / 2, 0] },
      { position: [4.1, 0, 0], rotation: [0, Math.PI / 2, 0] }
    ];

    edges.forEach(({position, rotation}) => {
      const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
      edge.position.set(...position);
      edge.rotation.set(...rotation);
      edge.castShadow = true;
      edge.receiveShadow = true;
      this.board.add(edge);
    });
  }

  createTile(value, row, col) {
    // Create tile group to handle rotations
    const tileGroup = new THREE.Group();
    
    // Create tile cube with emissive material for glow effect
    const tileGeometry = new THREE.BoxGeometry(1.6, 1, 1.6);
    const color = this.getTileColor(value);
    const tileMaterial = new THREE.MeshPhongMaterial({ 
      color,
      shininess: 50,
      emissive: color,
      emissiveIntensity: 0.2
    });
    const tile = new THREE.Mesh(tileGeometry, tileMaterial);
    tile.castShadow = true;
    tile.receiveShadow = true;
    tileGroup.add(tile);

    // Create text on all visible faces
    const faces = [
      { rotation: [-Math.PI/2, 0, 0], position: [0, 0.51, 0] },  // top
      { rotation: [0, 0, 0], position: [0, 0, 0.81] },          // front
      { rotation: [0, Math.PI, 0], position: [0, 0, -0.81] },   // back
      { rotation: [0, -Math.PI/2, 0], position: [0.81, 0, 0] }, // right
      { rotation: [0, Math.PI/2, 0], position: [-0.81, 0, 0] }  // left
    ];

    faces.forEach(face => {
      const textMesh = this.createTextMesh(value);
      textMesh.rotation.set(...face.rotation);
      textMesh.position.set(...face.position);
      tileGroup.add(textMesh);
    });

    // Position tile group with initial scale animation
    tileGroup.position.set(-3 + col * 2, 0.6, -3 + row * 2);
    tileGroup.scale.set(0.01, 0.01, 0.01);
    gsap.to(tileGroup.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.2,
      ease: "back.out(1.7)"
    });

    return { mesh: tileGroup, value, row, col };
  }

  createTextMesh(value) {
    // Create text texture with higher resolution for retina displays
    const canvas = document.createElement('canvas');
    const scale = window.devicePixelRatio || 1;
    canvas.width = 512 * scale;
    canvas.height = 512 * scale;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Scale context for retina displays
    ctx.scale(scale, scale);
    
    // Create gradient for rainbow effect
    let gradient;
    if (value >= 128) {
      gradient = ctx.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, '#ff0000');
      gradient.addColorStop(0.2, '#ff8800');
      gradient.addColorStop(0.4, '#ffff00');
      gradient.addColorStop(0.6, '#00ff00');
      gradient.addColorStop(0.8, '#0000ff');
      gradient.addColorStop(1, '#ff00ff');
    }
    
    // Draw text
    const fontSize = value.toString().length > 2 ? 160 : 200;
    ctx.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add text stroke for better visibility
    if (value >= 128) {
      ctx.fillStyle = gradient;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.strokeText(value.toString(), 256, 256);
    } else {
      ctx.fillStyle = value <= 4 ? '#776e65' : '#f9f6f2';
      ctx.strokeStyle = value <= 4 ? '#776e65' : '#f9f6f2';
      ctx.lineWidth = 6;
      ctx.strokeText(value.toString(), 256, 256);
    }
    
    ctx.fillText(value.toString(), 256, 256);

    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;

    // Create text plane with larger size for better visibility
    const textGeometry = new THREE.PlaneGeometry(1.4, 1.4);
    const textMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    return new THREE.Mesh(textGeometry, textMaterial);
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
    return colors[value] || 0xff0000; // 未知数值显示红色
  }

  initGame() {
    // Clear existing tiles
    this.tiles.forEach(tile => this.gameContainer.remove(tile.mesh));
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
      const tile = this.createTile(value, row, col);
      this.tiles.push(tile);
      this.gameContainer.add(tile.mesh);
    }
  }

  move(direction) {
    if (this.gameOver) return;

    const newTiles = Array(4).fill(null).map(() => Array(4).fill(null));
    let moved = false;
    let score = 0;
    let mergePromises = [];

    // Mark all tiles as not merged
    this.tiles.forEach(tile => {
      tile.merged = false;
    });

    // Get movement deltas
    const deltas = {
      'ArrowUp': { row: -1, col: 0 },
      'ArrowDown': { row: 1, col: 0 },
      'ArrowLeft': { row: 0, col: -1 },
      'ArrowRight': { row: 0, col: 1 }
    }[direction];

    if (!deltas) return;

    // Sort tiles for correct movement order
    const sortedTiles = [...this.tiles].sort((a, b) => {
      if (direction === 'ArrowDown') return b.row - a.row;
      if (direction === 'ArrowRight') return b.col - a.col;
      if (direction === 'ArrowUp') return a.row - b.row;
      if (direction === 'ArrowLeft') return a.col - b.col;
    });

    // Process each tile movement and merging
    sortedTiles.forEach(tile => {
      if (tile.merged) return; // Skip already merged tiles
      
      let { row, col, value } = tile;
      let newRow = row;
      let newCol = col;

      // Move tile as far as possible
      while (true) {
        const nextRow = newRow + deltas.row;
        const nextCol = newCol + deltas.col;

        if (nextRow < 0 || nextRow >= 4 || nextCol < 0 || nextCol >= 4) break;
        if (newTiles[nextRow][nextCol] !== null) break;

        newRow = nextRow;
        newCol = nextCol;
        moved = true;
      }

      // Check for merge
      const nextRow = newRow + deltas.row;
      const nextCol = newCol + deltas.col;
      
      if (nextRow >= 0 && nextRow < 4 && nextCol >= 0 && nextCol < 4) {
        const nextTile = newTiles[nextRow][nextCol];
        if (nextTile && nextTile.value === value && !nextTile.merged) {
          // Create merge animation promise
          const mergePromise = new Promise(resolve => {
            const mergedValue = value * 2;
            const mergedTile = this.createTile(mergedValue, nextRow, nextCol);
            mergedTile.merged = true;
            newTiles[nextRow][nextCol] = mergedTile;

            // Animate tiles merging
            const timeline = gsap.timeline({
              onComplete: () => {
                this.gameContainer.remove(tile.mesh);
                this.gameContainer.remove(nextTile.mesh);
                resolve();
              }
            });

            // Move to merge position
            timeline.to(tile.mesh.position, {
              x: -3 + nextCol * 2,
              z: -3 + nextRow * 2,
              duration: 0.15,
              ease: "power2.out"
            });

            // Scale effect for merging
            timeline.to([tile.mesh.scale, nextTile.mesh.scale], {
              x: 1.2,
              y: 1.2,
              z: 1.2,
              duration: 0.1,
              ease: "power2.out"
            }, "-=0.05");

            // Add merged tile with pop animation
            this.gameContainer.add(mergedTile.mesh);
            mergedTile.mesh.scale.set(0.01, 0.01, 0.01);
            timeline.to(mergedTile.mesh.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.15,
              ease: "back.out(1.7)"
            }, "-=0.1");

            score += mergedValue;
          });

          mergePromises.push(mergePromise);
          moved = true;
          return;
        }
      }

      // Update tile position if moved
      if (newRow !== row || newCol !== col) {
        tile.row = newRow;
        tile.col = newCol;
        gsap.to(tile.mesh.position, {
          x: -3 + newCol * 2,
          z: -3 + newRow * 2,
          duration: 0.15,
          ease: "power2.out"
        });
        newTiles[newRow][newCol] = tile;
      } else {
        newTiles[row][col] = tile;
      }
    });

    // Wait for all merges to complete before adding new tile
    Promise.all(mergePromises).then(() => {
      // Update tiles array
      this.tiles = this.tiles.filter(tile => {
        if (!newTiles.some(row => row.includes(tile))) {
          return false;
        }
        return true;
      });

      // Add new tile if the board changed
      if (moved) {
        this.addRandomTile();
        this.score += score;
        document.getElementById('score').textContent = this.score;
      }

      // Check for game over
      this.checkGameOver();
    });
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
        this.move('ArrowUp');
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.move('ArrowDown');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.move('ArrowLeft');
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.move('ArrowRight');
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
        this.move(deltaX > 0 ? 'ArrowRight' : 'ArrowLeft');
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        this.move(deltaY > 0 ? 'ArrowDown' : 'ArrowUp');
      }
    }

    this.touchStart = null;
  }

  handleResize() {
    if (!this.renderer || !this.camera) return;
    
    this.updateRendererSize();
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  updateRendererSize() {
    const minDimension = Math.min(window.innerWidth, window.innerHeight);
    const size = Math.min(minDimension - 40, 600);
    
    this.renderer.setSize(size, size, false);
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;
  }

  onMouseDown(event) {
    this.isDragging = true;
    this.previousMousePosition = {
      x: event.offsetX,
      y: event.offsetY
    };
  }

  onMouseMove(event) {
    if (!this.isDragging) return;

    const deltaMove = {
      x: event.offsetX - this.previousMousePosition.x,
      y: event.offsetY - this.previousMousePosition.y
    };

    this.targetRotation.x += deltaMove.y * 0.005;
    this.targetRotation.y += deltaMove.x * 0.005;

    // 限制垂直旋转范围
    this.targetRotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.targetRotation.x));

    this.previousMousePosition = {
      x: event.offsetX,
      y: event.offsetY
    };
  }

  onMouseUp() {
    this.isDragging = false;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // 平滑插值当前旋转到目标旋转
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.1;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.1;

    // 应用旋转到游戏容器
    this.gameContainer.rotation.x = this.currentRotation.x;
    this.gameContainer.rotation.y = this.currentRotation.y;
    
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize game
new Game();
