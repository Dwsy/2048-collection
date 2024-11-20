<script>
  export let value = 0;
  export let isNew = false;
  export let isMerged = false;
  
  $: tileClass = value ? `tile-${value}` : '';
  $: textColor = value <= 4 ? 'text-gray-800' : 'text-gray-50';
  $: animationClass = isNew ? 'animate-pop-in' : 
                     isMerged ? 'animate-merge' : '';
  
  $: fontSize = value >= 1000 ? 'text-4xl md:text-5xl font-black' :
                value >= 100 ? 'text-5xl md:text-6xl font-black' :
                'text-6xl md:text-7xl font-black';
</script>

<div 
  class="game-tile {tileClass} {textColor} {animationClass}"
  style="width: 100%; height: 100%;"
>
  {#if value !== 0}
    <span class="{fontSize} tracking-tighter">{value}</span>
  {/if}
</div>

<style>
  .game-tile {
    background-color: #cdc1b4;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform-origin: center;
    will-change: transform;
    transition: background-color 0.15s ease-in-out;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
</style>
