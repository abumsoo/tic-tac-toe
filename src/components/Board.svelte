<script lang="ts">
  export let playerRole;
  let selections: string[] = new Array(9).fill("a");
  let gameOver: boolean = false;

  function switchRole() {
    if (playerRole === "X") {
      playerRole = "O";
    } else if (playerRole === "O") {
      playerRole = "X";
    }
  }

  function selectTile(index: number) {
    selections[index] = playerRole;
    if (checkRow(index) || checkCol(index)) {
      gameOver = true;
    } else {
      switchRole();
    }
  }

  function checkRow(index: number): boolean {
    // determine the range that matters
    const startIndex = Math.floor(index / 3) * 3;
    // check that all three elements are the same
    return selections
      .slice(startIndex, startIndex + 3)
      .every((tile, _index, tiles) => tile === tiles[startIndex]);
  }

  function checkCol(index: number): boolean {
    const startIndex = index % 3;
    for (let i = startIndex; i < 9; i += 3) {
      if (selections[i] !== selections[startIndex]) {
        return false;
      }
    }
    return true;
  }

  function checkDiagonal(index: number): boolean {
    return;
  }
</script>

<div class="board">
  <div class="row">
    <button on:click={() => selectTile(0)} class="tile">{selections[0]}</button>
    <div class="column top-col" />
    <button on:click={() => selectTile(1)} class="tile">{selections[1]}</button>
    <div class="column top-col" />
    <button on:click={() => selectTile(2)} class="tile">{selections[2]}</button>
  </div>
  <div class="row-separator" />
  <div class="row">
    <button on:click={() => selectTile(3)} class="tile">{selections[3]}</button>
    <div class="column" />
    <button on:click={() => selectTile(4)} class="tile">{selections[4]}</button>
    <div class="column" />
    <button on:click={() => selectTile(5)} class="tile">{selections[5]}</button>
  </div>
  <div class="row-separator" />
  <div class="row">
    <button on:click={() => selectTile(6)} class="tile">{selections[6]}</button>
    <div class="column bot-col" />
    <button on:click={() => selectTile(7)} class="tile">{selections[7]}</button>
    <div class="column bot-col" />
    <button on:click={() => selectTile(8)} class="tile">{selections[8]}</button>
  </div>
</div>
{#if gameOver}
  <p>{playerRole} wins!</p>
{/if}

<style>
  .board {
    display: grid;
    grid-template-rows: 1fr 10px 1fr 10px 1fr;
    grid-template-columns: auto;
    width: 500px;
    height: 500px;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 10px 1fr 10px 1fr;
  }

  .tile {
    min-width: 100px;
    min-height: 100px;
    border: 0;
    background: white;
    color: black;
  }

  .column {
    background-color: red;
    min-width: 10px;
  }

  .row-separator {
    background-color: green;
    min-height: 10px;
    border-radius: 8px;
  }

  .top-col {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .bot-col {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
</style>
