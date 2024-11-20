import kotlinx.browser.document
import kotlinx.browser.window
import org.w3c.dom.*
import org.w3c.dom.events.Event
import org.w3c.dom.events.KeyboardEvent
import kotlin.js.Date
import kotlin.math.min
import kotlin.random.Random

class Game {
    private val canvas: HTMLCanvasElement = document.getElementById("game-canvas") as HTMLCanvasElement
    private val ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D
    private var tiles = mutableListOf<Tile>()
    private var score = 0
    private var gameOver = false
    private var startX: Double = 0.0
    private var startY: Double = 0.0
    private var animating = false
    private var animations = mutableListOf<Animation>()
    private var tileSize = 0.0
    private var padding = 0.0

    init {
        handleResize()
        initGame()

        window.addEventListener("keydown", { event -> handleKeyDown(event as KeyboardEvent) })
        window.addEventListener("resize", { handleResize() })
        canvas.addEventListener("touchstart", { event -> handleTouchStart(event) })
        canvas.addEventListener("touchend", { event -> handleTouchEnd(event) })
        document.getElementById("new-game-button")?.addEventListener("click", { initGame() })

        window.requestAnimationFrame { animate() }
    }

    private fun handleResize() {
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
        tileSize = min(canvas.width, canvas.height) / 4.0
        padding = tileSize * 0.1
        render()
    }

    private fun initGame() {
        tiles.clear()
        score = 0
        gameOver = false
        document.getElementById("score")?.textContent = "0"
        animations.clear()

        document.querySelector(".game-over")?.let { gameOver ->
            gameOver.parentElement?.removeChild(gameOver)
        }

        addRandomTile()
        addRandomTile()
        render()
    }

    private fun addRandomTile() {
        val emptyCells = mutableListOf<Pair<Int, Int>>()
        for (row in 0..3) {
            for (col in 0..3) {
                if (tiles.none { it.row == row && it.col == col }) {
                    emptyCells.add(row to col)
                }
            }
        }

        if (emptyCells.isNotEmpty()) {
            val (row, col) = emptyCells.random()
            val value = if (Random.nextDouble() < 0.9) 2 else 4
            val tile = Tile(value, row, col)
            tiles.add(tile)
            animations.add(Animation(tile, "scale", 0.0, 1.0, 200.0, Date.now()))
        }
    }

    private fun getTileColor(value: Int): String = when (value) {
        2 -> "#eee4da"
        4 -> "#ede0c8"
        8 -> "#f2b179"
        16 -> "#f59563"
        32 -> "#f67c5f"
        64 -> "#f65e3b"
        128 -> "#edcf72"
        256 -> "#edcc61"
        512 -> "#edc850"
        1024 -> "#edc53f"
        2048 -> "#edc22e"
        else -> "#cdc1b4"
    }

    private fun getTileTextColor(value: Int): String =
        if (value <= 4) "#776e65" else "#f9f6f2"

    private fun move(direction: Direction) {
        if (gameOver || animating) return

        val delta = when (direction) {
            Direction.UP -> -1 to 0
            Direction.DOWN -> 1 to 0
            Direction.LEFT -> 0 to -1
            Direction.RIGHT -> 0 to 1
        }

        var moved = false
        val tilesToRemove = mutableListOf<Tile>()
        animations.clear()

        val sortedTiles = tiles.sortedWith(compareBy { tile ->
            when (direction) {
                Direction.DOWN -> -tile.row
                Direction.UP -> tile.row
                Direction.RIGHT -> -tile.col
                Direction.LEFT -> tile.col
            }
        })

        for (tile in sortedTiles) {
            var newRow = tile.row
            var newCol = tile.col

            while (true) {
                val nextRow = newRow + delta.first
                val nextCol = newCol + delta.second

                if (nextRow !in 0..3 || nextCol !in 0..3) break

                val nextTile = tiles.find { it.row == nextRow && it.col == nextCol && it !in tilesToRemove }
                if (nextTile == null) {
                    newRow = nextRow
                    newCol = nextCol
                    moved = true
                } else if (nextTile.value == tile.value && !tile.merging && !nextTile.merging) {
                    newRow = nextRow
                    newCol = nextCol
                    tile.value *= 2
                    tile.merging = true
                    score += tile.value
                    tilesToRemove.add(nextTile)
                    moved = true
                    break
                } else {
                    break
                }
            }

            if (newRow != tile.row || newCol != tile.col) {
                animations.add(Animation(tile, "row", tile.row.toDouble(), newRow.toDouble(), 150.0, Date.now()))
                animations.add(Animation(tile, "col", tile.col.toDouble(), newCol.toDouble(), 150.0, Date.now()))
                if (tile.merging) {
                    animations.add(Animation(tile, "scale", 1.0, 1.2, 100.0, Date.now()))
                    animations.add(Animation(tile, "scale", 1.2, 1.0, 100.0, Date.now() + 100))
                }
                tile.row = newRow
                tile.col = newCol
            }
        }

        if (moved) {
            animating = true
            document.getElementById("score")?.textContent = score.toString()

            window.setTimeout({
                tiles.removeAll(tilesToRemove)
                tiles.forEach { it.merging = false }
                addRandomTile()
                animating = false
                checkGameOver()
            }, 150)
        }
    }

