(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define(['exports', './kotlin-kotlin-stdlib-js-ir.js'], factory);
  else if (typeof exports === 'object')
    factory(module.exports, require('./kotlin-kotlin-stdlib-js-ir.js'));
  else {
    if (typeof this['kotlin-kotlin-stdlib-js-ir'] === 'undefined') {
      throw new Error("Error loading module '2048-kotlin'. Its dependency 'kotlin-kotlin-stdlib-js-ir' was not found. Please, check whether 'kotlin-kotlin-stdlib-js-ir' is loaded prior to '2048-kotlin'.");
    }
    root['2048-kotlin'] = factory(typeof this['2048-kotlin'] === 'undefined' ? {} : this['2048-kotlin'], this['kotlin-kotlin-stdlib-js-ir']);
  }
}(this, function (_, kotlin_kotlin) {
  'use strict';
  //region block: imports
  var imul = Math.imul;
  var Unit_getInstance = kotlin_kotlin.$_$.c;
  var ArrayList_init_$Create$ = kotlin_kotlin.$_$.a;
  var Collection = kotlin_kotlin.$_$.d;
  var isInterface = kotlin_kotlin.$_$.l;
  var to = kotlin_kotlin.$_$.s;
  var Default_getInstance = kotlin_kotlin.$_$.b;
  var random = kotlin_kotlin.$_$.f;
  var noWhenBranchMatchedException = kotlin_kotlin.$_$.r;
  var sortedWith = kotlin_kotlin.$_$.h;
  var listOfNotNull = kotlin_kotlin.$_$.e;
  var THROW_CCE = kotlin_kotlin.$_$.q;
  var VOID = kotlin_kotlin.$_$.t;
  var removeAll = kotlin_kotlin.$_$.g;
  var numberToInt = kotlin_kotlin.$_$.m;
  var Enum = kotlin_kotlin.$_$.p;
  var protoOf = kotlin_kotlin.$_$.n;
  var classMeta = kotlin_kotlin.$_$.j;
  var setMetadataFor = kotlin_kotlin.$_$.o;
  var equals = kotlin_kotlin.$_$.k;
  var compareValues = kotlin_kotlin.$_$.i;
  //endregion
  //region block: pre-declaration
  setMetadataFor(Direction, 'Direction', classMeta, Enum);
  setMetadataFor(Tile, 'Tile', classMeta);
  setMetadataFor(Animation, 'Animation', classMeta);
  setMetadataFor(sam$kotlin_Comparator$0, 'sam$kotlin_Comparator$0', classMeta);
  setMetadataFor(Game, 'Game', classMeta);
  //endregion
  var Direction_UP_instance;
  var Direction_DOWN_instance;
  var Direction_LEFT_instance;
  var Direction_RIGHT_instance;
  var Direction_entriesInitialized;
  function Direction_initEntries() {
    if (Direction_entriesInitialized)
      return Unit_getInstance();
    Direction_entriesInitialized = true;
    Direction_UP_instance = new Direction('UP', 0);
    Direction_DOWN_instance = new Direction('DOWN', 1);
    Direction_LEFT_instance = new Direction('LEFT', 2);
    Direction_RIGHT_instance = new Direction('RIGHT', 3);
  }
  function handleResize($this) {
    $this.u3_1.width = $this.u3_1.clientWidth;
    $this.u3_1.height = $this.u3_1.clientHeight;
    var tmp = $this;
    var tmp$ret$0;
    // Inline function 'kotlin.math.min' call
    var tmp0_min = $this.u3_1.width;
    var tmp1_min = $this.u3_1.height;
    tmp$ret$0 = Math.min(tmp0_min, tmp1_min);
    tmp.d4_1 = tmp$ret$0 / 4.0;
    $this.e4_1 = $this.d4_1 * 0.1;
    render($this);
  }
  function initGame($this) {
    $this.w3_1.c2();
    $this.x3_1 = 0;
    $this.y3_1 = false;
    var tmp0_safe_receiver = document.getElementById('score');
    if (tmp0_safe_receiver == null) {
    } else {
      tmp0_safe_receiver.textContent = '0';
    }
    $this.c4_1.c2();
    var tmp1_safe_receiver = document.querySelector('.game-over');
    if (tmp1_safe_receiver == null)
      null;
    else {
      var tmp$ret$1;
      // Inline function 'kotlin.let' call
      // Inline function 'kotlin.contracts.contract' call
      var tmp$ret$0;
      // Inline function 'Game.initGame.<anonymous>' call
      var tmp0_safe_receiver_0 = tmp1_safe_receiver.parentElement;
      tmp$ret$0 = tmp0_safe_receiver_0 == null ? null : tmp0_safe_receiver_0.removeChild(tmp1_safe_receiver);
      tmp$ret$1 = tmp$ret$0;
    }
    addRandomTile($this);
    addRandomTile($this);
    render($this);
  }
  function addRandomTile($this) {
    var tmp$ret$0;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp$ret$0 = ArrayList_init_$Create$();
    var emptyCells = tmp$ret$0;
    var inductionVariable = 0;
    if (inductionVariable <= 3)
      do {
        var row = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var inductionVariable_0 = 0;
        if (inductionVariable_0 <= 3)
          do {
            var col = inductionVariable_0;
            inductionVariable_0 = inductionVariable_0 + 1 | 0;
            var tmp$ret$1;
            $l$block_0: {
              // Inline function 'kotlin.collections.none' call
              var tmp0_none = $this.w3_1;
              var tmp;
              if (isInterface(tmp0_none, Collection)) {
                tmp = tmp0_none.g();
              } else {
                tmp = false;
              }
              if (tmp) {
                tmp$ret$1 = true;
                break $l$block_0;
              }
              var tmp0_iterator = tmp0_none.c();
              while (tmp0_iterator.d()) {
                var element = tmp0_iterator.e();
                var tmp$ret$2;
                // Inline function 'Game.addRandomTile.<anonymous>' call
                tmp$ret$2 = element.g4_1 === row ? element.h4_1 === col : false;
                if (tmp$ret$2) {
                  tmp$ret$1 = false;
                  break $l$block_0;
                }
              }
              tmp$ret$1 = true;
            }
            if (tmp$ret$1) {
              emptyCells.a(to(row, col));
            }
          }
           while (inductionVariable_0 <= 3);
      }
       while (inductionVariable <= 3);
    var tmp$ret$3;
    // Inline function 'kotlin.collections.isNotEmpty' call
    tmp$ret$3 = !emptyCells.g();
    if (tmp$ret$3) {
      var tmp$ret$4;
      // Inline function 'kotlin.collections.random' call
      tmp$ret$4 = random(emptyCells, Default_getInstance());
      var tmp2_container = tmp$ret$4;
      var row_0 = tmp2_container.l1();
      var col_0 = tmp2_container.m1();
      var value = Default_getInstance().z() < 0.9 ? 2 : 4;
      var tile = new Tile(value, row_0, col_0);
      $this.w3_1.a(tile);
      $this.c4_1.a(new Animation(tile, 'scale', 0.0, 1.0, 200.0, Date.now()));
    }
  }
  function getTileColor($this, value) {
    var tmp0_subject = value;
    switch (tmp0_subject) {
      case 2:
        return '#eee4da';
      case 4:
        return '#ede0c8';
      case 8:
        return '#f2b179';
      case 16:
        return '#f59563';
      case 32:
        return '#f67c5f';
      case 64:
        return '#f65e3b';
      case 128:
        return '#edcf72';
      case 256:
        return '#edcc61';
      case 512:
        return '#edc850';
      case 1024:
        return '#edc53f';
      case 2048:
        return '#edc22e';
      default:
        return '#cdc1b4';
    }
  }
  function getTileTextColor($this, value) {
    return value <= 4 ? '#776e65' : '#f9f6f2';
  }
  function move($this, direction) {
    if ($this.y3_1 ? true : $this.b4_1)
      return Unit_getInstance();
    var tmp0_subject = direction;
    var tmp0 = tmp0_subject.y2_1;
    var tmp;
    switch (tmp0) {
      case 0:
        tmp = to(-1, 0);
        break;
      case 1:
        tmp = to(1, 0);
        break;
      case 2:
        tmp = to(0, -1);
        break;
      case 3:
        tmp = to(0, 1);
        break;
      default:
        noWhenBranchMatchedException();
        break;
    }
    var delta = tmp;
    var moved = false;
    var tmp$ret$0;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp$ret$0 = ArrayList_init_$Create$();
    var tilesToRemove = tmp$ret$0;
    $this.c4_1.c2();
    var tmp_0 = $this.w3_1;
    var tmp$ret$1;
    // Inline function 'kotlin.comparisons.compareBy' call
    var tmp_1 = Game$move$lambda(direction);
    tmp$ret$1 = new sam$kotlin_Comparator$0(tmp_1);
    var sortedTiles = sortedWith(tmp_0, tmp$ret$1);
    var tmp1_iterator = sortedTiles.c();
    while (tmp1_iterator.d()) {
      var tile = tmp1_iterator.e();
      var newRow = tile.g4_1;
      var newCol = tile.h4_1;
      $l$loop_1: while (true) {
        var nextRow = newRow + delta.j1_1 | 0;
        var nextCol = newCol + delta.k1_1 | 0;
        if (!(0 <= nextRow ? nextRow <= 3 : false) ? true : !(0 <= nextCol ? nextCol <= 3 : false))
          break $l$loop_1;
        var tmp$ret$4;
        // Inline function 'kotlin.collections.find' call
        var tmp0_find = $this.w3_1;
        var tmp$ret$3;
        $l$block: {
          // Inline function 'kotlin.collections.firstOrNull' call
          var tmp0_iterator = tmp0_find.c();
          while (tmp0_iterator.d()) {
            var element = tmp0_iterator.e();
            var tmp$ret$2;
            // Inline function 'Game.move.<anonymous>' call
            tmp$ret$2 = (element.g4_1 === nextRow ? element.h4_1 === nextCol : false) ? !tilesToRemove.j(element) : false;
            if (tmp$ret$2) {
              tmp$ret$3 = element;
              break $l$block;
            }
          }
          tmp$ret$3 = null;
        }
        tmp$ret$4 = tmp$ret$3;
        var nextTile = tmp$ret$4;
        if (nextTile == null) {
          newRow = nextRow;
          newCol = nextCol;
          moved = true;
        } else if ((nextTile.f4_1 === tile.f4_1 ? !tile.j4_1 : false) ? !nextTile.j4_1 : false) {
          newRow = nextRow;
          newCol = nextCol;
          var tmp2_this = tile;
          tmp2_this.f4_1 = imul(tmp2_this.f4_1, 2);
          tile.j4_1 = true;
          var tmp3_this = $this;
          tmp3_this.x3_1 = tmp3_this.x3_1 + tile.f4_1 | 0;
          tilesToRemove.a(nextTile);
          moved = true;
          break $l$loop_1;
        } else {
          break $l$loop_1;
        }
      }
      if (!(newRow === tile.g4_1) ? true : !(newCol === tile.h4_1)) {
        $this.c4_1.a(new Animation(tile, 'row', tile.g4_1, newRow, 150.0, Date.now()));
        $this.c4_1.a(new Animation(tile, 'col', tile.h4_1, newCol, 150.0, Date.now()));
        if (tile.j4_1) {
          $this.c4_1.a(new Animation(tile, 'scale', 1.0, 1.2, 100.0, Date.now()));
          $this.c4_1.a(new Animation(tile, 'scale', 1.2, 1.0, 100.0, Date.now() + 100));
        }
        tile.g4_1 = newRow;
        tile.h4_1 = newCol;
      }
    }
    if (moved) {
      $this.b4_1 = true;
      var tmp4_safe_receiver = document.getElementById('score');
      if (tmp4_safe_receiver == null) {
      } else {
        tmp4_safe_receiver.textContent = $this.x3_1.toString();
      }
      var tmp_2 = window;
      tmp_2.setTimeout(Game$move$lambda_0($this, tilesToRemove), 150);
    }
  }
  function checkGameOver($this) {
    if ($this.w3_1.f() < 16)
      return Unit_getInstance();
    var inductionVariable = 0;
    if (inductionVariable <= 3)
      do {
        var row = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var inductionVariable_0 = 0;
        if (inductionVariable_0 <= 3)
          $l$loop: do {
            var col = inductionVariable_0;
            inductionVariable_0 = inductionVariable_0 + 1 | 0;
            var tmp$ret$2;
            // Inline function 'kotlin.collections.find' call
            var tmp0_find = $this.w3_1;
            var tmp$ret$1;
            $l$block: {
              // Inline function 'kotlin.collections.firstOrNull' call
              var tmp0_iterator = tmp0_find.c();
              while (tmp0_iterator.d()) {
                var element = tmp0_iterator.e();
                var tmp$ret$0;
                // Inline function 'Game.checkGameOver.<anonymous>' call
                tmp$ret$0 = element.g4_1 === row ? element.h4_1 === col : false;
                if (tmp$ret$0) {
                  tmp$ret$1 = element;
                  break $l$block;
                }
              }
              tmp$ret$1 = null;
            }
            tmp$ret$2 = tmp$ret$1;
            var tmp2_elvis_lhs = tmp$ret$2;
            var tmp;
            if (tmp2_elvis_lhs == null) {
              continue $l$loop;
            } else {
              tmp = tmp2_elvis_lhs;
            }
            var tile = tmp;
            var value = tile.f4_1;
            var tmp_0;
            if (row > 0) {
              var tmp$ret$5;
              // Inline function 'kotlin.collections.find' call
              var tmp1_find = $this.w3_1;
              var tmp$ret$4;
              $l$block_0: {
                // Inline function 'kotlin.collections.firstOrNull' call
                var tmp0_iterator_0 = tmp1_find.c();
                while (tmp0_iterator_0.d()) {
                  var element_0 = tmp0_iterator_0.e();
                  var tmp$ret$3;
                  // Inline function 'Game.checkGameOver.<anonymous>' call
                  tmp$ret$3 = element_0.g4_1 === (row - 1 | 0) ? element_0.h4_1 === col : false;
                  if (tmp$ret$3) {
                    tmp$ret$4 = element_0;
                    break $l$block_0;
                  }
                }
                tmp$ret$4 = null;
              }
              tmp$ret$5 = tmp$ret$4;
              tmp_0 = tmp$ret$5;
            } else {
              tmp_0 = null;
            }
            var tmp_1 = tmp_0;
            var tmp_2;
            if (row < 3) {
              var tmp$ret$8;
              // Inline function 'kotlin.collections.find' call
              var tmp2_find = $this.w3_1;
              var tmp$ret$7;
              $l$block_1: {
                // Inline function 'kotlin.collections.firstOrNull' call
                var tmp0_iterator_1 = tmp2_find.c();
                while (tmp0_iterator_1.d()) {
                  var element_1 = tmp0_iterator_1.e();
                  var tmp$ret$6;
                  // Inline function 'Game.checkGameOver.<anonymous>' call
                  tmp$ret$6 = element_1.g4_1 === (row + 1 | 0) ? element_1.h4_1 === col : false;
                  if (tmp$ret$6) {
                    tmp$ret$7 = element_1;
                    break $l$block_1;
                  }
                }
                tmp$ret$7 = null;
              }
              tmp$ret$8 = tmp$ret$7;
              tmp_2 = tmp$ret$8;
            } else {
              tmp_2 = null;
            }
            var tmp_3 = tmp_2;
            var tmp_4;
            if (col > 0) {
              var tmp$ret$11;
              // Inline function 'kotlin.collections.find' call
              var tmp3_find = $this.w3_1;
              var tmp$ret$10;
              $l$block_2: {
                // Inline function 'kotlin.collections.firstOrNull' call
                var tmp0_iterator_2 = tmp3_find.c();
                while (tmp0_iterator_2.d()) {
                  var element_2 = tmp0_iterator_2.e();
                  var tmp$ret$9;
                  // Inline function 'Game.checkGameOver.<anonymous>' call
                  tmp$ret$9 = element_2.g4_1 === row ? element_2.h4_1 === (col - 1 | 0) : false;
                  if (tmp$ret$9) {
                    tmp$ret$10 = element_2;
                    break $l$block_2;
                  }
                }
                tmp$ret$10 = null;
              }
              tmp$ret$11 = tmp$ret$10;
              tmp_4 = tmp$ret$11;
            } else {
              tmp_4 = null;
            }
            var tmp_5 = tmp_4;
            var tmp_6;
            if (col < 3) {
              var tmp$ret$14;
              // Inline function 'kotlin.collections.find' call
              var tmp4_find = $this.w3_1;
              var tmp$ret$13;
              $l$block_3: {
                // Inline function 'kotlin.collections.firstOrNull' call
                var tmp0_iterator_3 = tmp4_find.c();
                while (tmp0_iterator_3.d()) {
                  var element_3 = tmp0_iterator_3.e();
                  var tmp$ret$12;
                  // Inline function 'Game.checkGameOver.<anonymous>' call
                  tmp$ret$12 = element_3.g4_1 === row ? element_3.h4_1 === (col + 1 | 0) : false;
                  if (tmp$ret$12) {
                    tmp$ret$13 = element_3;
                    break $l$block_3;
                  }
                }
                tmp$ret$13 = null;
              }
              tmp$ret$14 = tmp$ret$13;
              tmp_6 = tmp$ret$14;
            } else {
              tmp_6 = null;
            }
            var adjacentTiles = listOfNotNull([tmp_1, tmp_3, tmp_5, tmp_6]);
            var tmp$ret$15;
            $l$block_5: {
              // Inline function 'kotlin.collections.any' call
              var tmp_7;
              if (isInterface(adjacentTiles, Collection)) {
                tmp_7 = adjacentTiles.g();
              } else {
                tmp_7 = false;
              }
              if (tmp_7) {
                tmp$ret$15 = false;
                break $l$block_5;
              }
              var tmp0_iterator_4 = adjacentTiles.c();
              while (tmp0_iterator_4.d()) {
                var element_4 = tmp0_iterator_4.e();
                var tmp$ret$16;
                // Inline function 'Game.checkGameOver.<anonymous>' call
                tmp$ret$16 = element_4.f4_1 === value;
                if (tmp$ret$16) {
                  tmp$ret$15 = true;
                  break $l$block_5;
                }
              }
              tmp$ret$15 = false;
            }
            if (tmp$ret$15)
              return Unit_getInstance();
          }
           while (inductionVariable_0 <= 3);
      }
       while (inductionVariable <= 3);
    $this.y3_1 = true;
    showGameOver($this);
  }
  function showGameOver($this) {
    var tmp = document.createElement('div');
    var gameOverDiv = tmp instanceof HTMLDivElement ? tmp : THROW_CCE();
    gameOverDiv.className = 'game-over';
    gameOverDiv.innerHTML = '<h2>Game Over!<\/h2>\n<button id="new-game-button">Try Again<\/button>';
    var tmp0_safe_receiver = document.querySelector('.game-container');
    if (tmp0_safe_receiver == null)
      null;
    else
      tmp0_safe_receiver.appendChild(gameOverDiv);
    var tmp1_safe_receiver = gameOverDiv.querySelector('button');
    if (tmp1_safe_receiver == null)
      null;
    else {
      tmp1_safe_receiver.addEventListener('click', Game$showGameOver$lambda($this));
    }
  }
  function handleKeyDown($this, event) {
    var tmp0_subject = event.key;
    switch (tmp0_subject) {
      case 'ArrowUp':
        event.preventDefault();
        move($this, Direction_UP_getInstance());
        ;
        break;
      case 'ArrowDown':
        event.preventDefault();
        move($this, Direction_DOWN_getInstance());
        ;
        break;
      case 'ArrowLeft':
        event.preventDefault();
        move($this, Direction_LEFT_getInstance());
        ;
        break;
      case 'ArrowRight':
        event.preventDefault();
        move($this, Direction_RIGHT_getInstance());
        ;
        break;
    }
  }
  function handleTouchStart($this, event) {
    var tmp$ret$0;
    // Inline function 'kotlin.js.asDynamic' call
    tmp$ret$0 = event;
    var touchEvent = tmp$ret$0;
    var tmp = $this;
    var tmp_0 = touchEvent.touches[0].clientX;
    tmp.z3_1 = (!(tmp_0 == null) ? typeof tmp_0 === 'number' : false) ? tmp_0 : THROW_CCE();
    var tmp_1 = $this;
    var tmp_2 = touchEvent.touches[0].clientY;
    tmp_1.a4_1 = (!(tmp_2 == null) ? typeof tmp_2 === 'number' : false) ? tmp_2 : THROW_CCE();
  }
  function handleTouchEnd($this, event) {
    var tmp$ret$0;
    // Inline function 'kotlin.js.asDynamic' call
    tmp$ret$0 = event;
    var touchEvent = tmp$ret$0;
    var tmp = touchEvent.changedTouches[0].clientX;
    var deltaX = ((!(tmp == null) ? typeof tmp === 'number' : false) ? tmp : THROW_CCE()) - $this.z3_1;
    var tmp_0 = touchEvent.changedTouches[0].clientY;
    var deltaY = ((!(tmp_0 == null) ? typeof tmp_0 === 'number' : false) ? tmp_0 : THROW_CCE()) - $this.a4_1;
    var minSwipeDistance = 50;
    var tmp$ret$1;
    // Inline function 'kotlin.math.abs' call
    tmp$ret$1 = Math.abs(deltaX);
    var tmp_1 = tmp$ret$1;
    var tmp$ret$2;
    // Inline function 'kotlin.math.abs' call
    tmp$ret$2 = Math.abs(deltaY);
    if (tmp_1 > tmp$ret$2) {
      var tmp$ret$3;
      // Inline function 'kotlin.math.abs' call
      tmp$ret$3 = Math.abs(deltaX);
      if (tmp$ret$3 > minSwipeDistance) {
        move($this, deltaX > 0.0 ? Direction_RIGHT_getInstance() : Direction_LEFT_getInstance());
      }
    } else {
      var tmp$ret$4;
      // Inline function 'kotlin.math.abs' call
      tmp$ret$4 = Math.abs(deltaY);
      if (tmp$ret$4 > minSwipeDistance) {
        move($this, deltaY > 0.0 ? Direction_DOWN_getInstance() : Direction_UP_getInstance());
      }
    }
  }
  function animate($this, timestamp) {
    render($this);
    var tmp = window;
    tmp.requestAnimationFrame(Game$animate$lambda($this));
  }
  function animate$default($this, timestamp, $super) {
    timestamp = timestamp === VOID ? 0.0 : timestamp;
    return animate($this, timestamp);
  }
  function render($this) {
    var now = Date.now();
    $this.v3_1.clearRect(0.0, 0.0, $this.u3_1.width, $this.u3_1.height);
    $this.v3_1.fillStyle = '#cdc1b4';
    var inductionVariable = 0;
    if (inductionVariable <= 3)
      do {
        var row = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var inductionVariable_0 = 0;
        if (inductionVariable_0 <= 3)
          do {
            var col = inductionVariable_0;
            inductionVariable_0 = inductionVariable_0 + 1 | 0;
            var x = col * $this.d4_1 + $this.e4_1;
            var y = row * $this.d4_1 + $this.e4_1;
            var size = $this.d4_1 - $this.e4_1 * 2;
            $this.v3_1.fillRect(x, y, size, size);
          }
           while (inductionVariable_0 <= 3);
      }
       while (inductionVariable <= 3);
    var tmp = $this.c4_1;
    removeAll(tmp, Game$render$lambda($this, now));
    var tmp2_iterator = $this.w3_1.c();
    while (tmp2_iterator.d()) {
      var tile = tmp2_iterator.e();
      var scale = tile.i4_1;
      var x_0 = tile.h4_1 * $this.d4_1 + $this.e4_1;
      var y_0 = tile.g4_1 * $this.d4_1 + $this.e4_1;
      var size_0 = ($this.d4_1 - $this.e4_1 * 2) * scale;
      var offsetX = ($this.d4_1 - size_0) / 2;
      var offsetY = ($this.d4_1 - size_0) / 2;
      $this.v3_1.fillStyle = getTileColor($this, tile.f4_1);
      $this.v3_1.fillRect(x_0 + offsetX, y_0 + offsetY, size_0, size_0);
      $this.v3_1.fillStyle = getTileTextColor($this, tile.f4_1);
      $this.v3_1.font = 'bold ' + size_0 * 0.4 + 'px Arial';
      var tmp$ret$2;
      // Inline function 'org.w3c.dom.CENTER' call
      var tmp1__get_CENTER__zags5h = null;
      var tmp$ret$1;
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$0;
      // Inline function 'kotlin.js.asDynamic' call
      tmp$ret$0 = 'center';
      var tmp0_unsafeCast = tmp$ret$0;
      tmp$ret$1 = tmp0_unsafeCast;
      tmp$ret$2 = tmp$ret$1;
      $this.v3_1.textAlign = tmp$ret$2;
      var tmp$ret$5;
      // Inline function 'org.w3c.dom.MIDDLE' call
      var tmp3__get_MIDDLE__pgsprt = null;
      var tmp$ret$4;
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp$ret$3;
      // Inline function 'kotlin.js.asDynamic' call
      tmp$ret$3 = 'middle';
      var tmp2_unsafeCast = tmp$ret$3;
      tmp$ret$4 = tmp2_unsafeCast;
      tmp$ret$5 = tmp$ret$4;
      $this.v3_1.textBaseline = tmp$ret$5;
      $this.v3_1.fillText(tile.f4_1.toString(), x_0 + offsetX + size_0 / 2, y_0 + offsetY + size_0 / 2);
    }
  }
  function updateAnimation($this, animation, now) {
    var elapsed = now - animation.p4_1;
    if (elapsed >= animation.o4_1) {
      var tmp0_subject = animation.l4_1;
      switch (tmp0_subject) {
        case 'row':
          animation.k4_1.g4_1 = numberToInt(animation.n4_1);
          break;
        case 'col':
          animation.k4_1.h4_1 = numberToInt(animation.n4_1);
          break;
        case 'scale':
          animation.k4_1.i4_1 = animation.n4_1;
          break;
      }
      return true;
    }
    var progress = elapsed / animation.o4_1;
    var value = animation.m4_1 + (animation.n4_1 - animation.m4_1) * progress;
    var tmp1_subject = animation.l4_1;
    switch (tmp1_subject) {
      case 'row':
        animation.k4_1.g4_1 = numberToInt(value);
        break;
      case 'col':
        animation.k4_1.h4_1 = numberToInt(value);
        break;
      case 'scale':
        animation.k4_1.i4_1 = value;
        break;
    }
    return false;
  }
  function Direction(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function Tile(value, row, col, scale, merging) {
    scale = scale === VOID ? 1.0 : scale;
    merging = merging === VOID ? false : merging;
    this.f4_1 = value;
    this.g4_1 = row;
    this.h4_1 = col;
    this.i4_1 = scale;
    this.j4_1 = merging;
  }
  protoOf(Tile).toString = function () {
    return 'Tile(value=' + this.f4_1 + ', row=' + this.g4_1 + ', col=' + this.h4_1 + ', scale=' + this.i4_1 + ', merging=' + this.j4_1 + ')';
  };
  protoOf(Tile).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof Tile))
      return false;
    var tmp0_other_with_cast = other instanceof Tile ? other : THROW_CCE();
    if (!(this.f4_1 === tmp0_other_with_cast.f4_1))
      return false;
    if (!(this.g4_1 === tmp0_other_with_cast.g4_1))
      return false;
    if (!(this.h4_1 === tmp0_other_with_cast.h4_1))
      return false;
    if (!equals(this.i4_1, tmp0_other_with_cast.i4_1))
      return false;
    if (!(this.j4_1 === tmp0_other_with_cast.j4_1))
      return false;
    return true;
  };
  function Animation(tile, property, start, end, duration, startTime) {
    this.k4_1 = tile;
    this.l4_1 = property;
    this.m4_1 = start;
    this.n4_1 = end;
    this.o4_1 = duration;
    this.p4_1 = startTime;
  }
  protoOf(Animation).toString = function () {
    return 'Animation(tile=' + this.k4_1 + ', property=' + this.l4_1 + ', start=' + this.m4_1 + ', end=' + this.n4_1 + ', duration=' + this.o4_1 + ', startTime=' + this.p4_1 + ')';
  };
  protoOf(Animation).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof Animation))
      return false;
    var tmp0_other_with_cast = other instanceof Animation ? other : THROW_CCE();
    if (!this.k4_1.equals(tmp0_other_with_cast.k4_1))
      return false;
    if (!(this.l4_1 === tmp0_other_with_cast.l4_1))
      return false;
    if (!equals(this.m4_1, tmp0_other_with_cast.m4_1))
      return false;
    if (!equals(this.n4_1, tmp0_other_with_cast.n4_1))
      return false;
    if (!equals(this.o4_1, tmp0_other_with_cast.o4_1))
      return false;
    if (!equals(this.p4_1, tmp0_other_with_cast.p4_1))
      return false;
    return true;
  };
  function sam$kotlin_Comparator$0(function_0) {
    this.q4_1 = function_0;
  }
  protoOf(sam$kotlin_Comparator$0).r4 = function (a, b) {
    return this.q4_1(a, b);
  };
  protoOf(sam$kotlin_Comparator$0).compare = function (a, b) {
    return this.r4(a, b);
  };
  function Game$lambda(this$0) {
    return function (event) {
      handleKeyDown(this$0, event instanceof KeyboardEvent ? event : THROW_CCE());
      return Unit_getInstance();
    };
  }
  function Game$lambda_0(this$0) {
    return function (it) {
      handleResize(this$0);
      return Unit_getInstance();
    };
  }
  function Game$lambda_1(this$0) {
    return function (event) {
      handleTouchStart(this$0, event);
      return Unit_getInstance();
    };
  }
  function Game$lambda_2(this$0) {
    return function (event) {
      handleTouchEnd(this$0, event);
      return Unit_getInstance();
    };
  }
  function Game$lambda_3(this$0) {
    return function (it) {
      initGame(this$0);
      return Unit_getInstance();
    };
  }
  function Game$lambda_4(this$0) {
    return function (it) {
      animate$default(this$0);
      return Unit_getInstance();
    };
  }
  function Game$move$lambda($direction) {
    return function (a, b) {
      var tmp$ret$2;
      // Inline function 'kotlin.comparisons.compareValuesBy' call
      var tmp$ret$0;
      // Inline function 'Game.move.<anonymous>' call
      var tmp0_subject = $direction;
      var tmp0 = tmp0_subject.y2_1;
      var tmp;
      switch (tmp0) {
        case 1:
          tmp = -a.g4_1 | 0;
          break;
        case 0:
          tmp = a.g4_1;
          break;
        case 3:
          tmp = -a.h4_1 | 0;
          break;
        case 2:
          tmp = a.h4_1;
          break;
        default:
          noWhenBranchMatchedException();
          break;
      }
      tmp$ret$0 = tmp;
      var tmp_0 = tmp$ret$0;
      var tmp$ret$1;
      // Inline function 'Game.move.<anonymous>' call
      var tmp0_subject_0 = $direction;
      var tmp0_0 = tmp0_subject_0.y2_1;
      var tmp_1;
      switch (tmp0_0) {
        case 1:
          tmp_1 = -b.g4_1 | 0;
          break;
        case 0:
          tmp_1 = b.g4_1;
          break;
        case 3:
          tmp_1 = -b.h4_1 | 0;
          break;
        case 2:
          tmp_1 = b.h4_1;
          break;
        default:
          noWhenBranchMatchedException();
          break;
      }
      tmp$ret$1 = tmp_1;
      tmp$ret$2 = compareValues(tmp_0, tmp$ret$1);
      return tmp$ret$2;
    };
  }
  function Game$move$lambda_0(this$0, $tilesToRemove) {
    return function () {
      this$0.w3_1.e2($tilesToRemove);
      var tmp0_forEach = this$0.w3_1;
      var tmp0_iterator = tmp0_forEach.c();
      while (tmp0_iterator.d()) {
        var element = tmp0_iterator.e();
        // Inline function 'Game.move.<anonymous>.<anonymous>' call
        element.j4_1 = false;
      }
      addRandomTile(this$0);
      this$0.b4_1 = false;
      checkGameOver(this$0);
      return Unit_getInstance();
    };
  }
  function Game$showGameOver$lambda(this$0) {
    return function (it) {
      initGame(this$0);
      return Unit_getInstance();
    };
  }
  function Game$animate$lambda(this$0) {
    return function (it) {
      animate(this$0, it);
      return Unit_getInstance();
    };
  }
  function Game$render$lambda(this$0, $now) {
    return function (it) {
      return updateAnimation(this$0, it, $now);
    };
  }
  function Direction_UP_getInstance() {
    Direction_initEntries();
    return Direction_UP_instance;
  }
  function Direction_DOWN_getInstance() {
    Direction_initEntries();
    return Direction_DOWN_instance;
  }
  function Direction_LEFT_getInstance() {
    Direction_initEntries();
    return Direction_LEFT_instance;
  }
  function Direction_RIGHT_getInstance() {
    Direction_initEntries();
    return Direction_RIGHT_instance;
  }
  function Game() {
    var tmp = this;
    var tmp_0 = document.getElementById('game-canvas');
    tmp.u3_1 = tmp_0 instanceof HTMLCanvasElement ? tmp_0 : THROW_CCE();
    var tmp_1 = this;
    var tmp_2 = this.u3_1.getContext('2d');
    tmp_1.v3_1 = tmp_2 instanceof CanvasRenderingContext2D ? tmp_2 : THROW_CCE();
    var tmp_3 = this;
    var tmp$ret$0;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp$ret$0 = ArrayList_init_$Create$();
    tmp_3.w3_1 = tmp$ret$0;
    this.x3_1 = 0;
    this.y3_1 = false;
    this.z3_1 = 0.0;
    this.a4_1 = 0.0;
    this.b4_1 = false;
    var tmp_4 = this;
    var tmp$ret$1;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp$ret$1 = ArrayList_init_$Create$();
    tmp_4.c4_1 = tmp$ret$1;
    this.d4_1 = 0.0;
    this.e4_1 = 0.0;
    handleResize(this);
    initGame(this);
    var tmp_5 = window;
    tmp_5.addEventListener('keydown', Game$lambda(this));
    var tmp_6 = window;
    tmp_6.addEventListener('resize', Game$lambda_0(this));
    this.u3_1.addEventListener('touchstart', Game$lambda_1(this));
    this.u3_1.addEventListener('touchend', Game$lambda_2(this));
    var tmp0_safe_receiver = document.getElementById('new-game-button');
    if (tmp0_safe_receiver == null)
      null;
    else {
      tmp0_safe_receiver.addEventListener('click', Game$lambda_3(this));
    }
    var tmp_7 = window;
    tmp_7.requestAnimationFrame(Game$lambda_4(this));
  }
  function main() {
    new Game();
  }
  main();
  return _;
}));

//# sourceMappingURL=2048-kotlin.js.map
