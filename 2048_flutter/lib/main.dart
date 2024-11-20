import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'models/game.dart';
import 'models/tile.dart';
import 'widgets/tile_widget.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '2048',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.orange),
        useMaterial3: true,
      ),
      home: const GamePage(),
    );
  }
}

class GamePage extends StatefulWidget {
  const GamePage({super.key});

  @override
  State<GamePage> createState() => _GamePageState();
}

class _GamePageState extends State<GamePage> {
  late Game game;
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    game = Game();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  void _handleKeyEvent(RawKeyEvent event) {
    if (event is RawKeyDownEvent) {
      Direction? direction;
      switch (event.logicalKey) {
        case LogicalKeyboardKey.arrowUp:
        case LogicalKeyboardKey.keyW:
          direction = Direction.up;
          break;
        case LogicalKeyboardKey.arrowDown:
        case LogicalKeyboardKey.keyS:
          direction = Direction.down;
          break;
        case LogicalKeyboardKey.arrowLeft:
        case LogicalKeyboardKey.keyA:
          direction = Direction.left;
          break;
        case LogicalKeyboardKey.arrowRight:
        case LogicalKeyboardKey.keyD:
          direction = Direction.right;
          break;
        case LogicalKeyboardKey.space:
        case LogicalKeyboardKey.enter:
          if (game.gameOver || game.won) {
            setState(() {
              game.reset();
            });
          }
          return;
        default:
          return;
      }
      
      if (direction != null && game.move(direction)) {
        setState(() {});
      }
    }
  }

  void _handleGesture(DragEndDetails details) {
    if (details.primaryVelocity == 0.0) return;
    if (details.velocity.pixelsPerSecond.dx.abs() >
        details.velocity.pixelsPerSecond.dy.abs()) {
      if (details.velocity.pixelsPerSecond.dx > 0) {
        if (game.move(Direction.right)) setState(() {});
      } else {
        if (game.move(Direction.left)) setState(() {});
      }
    } else {
      if (details.velocity.pixelsPerSecond.dy > 0) {
        if (game.move(Direction.down)) setState(() {});
      } else {
        if (game.move(Direction.up)) setState(() {});
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final gameSize = screenWidth > 500 ? 400.0 : screenWidth - 32;
    final tileSize = (gameSize - 16) / 4;

    return Scaffold(
      backgroundColor: const Color(0xFFFAF8EF),
      appBar: AppBar(
        title: const Text('2048'),
        backgroundColor: const Color(0xFFBBADA0),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Score: ${game.score}',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        game.reset();
                      });
                    },
                    child: const Text('New Game'),
                  ),
                ],
              ),
            ),
            RawKeyboardListener(
              focusNode: _focusNode,
              onKey: _handleKeyEvent,
              autofocus: true,
              child: GestureDetector(
                onTapDown: (_) => _focusNode.requestFocus(),
                behavior: HitTestBehavior.opaque,
                onPanEnd: _handleGesture,
                child: Container(
                  width: gameSize,
                  height: gameSize,
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFBBADA0),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Stack(
                    children: [
                      // Background grid
                      ...List.generate(16, (index) {
                        final row = index ~/ 4;
                        final col = index % 4;
                        return Positioned(
                          top: row * (tileSize + 4),
                          left: col * (tileSize + 4),
                          child: Container(
                            width: tileSize,
                            height: tileSize,
                            decoration: BoxDecoration(
                              color: const Color(0xFFCDC1B4),
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        );
                      }),
                      // Tiles
                      ...game.grid.asMap().entries.expand((row) {
                        return row.value.asMap().entries.map((col) {
                          final tile = col.value;
                          if (tile == null) return const SizedBox();
                          return Positioned(
                            top: tile.row * (tileSize + 4),
                            left: tile.col * (tileSize + 4),
                            child: TileWidget(
                              tile: tile,
                              size: tileSize,
                            ),
                          );
                        });
                      }),
                    ],
                  ),
                ),
              ),
            ),
            if (game.gameOver || game.won)
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  game.won ? 'You Won!' : 'Game Over!',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Text(
                    'Controls:',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey[800],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Arrow keys or WASD to move tiles\n'
                    'Space/Enter to restart when game is over\n'
                    'Swipe to move on touch devices',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[700],
                      height: 1.5,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }
}
