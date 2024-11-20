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
  var THROW_ISE = kotlin_kotlin.$_$.u1;
  var Unit_getInstance = kotlin_kotlin.$_$.k;
  var ArrayList_init_$Create$ = kotlin_kotlin.$_$.b;
  var Collection = kotlin_kotlin.$_$.l;
  var isInterface = kotlin_kotlin.$_$.h1;
  var to = kotlin_kotlin.$_$.x1;
  var Default_getInstance = kotlin_kotlin.$_$.j;
  var random = kotlin_kotlin.$_$.v;
  var noWhenBranchMatchedException = kotlin_kotlin.$_$.w1;
  var sortedWith = kotlin_kotlin.$_$.x;
  var listOfNotNull = kotlin_kotlin.$_$.r;
  var THROW_CCE = kotlin_kotlin.$_$.t1;
  var VOID = kotlin_kotlin.$_$.y1;
  var removeAll = kotlin_kotlin.$_$.w;
  var numberToInt = kotlin_kotlin.$_$.j1;
  var Enum = kotlin_kotlin.$_$.s1;
  var protoOf = kotlin_kotlin.$_$.l1;
  var classMeta = kotlin_kotlin.$_$.b1;
  var setMetadataFor = kotlin_kotlin.$_$.m1;
  var getNumberHashCode = kotlin_kotlin.$_$.e1;
  var equals = kotlin_kotlin.$_$.c1;
  var getStringHashCode = kotlin_kotlin.$_$.f1;
  var Comparator = kotlin_kotlin.$_$.r1;
  var compareValues = kotlin_kotlin.$_$.z;
  //endregion
  //region block: pre-declaration
  setMetadataFor(Direction, 'Direction', classMeta, Enum);
  setMetadataFor(Tile, 'Tile', classMeta);
  setMetadataFor(Animation, 'Animation', classMeta);
  setMetadataFor(sam$kotlin_Comparator$0, 'sam$kotlin_Comparator$0', classMeta, VOID, [Comparator]);
  setMetadataFor(Game, 'Game', classMeta);
  //endregion
  var Direction_UP_instance;
  var Direction_DOWN_instance;
  var Direction_LEFT_instance;
  var Direction_RIGHT_instance;
  function values() {
    return [Direction_UP_getInstance(), Direction_DOWN_getInstance(), Direction_LEFT_getInstance(), Direction_RIGHT_getInstance()];
  }
  function valueOf(value) {
    switch (value) {
      case 'UP':
        return Direction_UP_getInstance();
      case 'DOWN':
        return Direction_DOWN_getInstance();
      case 'LEFT':
        return Direction_LEFT_getInstance();
      case 'RIGHT':
        return Direction_RIGHT_getInstance();
      default:
        Direction_initEntries();
        THROW_ISE();
        break;
    }
  }
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
  function _get_canvas__o4k8ct($this) {
    return $this.canvas_1;
  }
  function _get_ctx__e66oga($this) {
    return $this.ctx_1;
  }
  function _set_tiles__l3bpsw($this, _set____db54di) {
    $this.tiles_1 = _set____db54di;
  }
  function _get_tiles__axsqok($this) {
    return $this.tiles_1;
  }
  function _set_score__kj1i43($this, _set____db54di) {
    $this.score_1 = _set____db54di;
  }
  function _get_score__bi2ydd($this) {
    return $this.score_1;
  }
  function _set_gameOver__heo6kv($this, _set____db54di) {
    $this.gameOver_1 = _set____db54di;
  }
  function _get_gameOver__u7ki1n($this) {
    return $this.gameOver_1;
  }
  function _set_startX__4ycvxd($this, _set____db54di) {
    $this.startX_1 = _set____db54di;
  }
  function _get_startX__6f3gk5($this) {
    return $this.startX_1;
  }
  function _set_startY__4ycvy8($this, _set____db54di) {
    $this.startY_1 = _set____db54di;
  }
  function _get_startY__6f3gl0($this) {
    return $this.startY_1;
  }
  function _set_animating__pan1nr($this, _set____db54di) {
    $this.animating_1 = _set____db54di;
  }
  function _get_animating__gfmjwt($this) {
    return $this.animating_1;
  }
  function _set_animations__2tmn7s($this, _set____db54di) {
    $this.animations_1 = _set____db54di;
  }
  function _get_animations__c8lxxg($this) {
    return $this.animations_1;
  }
  function _set_tileSize__n1si5k($this, _set____db54di) {
    $this.tileSize_1 = _set____db54di;
  }
  function _get_tileSize__a8w6os($this) {
    return $this.tileSize_1;
  }
  function _set_padding__2ja1lg($this, _set____db54di) {
    $this.padding_1 = _set____db54di;
  }
  function _get_padding__n2y8rk($this) {
    return $this.padding_1;
  }
  function handleResize($this) {
    $this.canvas_1.width = $this.canvas_1.clientWidth;
    $this.canvas_1.height = $this.canvas_1.clientHeight;
    var tmp = $this;
    var tmp$ret$0;
    // Inline function 'kotlin.math.min' call
    var tmp0_min = $this.canvas_1.width;
    var tmp1_min = $this.canvas_1.height;
    tmp$ret$0 = Math.min(tmp0_min, tmp1_min);
    tmp.tileSize_1 = tmp$ret$0 / 4.0;
    $this.padding_1 = $this.tileSize_1 * 0.1;
    render($this);
  }
  function initGame($this) {
    $this.tiles_1.clear_j9y8zo_k$();
    $this.score_1 = 0;
    $this.gameOver_1 = false;
    var tmp0_safe_receiver = document.getElementById('score');
    if (tmp0_safe_receiver == null) {
    } else {
      tmp0_safe_receiver.textContent = '0';
    }
    $this.animations_1.clear_j9y8zo_k$();
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
              var tmp0_none = $this.tiles_1;
              var tmp;
              if (isInterface(tmp0_none, Collection)) {
                tmp = tmp0_none.isEmpty_y1axqb_k$();
              } else {
                tmp = false;
              }
              if (tmp) {
                tmp$ret$1 = true;
                break $l$block_0;
              }
              var tmp0_iterator = tmp0_none.iterator_jk1svi_k$();
              while (tmp0_iterator.hasNext_bitz1p_k$()) {
                var element = tmp0_iterator.next_20eer_k$();
                var tmp$ret$2;
                // Inline function 'Game.addRandomTile.<anonymous>' call
                tmp$ret$2 = element.row_1 === row ? element.col_1 === col : false;
                if (tmp$ret$2) {
                  tmp$ret$1 = false;
                  break $l$block_0;
                }
              }
              tmp$ret$1 = true;
            }
            if (tmp$ret$1) {
              emptyCells.add_1j60pz_k$(to(row, col));
            }
          }
           while (inductionVariable_0 <= 3);
      }
       while (inductionVariable <= 3);
    var tmp$ret$3;
    // Inline function 'kotlin.collections.isNotEmpty' call
    tmp$ret$3 = !emptyCells.isEmpty_y1axqb_k$();
    if (tmp$ret$3) {
      var tmp$ret$4;
      // Inline function 'kotlin.collections.random' call
      tmp$ret$4 = random(emptyCells, Default_getInstance());
      var tmp2_container = tmp$ret$4;
      var row_0 = tmp2_container.component1_7eebsc_k$();
      var col_0 = tmp2_container.component2_7eebsb_k$();
      var value = Default_getInstance().nextDouble_s2xvfg_k$() < 0.9 ? 2 : 4;
      var tile = new Tile(value, row_0, col_0);
      $this.tiles_1.add_1j60pz_k$(tile);
      $this.animations_1.add_1j60pz_k$(new Animation(tile, 'scale', 0.0, 1.0, 200.0, Date.now()));
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
    if ($this.gameOver_1 ? true : $this.animating_1)
      return Unit_getInstance();
    var tmp0_subject = direction;
    var tmp0 = tmp0_subject.get_ordinal_ip24qg_k$();
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
    $this.animations_1.clear_j9y8zo_k$();
    var tmp_0 = $this.tiles_1;
    var tmp$ret$1;
    // Inline function 'kotlin.comparisons.compareBy' call
    var tmp_1 = Game$move$lambda(direction);
    tmp$ret$1 = new sam$kotlin_Comparator$0(tmp_1);
    var sortedTiles = sortedWith(tmp_0, tmp$ret$1);
    var tmp1_iterator = sortedTiles.iterator_jk1svi_k$();
    while (tmp1_iterator.hasNext_bitz1p_k$()) {
      var tile = tmp1_iterator.next_20eer_k$();
      var newRow = tile.row_1;
      var newCol = tile.col_1;
      $l$loop_1: while (true) {
        var nextRow = newRow + delta.get_first_irdx8n_k$() | 0;
        var nextCol = newCol + delta.get_second_jf7fjx_k$() | 0;
        if (!(0 <= nextRow ? nextRow <= 3 : false) ? true : !(0 <= nextCol ? nextCol <= 3 : false))
          break $l$loop_1;
        var tmp$ret$4;
        // Inline function 'kotlin.collections.find' call
        var tmp0_find = $this.tiles_1;
        var tmp$ret$3;
        $l$block: {
          // Inline function 'kotlin.collections.firstOrNull' call
          var tmp0_iterator = tmp0_find.iterator_jk1svi_k$();
          while (tmp0_iterator.hasNext_bitz1p_k$()) {
            var element = tmp0_iterator.next_20eer_k$();
            var tmp$ret$2;
            // Inline function 'Game.move.<anonymous>' call
            tmp$ret$2 = (element.row_1 === nextRow ? element.col_1 === nextCol : false) ? !tilesToRemove.contains_2ehdt1_k$(element) : false;
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
        } else if ((nextTile.value_1 === tile.value_1 ? !tile.merging_1 : false) ? !nextTile.merging_1 : false) {
          newRow = nextRow;
          newCol = nextCol;
          var tmp2_this = tile;
          tmp2_this.value_1 = imul(tmp2_this.value_1, 2);
          tile.merging_1 = true;
          var tmp3_this = $this;
          tmp3_this.score_1 = tmp3_this.score_1 + tile.value_1 | 0;
          tilesToRemove.add_1j60pz_k$(nextTile);
          moved = true;
          break $l$loop_1;
        } else {
          break $l$loop_1;
        }
      }
      if (!(newRow === tile.row_1) ? true : !(newCol === tile.col_1)) {
        $this.animations_1.add_1j60pz_k$(new Animation(tile, 'row', tile.row_1, newRow, 150.0, Date.now()));
        $this.animations_1.add_1j60pz_k$(new Animation(tile, 'col', tile.col_1, newCol, 150.0, Date.now()));
        if (tile.merging_1) {
          $this.animations_1.add_1j60pz_k$(new Animation(tile, 'scale', 1.0, 1.2, 100.0, Date.now()));
          $this.animations_1.add_1j60pz_k$(new Animation(tile, 'scale', 1.2, 1.0, 100.0, Date.now() + 100));
        }
        tile.row_1 = newRow;
        tile.col_1 = newCol;
      }
    }
    if (moved) {
      $this.animating_1 = true;
      var tmp4_safe_receiver = document.getElementById('score');
      if (tmp4_safe_receiver == null) {
      } else {
        tmp4_safe_receiver.textContent = $this.score_1.toString();
      }
      var tmp_2 = window;
      tmp_2.setTimeout(Game$move$lambda_0($this, tilesToRemove), 150);
    }
  }
  function checkGameOver($this) {
    if ($this.tiles_1.get_size_woubt6_k$() < 16)
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
            var tmp0_find = $this.tiles_1;
            var tmp$ret$1;
            $l$block: {
              // Inline function 'kotlin.collections.firstOrNull' call
              var tmp0_iterator = tmp0_find.iterator_jk1svi_k$();
              while (tmp0_iterator.hasNext_bitz1p_k$()) {
                var element = tmp0_iterator.next_20eer_k$();
                var tmp$ret$0;
                // Inline function 'Game.checkGameOver.<anonymous>' call
                tmp$ret$0 = element.row_1 === row ? element.col_1 === col : false;
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
            var value = tile.value_1;
            var tmp_0;
            if (row > 0) {
              var tmp$ret$5;
              // Inline function 'kotlin.collections.find' call
              var tmp1_find = $this.tiles_1;
              var tmp$ret$4;
              $l$block_0: {
                // Inline function 'kotlin.collections.firstOrNull' call
                var tmp0_iterator_0 = tmp1_find.iterator_jk1svi_k$();
                while (tmp0_iterator_0.hasNext_bitz1p_k$()) {
                  var element_0 = tmp0_iterator_0.next_20eer_k$();
                  var tmp$ret$3;
                  // Inline function 'Game.checkGameOver.<anonymous>' call
                  tmp$ret$3 = element_0.row_1 === (row - 1 | 0) ? element_0.col_1 === col : false;
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
              var tmp2_find = $this.tiles_1;
              var tmp$ret$7;
              $l$block_1: {
                // Inline function 'kotlin.collections.firstOrNull' call
                var tmp0_iterator_1 = tmp2_find.iterator_jk1svi_k$();
                while (tmp0_iterator_1.hasNext_bitz1p_k$()) {
                  var element_1 = tmp0_iterator_1.next_20eer_k$();
                  var tmp$ret$6;
                  // Inline function 'Game.checkGameOver.<anonymous>' call
                  tmp$ret$6 = element_1.row_1 === (row + 1 | 0) ? element_1.col_1 === col : false;
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
              var tmp3_find = $this.tiles_1;
              var tmp$ret$10;
              $l$block_2: {
                // Inline function 'kotlin.collections.firstOrNull' call
                var tmp0_iterator_2 = tmp3_find.iterator_jk1svi_k$();
                while (tmp0_iterator_2.hasNext_bitz1p_k$()) {
                  var element_2 = tmp0_iterator_2.next_20eer_k$();
                  var tmp$ret$9;
                  // Inline function 'Game.checkGameOver.<anonymous>' call
                  tmp$ret$9 = element_2.row_1 === row ? element_2.col_1 === (col - 1 | 0) : false;
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
              var tmp4_find = $this.tiles_1;
              var tmp$ret$13;
              $l$block_3: {
                // Inline function 'kotlin.collections.firstOrNull' call
                var tmp0_iterator_3 = tmp4_find.iterator_jk1svi_k$();
                while (tmp0_iterator_3.hasNext_bitz1p_k$()) {
                  var element_3 = tmp0_iterator_3.next_20eer_k$();
                  var tmp$ret$12;
                  // Inline function 'Game.checkGameOver.<anonymous>' call
                  tmp$ret$12 = element_3.row_1 === row ? element_3.col_1 === (col + 1 | 0) : false;
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
                tmp_7 = adjacentTiles.isEmpty_y1axqb_k$();
              } else {
                tmp_7 = false;
              }
              if (tmp_7) {
                tmp$ret$15 = false;
                break $l$block_5;
              }
              var tmp0_iterator_4 = adjacentTiles.iterator_jk1svi_k$();
              while (tmp0_iterator_4.hasNext_bitz1p_k$()) {
                var element_4 = tmp0_iterator_4.next_20eer_k$();
                var tmp$ret$16;
                // Inline function 'Game.checkGameOver.<anonymous>' call
                tmp$ret$16 = element_4.value_1 === value;
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
    $this.gameOver_1 = true;
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
    tmp.startX_1 = (!(tmp_0 == null) ? typeof tmp_0 === 'number' : false) ? tmp_0 : THROW_CCE();
    var tmp_1 = $this;
    var tmp_2 = touchEvent.touches[0].clientY;
    tmp_1.startY_1 = (!(tmp_2 == null) ? typeof tmp_2 === 'number' : false) ? tmp_2 : THROW_CCE();
  }
  function handleTouchEnd($this, event) {
    var tmp$ret$0;
    // Inline function 'kotlin.js.asDynamic' call
    tmp$ret$0 = event;
    var touchEvent = tmp$ret$0;
    var tmp = touchEvent.changedTouches[0].clientX;
    var deltaX = ((!(tmp == null) ? typeof tmp === 'number' : false) ? tmp : THROW_CCE()) - $this.startX_1;
    var tmp_0 = touchEvent.changedTouches[0].clientY;
    var deltaY = ((!(tmp_0 == null) ? typeof tmp_0 === 'number' : false) ? tmp_0 : THROW_CCE()) - $this.startY_1;
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
    $this.ctx_1.clearRect(0.0, 0.0, $this.canvas_1.width, $this.canvas_1.height);
    $this.ctx_1.fillStyle = '#cdc1b4';
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
            var x = col * $this.tileSize_1 + $this.padding_1;
            var y = row * $this.tileSize_1 + $this.padding_1;
            var size = $this.tileSize_1 - $this.padding_1 * 2;
            $this.ctx_1.fillRect(x, y, size, size);
          }
           while (inductionVariable_0 <= 3);
      }
       while (inductionVariable <= 3);
    var tmp = $this.animations_1;
    removeAll(tmp, Game$render$lambda($this, now));
    var tmp2_iterator = $this.tiles_1.iterator_jk1svi_k$();
    while (tmp2_iterator.hasNext_bitz1p_k$()) {
      var tile = tmp2_iterator.next_20eer_k$();
      var scale = tile.scale_1;
      var x_0 = tile.col_1 * $this.tileSize_1 + $this.padding_1;
      var y_0 = tile.row_1 * $this.tileSize_1 + $this.padding_1;
      var size_0 = ($this.tileSize_1 - $this.padding_1 * 2) * scale;
      var offsetX = ($this.tileSize_1 - size_0) / 2;
      var offsetY = ($this.tileSize_1 - size_0) / 2;
      $this.ctx_1.fillStyle = getTileColor($this, tile.value_1);
      $this.ctx_1.fillRect(x_0 + offsetX, y_0 + offsetY, size_0, size_0);
      $this.ctx_1.fillStyle = getTileTextColor($this, tile.value_1);
      $this.ctx_1.font = 'bold ' + size_0 * 0.4 + 'px Arial';
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
      $this.ctx_1.textAlign = tmp$ret$2;
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
      $this.ctx_1.textBaseline = tmp$ret$5;
      $this.ctx_1.fillText(tile.value_1.toString(), x_0 + offsetX + size_0 / 2, y_0 + offsetY + size_0 / 2);
    }
  }
  function updateAnimation($this, animation, now) {
    var elapsed = now - animation.startTime_1;
    if (elapsed >= animation.duration_1) {
      var tmp0_subject = animation.property_1;
      switch (tmp0_subject) {
        case 'row':
          animation.tile_1.row_1 = numberToInt(animation.end_1);
          break;
        case 'col':
          animation.tile_1.col_1 = numberToInt(animation.end_1);
          break;
        case 'scale':
          animation.tile_1.scale_1 = animation.end_1;
          break;
      }
      return true;
    }
    var progress = elapsed / animation.duration_1;
    var value = animation.start_1 + (animation.end_1 - animation.start_1) * progress;
    var tmp1_subject = animation.property_1;
    switch (tmp1_subject) {
      case 'row':
        animation.tile_1.row_1 = numberToInt(value);
        break;
      case 'col':
        animation.tile_1.col_1 = numberToInt(value);
        break;
      case 'scale':
        animation.tile_1.scale_1 = value;
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
    this.value_1 = value;
    this.row_1 = row;
    this.col_1 = col;
    this.scale_1 = scale;
    this.merging_1 = merging;
  }
  protoOf(Tile).set_value_qwpg4c_k$ = function (_set____db54di) {
    this.value_1 = _set____db54di;
  };
  protoOf(Tile).get_value_j01efc_k$ = function () {
    return this.value_1;
  };
  protoOf(Tile).set_row_38m3gz_k$ = function (_set____db54di) {
    this.row_1 = _set____db54di;
  };
  protoOf(Tile).get_row_18iwsv_k$ = function () {
    return this.row_1;
  };
  protoOf(Tile).set_col_o99cgj_k$ = function (_set____db54di) {
    this.col_1 = _set____db54di;
  };
  protoOf(Tile).get_col_18j7xl_k$ = function () {
    return this.col_1;
  };
  protoOf(Tile).set_scale_razmn9_k$ = function (_set____db54di) {
    this.scale_1 = _set____db54di;
  };
  protoOf(Tile).get_scale_iyf28x_k$ = function () {
    return this.scale_1;
  };
  protoOf(Tile).set_merging_hbn7e7_k$ = function (_set____db54di) {
    this.merging_1 = _set____db54di;
  };
  protoOf(Tile).get_merging_h1c0lo_k$ = function () {
    return this.merging_1;
  };
  protoOf(Tile).component1_7eebsc_k$ = function () {
    return this.value_1;
  };
  protoOf(Tile).component2_7eebsb_k$ = function () {
    return this.row_1;
  };
  protoOf(Tile).component3_7eebsa_k$ = function () {
    return this.col_1;
  };
  protoOf(Tile).component4_7eebs9_k$ = function () {
    return this.scale_1;
  };
  protoOf(Tile).component5_7eebs8_k$ = function () {
    return this.merging_1;
  };
  protoOf(Tile).copy_xz00wf_k$ = function (value, row, col, scale, merging) {
    return new Tile(value, row, col, scale, merging);
  };
  protoOf(Tile).copy$default_b523l7_k$ = function (value, row, col, scale, merging, $super) {
    value = value === VOID ? this.value_1 : value;
    row = row === VOID ? this.row_1 : row;
    col = col === VOID ? this.col_1 : col;
    scale = scale === VOID ? this.scale_1 : scale;
    merging = merging === VOID ? this.merging_1 : merging;
    return $super === VOID ? this.copy_xz00wf_k$(value, row, col, scale, merging) : $super.copy_xz00wf_k$.call(this, value, row, col, scale, merging);
  };
  protoOf(Tile).toString = function () {
    return 'Tile(value=' + this.value_1 + ', row=' + this.row_1 + ', col=' + this.col_1 + ', scale=' + this.scale_1 + ', merging=' + this.merging_1 + ')';
  };
  protoOf(Tile).hashCode = function () {
    var result = this.value_1;
    result = imul(result, 31) + this.row_1 | 0;
    result = imul(result, 31) + this.col_1 | 0;
    result = imul(result, 31) + getNumberHashCode(this.scale_1) | 0;
    result = imul(result, 31) + (this.merging_1 | 0) | 0;
    return result;
  };
  protoOf(Tile).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof Tile))
      return false;
    var tmp0_other_with_cast = other instanceof Tile ? other : THROW_CCE();
    if (!(this.value_1 === tmp0_other_with_cast.value_1))
      return false;
    if (!(this.row_1 === tmp0_other_with_cast.row_1))
      return false;
    if (!(this.col_1 === tmp0_other_with_cast.col_1))
      return false;
    if (!equals(this.scale_1, tmp0_other_with_cast.scale_1))
      return false;
    if (!(this.merging_1 === tmp0_other_with_cast.merging_1))
      return false;
    return true;
  };
  function Animation(tile, property, start, end, duration, startTime) {
    this.tile_1 = tile;
    this.property_1 = property;
    this.start_1 = start;
    this.end_1 = end;
    this.duration_1 = duration;
    this.startTime_1 = startTime;
  }
  protoOf(Animation).get_tile_wouygn_k$ = function () {
    return this.tile_1;
  };
  protoOf(Animation).get_property_msvula_k$ = function () {
    return this.property_1;
  };
  protoOf(Animation).get_start_iypx6h_k$ = function () {
    return this.start_1;
  };
  protoOf(Animation).get_end_18j6ha_k$ = function () {
    return this.end_1;
  };
  protoOf(Animation).get_duration_6a6kpp_k$ = function () {
    return this.duration_1;
  };
  protoOf(Animation).get_startTime_qp7d5m_k$ = function () {
    return this.startTime_1;
  };
  protoOf(Animation).component1_7eebsc_k$ = function () {
    return this.tile_1;
  };
  protoOf(Animation).component2_7eebsb_k$ = function () {
    return this.property_1;
  };
  protoOf(Animation).component3_7eebsa_k$ = function () {
    return this.start_1;
  };
  protoOf(Animation).component4_7eebs9_k$ = function () {
    return this.end_1;
  };
  protoOf(Animation).component5_7eebs8_k$ = function () {
    return this.duration_1;
  };
  protoOf(Animation).component6_7eebs7_k$ = function () {
    return this.startTime_1;
  };
  protoOf(Animation).copy_bzlf2r_k$ = function (tile, property, start, end, duration, startTime) {
    return new Animation(tile, property, start, end, duration, startTime);
  };
  protoOf(Animation).copy$default_ltpxsu_k$ = function (tile, property, start, end, duration, startTime, $super) {
    tile = tile === VOID ? this.tile_1 : tile;
    property = property === VOID ? this.property_1 : property;
    start = start === VOID ? this.start_1 : start;
    end = end === VOID ? this.end_1 : end;
    duration = duration === VOID ? this.duration_1 : duration;
    startTime = startTime === VOID ? this.startTime_1 : startTime;
    return $super === VOID ? this.copy_bzlf2r_k$(tile, property, start, end, duration, startTime) : $super.copy_bzlf2r_k$.call(this, tile, property, start, end, duration, startTime);
  };
  protoOf(Animation).toString = function () {
    return 'Animation(tile=' + this.tile_1 + ', property=' + this.property_1 + ', start=' + this.start_1 + ', end=' + this.end_1 + ', duration=' + this.duration_1 + ', startTime=' + this.startTime_1 + ')';
  };
  protoOf(Animation).hashCode = function () {
    var result = this.tile_1.hashCode();
    result = imul(result, 31) + getStringHashCode(this.property_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.start_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.end_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.duration_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.startTime_1) | 0;
    return result;
  };
  protoOf(Animation).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof Animation))
      return false;
    var tmp0_other_with_cast = other instanceof Animation ? other : THROW_CCE();
    if (!this.tile_1.equals(tmp0_other_with_cast.tile_1))
      return false;
    if (!(this.property_1 === tmp0_other_with_cast.property_1))
      return false;
    if (!equals(this.start_1, tmp0_other_with_cast.start_1))
      return false;
    if (!equals(this.end_1, tmp0_other_with_cast.end_1))
      return false;
    if (!equals(this.duration_1, tmp0_other_with_cast.duration_1))
      return false;
    if (!equals(this.startTime_1, tmp0_other_with_cast.startTime_1))
      return false;
    return true;
  };
  function sam$kotlin_Comparator$0(function_0) {
    this.function_1 = function_0;
  }
  protoOf(sam$kotlin_Comparator$0).compare_6tbigh_k$ = function (a, b) {
    return this.function_1(a, b);
  };
  protoOf(sam$kotlin_Comparator$0).compare = function (a, b) {
    return this.compare_6tbigh_k$(a, b);
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
      var tmp0 = tmp0_subject.get_ordinal_ip24qg_k$();
      var tmp;
      switch (tmp0) {
        case 1:
          tmp = -a.row_1 | 0;
          break;
        case 0:
          tmp = a.row_1;
          break;
        case 3:
          tmp = -a.col_1 | 0;
          break;
        case 2:
          tmp = a.col_1;
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
      var tmp0_0 = tmp0_subject_0.get_ordinal_ip24qg_k$();
      var tmp_1;
      switch (tmp0_0) {
        case 1:
          tmp_1 = -b.row_1 | 0;
          break;
        case 0:
          tmp_1 = b.row_1;
          break;
        case 3:
          tmp_1 = -b.col_1 | 0;
          break;
        case 2:
          tmp_1 = b.col_1;
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
      this$0.tiles_1.removeAll_99to5v_k$($tilesToRemove);
      var tmp0_forEach = this$0.tiles_1;
      var tmp0_iterator = tmp0_forEach.iterator_jk1svi_k$();
      while (tmp0_iterator.hasNext_bitz1p_k$()) {
        var element = tmp0_iterator.next_20eer_k$();
        // Inline function 'Game.move.<anonymous>.<anonymous>' call
        element.merging_1 = false;
      }
      addRandomTile(this$0);
      this$0.animating_1 = false;
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
    tmp.canvas_1 = tmp_0 instanceof HTMLCanvasElement ? tmp_0 : THROW_CCE();
    var tmp_1 = this;
    var tmp_2 = this.canvas_1.getContext('2d');
    tmp_1.ctx_1 = tmp_2 instanceof CanvasRenderingContext2D ? tmp_2 : THROW_CCE();
    var tmp_3 = this;
    var tmp$ret$0;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp$ret$0 = ArrayList_init_$Create$();
    tmp_3.tiles_1 = tmp$ret$0;
    this.score_1 = 0;
    this.gameOver_1 = false;
    this.startX_1 = 0.0;
    this.startY_1 = 0.0;
    this.animating_1 = false;
    var tmp_4 = this;
    var tmp$ret$1;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp$ret$1 = ArrayList_init_$Create$();
    tmp_4.animations_1 = tmp$ret$1;
    this.tileSize_1 = 0.0;
    this.padding_1 = 0.0;
    handleResize(this);
    initGame(this);
    var tmp_5 = window;
    tmp_5.addEventListener('keydown', Game$lambda(this));
    var tmp_6 = window;
    tmp_6.addEventListener('resize', Game$lambda_0(this));
    this.canvas_1.addEventListener('touchstart', Game$lambda_1(this));
    this.canvas_1.addEventListener('touchend', Game$lambda_2(this));
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
