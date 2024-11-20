import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tile {
  value: number;
  id: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  board: number[][] = Array(4).fill(null).map(() => Array(4).fill(0));
  tiles: Tile[] = [];
  score: number = 0;
  bestScore: number = 0;
  gameOver: boolean = false;
  nextId: number = 1;
  touchStart: { x: number; y: number } | null = null;

  ngOnInit() {
    this.initializeGame();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp': this.move('up'); break;
      case 'ArrowDown': this.move('down'); break;
      case 'ArrowLeft': this.move('left'); break;
      case 'ArrowRight': this.move('right'); break;
    }
  }

  handleTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    this.touchStart = { x: touch.clientX, y: touch.clientY };
  }

  handleTouchEnd(event: TouchEvent) {
    if (!this.touchStart) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.touchStart.x;
    const deltaY = touch.clientY - this.touchStart.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (Math.max(absDeltaX, absDeltaY) > 10) {
      if (absDeltaX > absDeltaY) {
        this.move(deltaX > 0 ? 'right' : 'left');
      } else {
        this.move(deltaY > 0 ? 'down' : 'up');
      }
    }

    this.touchStart = null;
  }

  initializeGame() {
    this.board = Array(4).fill(null).map(() => Array(4).fill(0));
    this.tiles = [];
    this.score = 0;
    this.gameOver = false;
    this.addTile();
    this.addTile();
  }

  addTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }

    if (emptyCells.length === 0) return;

    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    this.board[x][y] = value;
    this.tiles.push({ value, x, y, id: this.nextId++ });
  }

  checkGameOver(): boolean {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) return false;
        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) return false;
        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) return false;
      }
    }
    return true;
  }

  move(direction: 'up' | 'down' | 'left' | 'right') {
    if (this.gameOver) return;

    const rotateBoard = (board: number[][], times: number): number[][] => {
      let newBoard = [...board.map(row => [...row])];
      for (let i = 0; i < times; i++) {
        const rotated = Array(4).fill(null).map(() => Array(4).fill(0));
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            rotated[i][j] = newBoard[3 - j][i];
          }
        }
        newBoard = rotated;
      }
      return newBoard;
    };

    const moveLeft = (board: number[][]): { board: number[][]; moved: boolean; score: number } => {
      let moved = false;
      let score = 0;
      const newBoard = board.map(row => {
        const newRow = row.filter(cell => cell !== 0);
        for (let i = 0; i < newRow.length - 1; i++) {
          if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            score += newRow[i];
            newRow.splice(i + 1, 1);
            moved = true;
          }
        }
        while (newRow.length < 4) newRow.push(0);
        if (newRow.join(',') !== row.join(',')) moved = true;
        return newRow;
      });
      return { board: newBoard, moved, score };
    };

    let rotations = 0;
    switch (direction) {
      case 'up': rotations = 1; break;
      case 'right': rotations = 2; break;
      case 'down': rotations = 3; break;
      default: rotations = 0;
    }

    let board = rotateBoard(this.board, rotations);
    const { board: movedBoard, moved, score } = moveLeft(board);
    board = rotateBoard(movedBoard, (4 - rotations) % 4);

    if (moved) {
      this.board = board;
      this.score += score;
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
      }

      // Update tiles
      this.tiles = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (board[i][j] !== 0) {
            this.tiles.push({
              value: board[i][j],
              x: i,
              y: j,
              id: this.nextId++
            });
          }
        }
      }

      this.addTile();
      this.gameOver = this.checkGameOver();
    }
  }
}
