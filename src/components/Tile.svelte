<script lang="ts">
  let tileHover = false;
  export let tileSelectHandler: () => void;
  export let gameOver: boolean;
  export let tilePosition: number;
  export let selections: string[];
  export let playerRole: "X" | "O";
</script>

<button
  on:mouseenter={() => (tileHover = true)}
  on:mouseleave={() => (tileHover = false)}
  on:click={gameOver ? () => {} : tileSelectHandler}
  class="tile"
  >{#if selections[tilePosition] === "" && tileHover}
    <span class="hover-role">{playerRole}</span>
  {:else}
    {selections[tilePosition]}
  {/if}
</button>

<style>
  .tile {
    min-width: 100px;
    min-height: 100px;
    border: 0;
    color: rgba(253, 242, 237, 1);
    font-size: 128px;
    font-weight: 200;
  }
  .hover-role {
    color: rgba(253, 242, 237, 0.5);
  }
</style>
