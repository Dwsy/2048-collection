from js import document, window, requestAnimationFrame, performance
import random
import math
from pyodide.ffi import create_proxy

class Game:
    def __init__(self):
        self.canvas = document.getElementById('game-canvas')
        self.ctx = self.canvas.getContext('2d')
        self.tiles = []
        self.score = 0
        self.game_over = False
        self.touch_start = None
        self.animating = False
        self.animations = []

        # Create proxies for event handlers
        self.handle_key_down_proxy = create_proxy(self.handle_key_down)
        self.handle_resize_proxy = create_proxy(self.handle_resize)
        self.handle_touch_start_proxy = create_proxy(self.handle_touch_start)
        self.handle_touch_end_proxy = create_proxy(self.handle_touch_end)
        self.init_game_proxy = create_proxy(self.init_game)
        self.animate_proxy = create_proxy(self.animate)

        # Set canvas size
        self.handle_resize()

        # Initialize game
        self.init_game()

        # Event listeners
        window.addEventListener('keydown', self.handle_key_down_proxy)
        window.addEventListener('resize', self.handle_resize_proxy)
        self.canvas.addEventListener('touchstart', self.handle_touch_start_proxy)
        self.canvas.addEventListener('touchend', self.handle_touch_end_proxy)
        document.getElementById('new-game-button').addEventListener('click', self.init_game_proxy)

        # Start animation loop
        requestAnimationFrame(self.animate_proxy)

    def handle_resize(self, event=None):
        width = self.canvas.clientWidth
        height = self.canvas.clientHeight
        
        self.canvas.width = width
        self.canvas.height = height
        self.tile_size = min(width, height) / 4
        self.padding = self.tile_size * 0.1

        self.render()

    def init_game(self):
        self.tiles = []
        self.score = 0
        self.game_over = False
        document.getElementById('score').textContent = '0'
        self.animations = []

        # Remove game over screen if exists
        game_over = document.querySelector('.game-over')
        if game_over:
            game_over.parentElement.removeChild(game_over)

        # Add initial tiles
        self.add_random_tile()
        self.add_random_tile()
        self.render()

    def add_random_tile(self):
        empty_cells = []
        for row in range(4):
            for col in range(4):
                if not any(tile['row'] == row and tile['col'] == col for tile in self.tiles):
                    empty_cells.append({'row': row, 'col': col})

        if empty_cells:
            cell = random.choice(empty_cells)
            value = 2 if random.random() < 0.9 else 4
            tile = {
                'value': value,
                'row': cell['row'],
                'col': cell['col'],
                'scale': 0,
                'merging': False
            }
            self.tiles.append(tile)
            self.animations.append({
                'tile': tile,
                'property': 'scale',
                'start': 0,
                'end': 1,
                'duration': 200,
                'start_time': performance.now()
            })

    def get_tile_color(self, value):
        colors = {
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
        }
        return colors.get(value, '#cdc1b4')

    def get_tile_text_color(self, value):
        return '#776e65' if value <= 4 else '#f9f6f2'

    def move(self, direction):
        if self.game_over or self.animating:
            return

        direction_map = {
            'up': {'row_delta': -1, 'col_delta': 0},
            'down': {'row_delta': 1, 'col_delta': 0},
            'left': {'row_delta': 0, 'col_delta': -1},
            'right': {'row_delta': 0, 'col_delta': 1}
        }

        delta = direction_map[direction]
        moved = False
        tiles_to_remove = []
        self.animations = []

        # Sort tiles based on direction
        sorted_tiles = sorted(self.tiles, key=lambda t: (
            -t['row'] if direction == 'down' else t['row'] if direction == 'up' else
            -t['col'] if direction == 'right' else t['col']
        ))

        # Move tiles
        for tile in sorted_tiles:
            row, col = tile['row'], tile['col']
            new_row, new_col = row, col

            while True:
                next_row = new_row + delta['row_delta']
                next_col = new_col + delta['col_delta']

                if next_row < 0 or next_row > 3 or next_col < 0 or next_col > 3:
                    break

                next_tile = next((t for t in self.tiles if t['row'] == next_row and t['col'] == next_col and t not in tiles_to_remove), None)
                if not next_tile:
                    new_row = next_row
                    new_col = next_col
                    moved = True
                elif next_tile['value'] == tile['value'] and not tile['merging'] and not next_tile['merging']:
                    new_row = next_row
                    new_col = next_col
                    tile['value'] *= 2
                    tile['merging'] = True
                    self.score += tile['value']
                    tiles_to_remove.append(next_tile)
                    moved = True
                    break
                else:
                    break

            if new_row != row or new_col != col:
                self.animations.extend([
                    {
                        'tile': tile,
                        'property': 'row',
                        'start': row,
                        'end': new_row,
                        'duration': 150,
                        'start_time': performance.now()
                    },
                    {
                        'tile': tile,
                        'property': 'col',
                        'start': col,
                        'end': new_col,
                        'duration': 150,
                        'start_time': performance.now()
                    }
                ])
                if tile['merging']:
                    self.animations.extend([
                        {
                            'tile': tile,
                            'property': 'scale',
                            'start': 1,
                            'end': 1.2,
                            'duration': 100,
                            'start_time': performance.now()
                        },
                        {
                            'tile': tile,
                            'property': 'scale',
                            'start': 1.2,
                            'end': 1,
                            'duration': 100,
                            'start_time': performance.now() + 100
                        }
                    ])
                tile['row'] = new_row
                tile['col'] = new_col

        if moved:
            self.animating = True
            document.getElementById('score').textContent = str(self.score)

            def after_move():
                self.tiles = [t for t in self.tiles if t not in tiles_to_remove]
                for tile in self.tiles:
                    tile['merging'] = False
                self.add_random_tile()
                self.animating = False
                self.check_game_over()

            window.setTimeout(create_proxy(after_move), 150)

    def check_game_over(self):
        if len(self.tiles) < 16:
            return

        for row in range(4):
            for col in range(4):
                tile = next((t for t in self.tiles if t['row'] == row and t['col'] == col), None)
                if tile:
                    value = tile['value']
                    # Check adjacent cells
                    adjacent_tiles = [
                        next((t for t in self.tiles if t['row'] == row - 1 and t['col'] == col), None) if row > 0 else None,
                        next((t for t in self.tiles if t['row'] == row + 1 and t['col'] == col), None) if row < 3 else None,
                        next((t for t in self.tiles if t['row'] == row and t['col'] == col - 1), None) if col > 0 else None,
                        next((t for t in self.tiles if t['row'] == row and t['col'] == col + 1), None) if col < 3 else None
                    ]
                    
                    for adj_tile in adjacent_tiles:
                        if adj_tile is not None and adj_tile.get('value') == value:
                            return

        self.game_over = True
        self.show_game_over()

    def show_game_over(self):
        game_over = document.createElement('div')
        game_over.className = 'game-over'
        game_over.innerHTML = '''
            <h2>Game Over!</h2>
            <button id="new-game-button">Try Again</button>
        '''
        document.querySelector('.game-container').appendChild(game_over)
        game_over.querySelector('button').addEventListener('click', create_proxy(self.init_game))

    def handle_key_down(self, event):
        key_map = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        }
        if event.key in key_map:
            event.preventDefault()
            self.move(key_map[event.key])

    def handle_touch_start(self, event):
        touch = event.touches[0]
        self.touch_start = {'x': touch.clientX, 'y': touch.clientY}

    def handle_touch_end(self, event):
        if not self.touch_start:
            return

        touch = event.changedTouches[0]
        delta_x = touch.clientX - self.touch_start['x']
        delta_y = touch.clientY - self.touch_start['y']
        min_swipe_distance = 50

        if abs(delta_x) > abs(delta_y):
            if abs(delta_x) > min_swipe_distance:
                self.move('right' if delta_x > 0 else 'left')
        else:
            if abs(delta_y) > min_swipe_distance:
                self.move('down' if delta_y > 0 else 'up')

        self.touch_start = None

    def animate(self, timestamp=None):
        self.render()
        requestAnimationFrame(self.animate_proxy)

    def render(self):
        now = performance.now()
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height)

        # Draw grid
        self.ctx.fillStyle = '#cdc1b4'
        for row in range(4):
            for col in range(4):
                x = col * self.tile_size + self.padding
                y = row * self.tile_size + self.padding
                size = self.tile_size - self.padding * 2
                self.ctx.fillRect(x, y, size, size)

        # Update animations
        self.animations = [anim for anim in self.animations if self.update_animation(anim, now)]

        # Draw tiles
        for tile in self.tiles:
            scale = tile.get('scale', 1)
            x = tile['col'] * self.tile_size + self.padding
            y = tile['row'] * self.tile_size + self.padding
            size = (self.tile_size - self.padding * 2) * scale
            offset_x = (self.tile_size - size) / 2
            offset_y = (self.tile_size - size) / 2

            # Draw tile background
            self.ctx.fillStyle = self.get_tile_color(tile['value'])
            self.ctx.fillRect(x + offset_x, y + offset_y, size, size)

            # Draw tile text
            self.ctx.fillStyle = self.get_tile_text_color(tile['value'])
            self.ctx.font = f'bold {size * 0.4}px Arial'
            self.ctx.textAlign = 'center'
            self.ctx.textBaseline = 'middle'
            self.ctx.fillText(
                str(tile['value']),
                x + offset_x + size / 2,
                y + offset_y + size / 2
            )

    def update_animation(self, animation, now):
        elapsed = now - animation['start_time']
        if elapsed >= animation['duration']:
            animation['tile'][animation['property']] = animation['end']
            return False
        progress = elapsed / animation['duration']
        animation['tile'][animation['property']] = animation['start'] + (animation['end'] - animation['start']) * progress
        return True

# Initialize game
game = Game()