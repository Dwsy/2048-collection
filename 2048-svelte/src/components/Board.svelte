<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import Tile from './Tile.svelte';
  
  const dispatch = createEventDispatcher();
  export let board;
  export let isMerged;
  export let isNew;
  
  let touchStartX = 0;
  let touchStartY = 0;
  
  function handleKeydown(event) {
    switch(event.key) {
      case 'ArrowUp':
        dispatch('move', 'up');
        break;
      case 'ArrowDown':
        dispatch('move', 'down');
        break;
      case 'ArrowLeft':
        dispatch('move', 'left');
        break;
      case 'ArrowRight':
        dispatch('move', 'right');
        break;
    }
  }
  
  function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }
  
  function handleTouchEnd(event) {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        dispatch('move', 'right');
      } else {
        dispatch('move', 'left');
      }
    } else {
      if (deltaY > 0) {
        dispatch('move', 'down');
      } else {
        dispatch('move', 'up');
      }
    }
  }
  
  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div class="game-board" 
  on:touchstart={handleTouchStart}
  on:touchend={handleTouchEnd}
>
  <div class="game-grid">
    {#each board as row, i}
      {#each row as cell, j}
        <div class="tile-container">
          <Tile 
            value={cell}
            isMerged={isMerged(i, j)}
            isNew={isNew(i, j)}
          />
        </div>
      {/each}
    {/each}
  </div>
</div>

<style>
  .game-board {
    width: min(400px, 95vw);
    height: min(400px, 95vw);
    padding: 1rem;
    background-color: #bbada0;
    border-radius: 0.5rem;
    box-sizing: border-box;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .game-grid {
    width: calc(100% - 2rem);
    height: calc(100% - 2rem);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    background-color: #bbada0;
  }
  
  .tile-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    background-color: rgba(238, 228, 218, 0.35);
    border-radius: 0.25rem;
  }
  
  .tile-container :global(.game-tile) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
