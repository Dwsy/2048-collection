import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';

// Tile Model
const TileModel = Backbone.Model.extend({
  defaults: {
    value: 2,
    row: 0,
    col: 0
  }
});

// Game Model
const GameModel = Backbone.Model.extend({
  defaults: {
    score: 0,
    gameOver: false
  },

  initialize: function() {
    this.tiles = new Backbone.Collection([], { model: TileModel });
    this.initGame();
  },

  initGame: function() {
    this.tiles.reset();
    this.set('score', 0);
    this.set('gameOver', false);
    this.addRandomTile();
    this.addRandomTile();
  },

  addRandomTile: function() {
    const emptyCells = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!this.tiles.find(tile => tile.get('row') === row && tile.get('col') === col)) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.tiles.add({
        value: Math.random() < 0.9 ? 2 : 4,
        row,
        col
      });
    }
  },

  move: function(direction) {
    if (this.get('gameOver')) return;

    const tiles = this.tiles.toArray();
    let moved = false;
    let newScore = this.get('score');

    // Sort tiles based on direction
    tiles.sort((a, b) => {
      if (direction === 'up') return a.get('row') - b.get('row');
      if (direction === 'down') return b.get('row') - a.get('row');
      if (direction === 'left') return a.get('col') - b.get('col');
      return b.get('col') - a.get('col');
    });

    // Move and merge tiles
    tiles.forEach(tile => {
      let row = tile.get('row');
      let col = tile.get('col');
      let newRow = row;
      let newCol = col;

      while (true) {
        let nextRow = direction === 'up' ? newRow - 1 : direction === 'down' ? newRow + 1 : newRow;
        let nextCol = direction === 'left' ? newCol - 1 : direction === 'right' ? newCol + 1 : newCol;

        if (nextRow < 0 || nextRow > 3 || nextCol < 0 || nextCol > 3) break;

        const nextTile = this.tiles.find(t => 
          t !== tile && t.get('row') === nextRow && t.get('col') === nextCol
        );

        if (!nextTile) {
          newRow = nextRow;
          newCol = nextCol;
          moved = moved || newRow !== row || newCol !== col;
        } else if (nextTile.get('value') === tile.get('value')) {
          newRow = nextRow;
          newCol = nextCol;
          tile.set('value', tile.get('value') * 2);
          newScore += tile.get('value');
          this.tiles.remove(nextTile);
          moved = true;
          break;
        } else {
          break;
        }
      }

      tile.set({ row: newRow, col: newCol });
    });

    if (moved) {
      this.set('score', newScore);
      this.addRandomTile();
      this.checkGameOver();
    }
  },

  checkGameOver: function() {
    if (this.tiles.length < 16) return;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const tile = this.tiles.find(t => t.get('row') === row && t.get('col') === col);
        if (tile) {
          const value = tile.get('value');
          // Check adjacent cells
          if (
            (row > 0 && this.tiles.find(t => t.get('row') === row - 1 && t.get('col') === col)?.get('value') === value) ||
            (row < 3 && this.tiles.find(t => t.get('row') === row + 1 && t.get('col') === col)?.get('value') === value) ||
            (col > 0 && this.tiles.find(t => t.get('row') === row && t.get('col') === col - 1)?.get('value') === value) ||
            (col < 3 && this.tiles.find(t => t.get('row') === row && t.get('col') === col + 1)?.get('value') === value)
          ) {
            return;
          }
        }
      }
    }

    this.set('gameOver', true);
  }
});

// Game View
const GameView = Backbone.View.extend({
  el: '#game',

  events: {
    'click .new-game-button': 'newGame',
    'touchstart .game-board': 'handleTouchStart',
    'touchend .game-board': 'handleTouchEnd'
  },

  initialize: function() {
    this.model = new GameModel();
    this.listenTo(this.model, 'change:score', this.updateScore);
    this.listenTo(this.model, 'change:gameOver', this.renderGameOver);
    this.listenTo(this.model.tiles, 'all', this.render);

    $(document).on('keydown', this.handleKeyDown.bind(this));
    this.render();
  },

  render: function() {
    const $board = this.$('.game-board');
    $board.empty();

    // Create grid
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const $cell = $('<div>').addClass('cell');
        const tile = this.model.tiles.find(t => t.get('row') === row && t.get('col') === col);
        
        if (tile) {
          const $tile = $('<div>')
            .addClass(`tile tile-${tile.get('value')}`)
            .text(tile.get('value'));
          $cell.append($tile);
        }
        
        $board.append($cell);
      }
    }

    return this;
  },

  updateScore: function() {
    this.$('#score').text(this.model.get('score'));
  },

  renderGameOver: function() {
    if (this.model.get('gameOver')) {
      const $gameOver = $('<div>')
        .addClass('game-over')
        .html('<div>Game Over!</div>')
        .append(
          $('<button>')
            .addClass('new-game-button')
            .text('Try Again')
            .on('click', () => this.newGame())
        );
      this.$('.game-board').append($gameOver);
    }
  },

  newGame: function() {
    this.model.initGame();
  },

  handleKeyDown: function(event) {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.model.move('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.model.move('down');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.model.move('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.model.move('right');
        break;
    }
  },

  touchStart: null,

  handleTouchStart: function(event) {
    const touch = event.touches[0];
    this.touchStart = { x: touch.clientX, y: touch.clientY };
  },

  handleTouchEnd: function(event) {
    if (!this.touchStart) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.touchStart.x;
    const deltaY = touch.clientY - this.touchStart.y;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        this.model.move(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        this.model.move(deltaY > 0 ? 'down' : 'up');
      }
    }

    this.touchStart = null;
  }
});

// Initialize the game
new GameView();
