import 'dart:math';
import 'tile.dart';

enum Direction { up, down, left, right }

class Game {
  static const int size = 4;
  static const int winningValue = 2048;
  final List<List<Tile?>> grid;
  int score = 0;
  bool gameOver = false;
  bool won = false;

  Game() : grid = List.generate(
    size,
    (i) => List.generate(size, (j) => null),
  ) {
    addRandomTile();
    addRandomTile();
  }

  void addRandomTile() {
    List<List<int>> emptyCells = [];
    for (int i = 0; i < size; i++) {
      for (int j = 0; j < size; j++) {
        if (grid[i][j] == null) {
          emptyCells.add([i, j]);
        }
      }
    }

    if (emptyCells.isEmpty) return;

    final random = Random();
    final cell = emptyCells[random.nextInt(emptyCells.length)];
    final value = random.nextDouble() < 0.9 ? 2 : 4;
    grid[cell[0]][cell[1]] = Tile(
      value: value,
      row: cell[0],
      col: cell[1],
      isNew: true,
    );
  }

  bool move(Direction direction) {
    if (gameOver || won) return false;

    bool moved = false;
    List<List<Tile?>> newGrid = List.generate(
      size,
      (i) => List.generate(size, (j) => null),
    );

    switch (direction) {
      case Direction.left:
        for (int row = 0; row < size; row++) {
          List<Tile?> currentRow = grid[row].where((tile) => tile != null).toList();
          List<Tile?> mergedRow = _mergeTiles(currentRow);
          for (int col = 0; col < mergedRow.length; col++) {
            if (mergedRow[col] != null) {
              newGrid[row][col] = mergedRow[col]!.copyWith(row: row, col: col);
            }
          }
        }
        break;
      case Direction.right:
        for (int row = 0; row < size; row++) {
          List<Tile?> currentRow = grid[row].where((tile) => tile != null).toList().reversed.toList();
          List<Tile?> mergedRow = _mergeTiles(currentRow);
          for (int col = 0; col < mergedRow.length; col++) {
            if (mergedRow[col] != null) {
              newGrid[row][size - 1 - col] = mergedRow[col]!.copyWith(row: row, col: size - 1 - col);
            }
          }
        }
        break;
      case Direction.up:
        for (int col = 0; col < size; col++) {
          List<Tile?> currentCol = [];
          for (int row = 0; row < size; row++) {
            if (grid[row][col] != null) currentCol.add(grid[row][col]);
          }
          List<Tile?> mergedCol = _mergeTiles(currentCol);
          for (int row = 0; row < mergedCol.length; row++) {
            if (mergedCol[row] != null) {
              newGrid[row][col] = mergedCol[row]!.copyWith(row: row, col: col);
            }
          }
        }
        break;
      case Direction.down:
        for (int col = 0; col < size; col++) {
          List<Tile?> currentCol = [];
          for (int row = size - 1; row >= 0; row--) {
            if (grid[row][col] != null) currentCol.add(grid[row][col]);
          }
          List<Tile?> mergedCol = _mergeTiles(currentCol);
          for (int row = 0; row < mergedCol.length; row++) {
            if (mergedCol[row] != null) {
              newGrid[size - 1 - row][col] = mergedCol[row]!.copyWith(
                row: size - 1 - row,
                col: col,
              );
            }
          }
        }
        break;
    }

    moved = !_gridsAreEqual(grid, newGrid);
    if (moved) {
      grid.clear();
      grid.addAll(newGrid);
      addRandomTile();
      _checkGameStatus();
    }

    return moved;
  }

  List<Tile?> _mergeTiles(List<Tile?> tiles) {
    List<Tile?> merged = List.filled(size, null);
    int index = 0;
    int? lastValue;
    int lastIndex = -1;

    for (Tile? tile in tiles) {
      if (tile == null) continue;

      if (lastValue == tile.value) {
        merged[lastIndex] = Tile(
          value: lastValue! * 2,
          row: tile.row,
          col: tile.col,
          isMerged: true,
        );
        score += lastValue * 2;
        if (lastValue * 2 == winningValue) {
          won = true;
        }
        lastValue = null;
      } else {
        lastValue = tile.value;
        lastIndex = index;
        merged[index] = tile;
        index++;
      }
    }

    return merged;
  }

  bool _gridsAreEqual(List<List<Tile?>> grid1, List<List<Tile?>> grid2) {
    for (int i = 0; i < size; i++) {
      for (int j = 0; j < size; j++) {
        if ((grid1[i][j] == null) != (grid2[i][j] == null)) return false;
        if (grid1[i][j] != null && grid2[i][j] != null) {
          if (grid1[i][j]!.value != grid2[i][j]!.value) return false;
        }
      }
    }
    return true;
  }

  void _checkGameStatus() {
    if (won) return;

    bool canMove = false;
    for (int i = 0; i < size; i++) {
      for (int j = 0; j < size; j++) {
        if (grid[i][j] == null) {
          canMove = true;
          break;
        }
        if (i < size - 1 && grid[i][j]?.value == grid[i + 1][j]?.value) {
          canMove = true;
          break;
        }
        if (j < size - 1 && grid[i][j]?.value == grid[i][j + 1]?.value) {
          canMove = true;
          break;
        }
      }
      if (canMove) break;
    }
    gameOver = !canMove;
  }

  void reset() {
    grid.clear();
    grid.addAll(List.generate(
      size,
      (i) => List.generate(size, (j) => null),
    ));
    score = 0;
    gameOver = false;
    won = false;
    addRandomTile();
    addRandomTile();
  }
}