    private fun checkGameOver() {
        if (tiles.size < 16) return

        for (row in 0..3) {
            for (col in 0..3) {
                val tile = tiles.find { it.row == row && it.col == col } ?: continue
                val value = tile.value

                // Check adjacent cells
                val adjacentTiles = listOfNotNull(
                    if (row > 0) tiles.find { it.row == row - 1 && it.col == col } else null,
                    if (row < 3) tiles.find { it.row == row + 1 && it.col == col } else null,
                    if (col > 0) tiles.find { it.row == row && it.col == col - 1 } else null,
                    if (col < 3) tiles.find { it.row == row && it.col == col + 1 } else null
                )

                if (adjacentTiles.any { it.value == value }) return
            }
        }

        gameOver = true
        showGameOver()
    }

    private fun showGameOver() {
        val gameOverDiv = document.createElement("div") as HTMLDivElement
        gameOverDiv.className = "game-over"
        gameOverDiv.innerHTML = """
            <h2>Game Over!</h2>
            <button id="new-game-button">Try Again</button>
        """.trimIndent()
        document.querySelector(".game-container")?.appendChild(gameOverDiv)
        gameOverDiv.querySelector("button")?.addEventListener("click", { initGame() })
    }

    private fun handleKeyDown(event: KeyboardEvent) {
        when (event.key) {
            "ArrowUp" -> {
                event.preventDefault()
                move(Direction.UP)
            }
            "ArrowDown" -> {
                event.preventDefault()
                move(Direction.DOWN)
            }
            "ArrowLeft" -> {
                event.preventDefault()
                move(Direction.LEFT)
            }
            "ArrowRight" -> {
                event.preventDefault()
                move(Direction.RIGHT)
            }
        }
    }

    private fun handleTouchStart(event: Event) {
        val touchEvent = event.asDynamic()
        startX = touchEvent.touches[0].clientX as Double
        startY = touchEvent.touches[0].clientY as Double
    }

    private fun handleTouchEnd(event: Event) {
        val touchEvent = event.asDynamic()
        val deltaX = (touchEvent.changedTouches[0].clientX as Double) - startX
        val deltaY = (touchEvent.changedTouches[0].clientY as Double) - startY
        val minSwipeDistance = 50

        if (kotlin.math.abs(deltaX) > kotlin.math.abs(deltaY)) {
            if (kotlin.math.abs(deltaX) > minSwipeDistance) {
                move(if (deltaX > 0) Direction.RIGHT else Direction.LEFT)
            }
        } else {
            if (kotlin.math.abs(deltaY) > minSwipeDistance) {
                move(if (deltaY > 0) Direction.DOWN else Direction.UP)
            }
        }
    }

    private fun animate(timestamp: Double = 0.0) {
        render()
        window.requestAnimationFrame { animate(it) }
    }

    private fun render() {
        val now = Date.now()
        ctx.clearRect(0.0, 0.0, canvas.width.toDouble(), canvas.height.toDouble())

        // Draw grid
        ctx.fillStyle = "#cdc1b4"
        for (row in 0..3) {
            for (col in 0..3) {
                val x = col * tileSize + padding
                val y = row * tileSize + padding
                val size = tileSize - padding * 2
                ctx.fillRect(x, y, size, size)
            }
        }

        // Update animations
        animations.removeAll { updateAnimation(it, now) }

        // Draw tiles
        for (tile in tiles) {
            val scale = tile.scale
            val x = tile.col * tileSize + padding
            val y = tile.row * tileSize + padding
            val size = (tileSize - padding * 2) * scale
            val offsetX = (tileSize - size) / 2
            val offsetY = (tileSize - size) / 2

            // Draw tile background
            ctx.fillStyle = getTileColor(tile.value)
            ctx.fillRect(x + offsetX, y + offsetY, size, size)

            // Draw tile text
            ctx.fillStyle = getTileTextColor(tile.value)
            ctx.font = "bold ${size * 0.4}px Arial"
            ctx.textAlign = CanvasTextAlign.CENTER
            ctx.textBaseline = CanvasTextBaseline.MIDDLE
            ctx.fillText(
                tile.value.toString(),
                x + offsetX + size / 2,
                y + offsetY + size / 2
            )
        }
    }

    private fun updateAnimation(animation: Animation, now: Double): Boolean {
        val elapsed = now - animation.startTime
        if (elapsed >= animation.duration) {
            when (animation.property) {
                "row" -> animation.tile.row = animation.end.toInt()
                "col" -> animation.tile.col = animation.end.toInt()
                "scale" -> animation.tile.scale = animation.end
            }
            return true
        }
        val progress = elapsed / animation.duration
        val value = animation.start + (animation.end - animation.start) * progress
        when (animation.property) {
            "row" -> animation.tile.row = value.toInt()
            "col" -> animation.tile.col = value.toInt()
            "scale" -> animation.tile.scale = value
        }
        return false
    }

    private enum class Direction {
        UP, DOWN, LEFT, RIGHT
    }

    private data class Tile(
        var value: Int,
        var row: Int,
        var col: Int,
        var scale: Double = 1.0,
        var merging: Boolean = false
    )

    private data class Animation(
        val tile: Tile,
        val property: String,
        val start: Double,
        val end: Double,
        val duration: Double,
        val startTime: Double
    )
}

fun main() {
    Game()
}
