<script lang="ts">
  let tileHover = false;
  export let tileSelectHandler: () => void;
  export let tilePosition: number;
  export let selections: string[];
  export let playerRole: "X" | "O";
  export let botsTurn: boolean;
</script>

<button
  on:mouseenter={() => (tileHover = true)}
  on:mouseleave={() => (tileHover = false)}
  on:click={selections[tilePosition] !== "" ? () => {} : tileSelectHandler}
  class="tile"
  >{#if selections[tilePosition] === "" && tileHover && !botsTurn}
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
    color: rgba(253, 242, 237, 0.1);
  }
  button:hover {
    background: #2a5965;
  }
</style>
