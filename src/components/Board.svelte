<script lang="ts">
  import Tile from "./Tile.svelte";

  export let playerRole: "X" | "O" | undefined;
  export let mode: "single" | "multi";
  export let selections: string[];
  let winLose: boolean = false;
  let tie: boolean = false;
  let gameOver = winLose || tie;

  function switchRole() {
    if (playerRole === "X") {
      playerRole = "O";
    } else if (playerRole === "O") {
      playerRole = "X";
    }
  }

  function winner(board: string[], tile: number) {
    return (
      areRowTilesEqual(board, tile) ||
      areColTilesEqual(board, tile) ||
      areDiagTilesEqual(board, tile)
    );
  }

  function getBotMove() {
    let maxEval = -Infinity;
    let boardClone = [...selections];
    let targetIndex: number;
    for (let i = 0; i < 9; i += 1) {
      if (boardClone[i] === "") {
        boardClone[i] = playerRole;
        const score = minimax(
          boardClone,
          i,
          false,
          getOppositeRole(playerRole)
        );
        boardClone[i] = "";
        if (score > maxEval) {
          maxEval = score;
          targetIndex = i;
        }
      }
    }
    return targetIndex;
  }

  function selectTile(tile: number) {
    selections[tile] = playerRole;
    if (winner(selections, tile)) {
      winLose = true;
    } else if (isBoardFull(selections)) {
      winLose = true;
      tie = true;
    } else {
      switchRole();
      if (mode === "single") {
        const botMove = getBotMove();
        setTimeout(() => {
          selections[botMove] = playerRole;
          if (winner(selections, botMove)) {
            winLose = true;
          } else if (isBoardFull(selections)) {
            winLose = true;
            tie = true;
          } else {
            switchRole();
          }
        }, 600);
      }
    }
  }

  function areRowTilesEqual(board: string[], index: number): boolean {
    const startIndex = Math.floor(index / 3) * 3;
    return board
      .slice(startIndex, startIndex + 3)
      .every((v, i, arr) => v === arr[0]);
  }

  function areColTilesEqual(board: string[], index: number): boolean {
    const startIndex = index % 3;
    for (let i = startIndex; i < 9; i += 3) {
      if (board[index] !== board[i]) {
        return false;
      }
    }
    return true;
  }

  function areDiagTilesEqual(board: string[], targetIndex: number): boolean {
    function checkDiagonal(diag: number[]) {
      return diag.every((v, i, arr) => board[v] === board[targetIndex]);
    }

    const backSlash = [0, 4, 8];
    const forwardSlash = [2, 4, 6];
    if (targetIndex === 4) {
      return checkDiagonal(backSlash) || checkDiagonal(forwardSlash);
    } else if (backSlash.includes(targetIndex)) {
      return checkDiagonal(backSlash);
    } else if (forwardSlash.includes(targetIndex)) {
      return checkDiagonal(forwardSlash);
    } else {
      return false;
    }
  }

  function isBoardFull(board: string[]): boolean {
    return !board.includes("");
  }

  function getOppositeRole(role: "X" | "O") {
    return role === "X" ? "O" : "X";
  }

  function minimax(
    board: string[],
    tile: number,
    maximizer: boolean,
    role: "X" | "O"
  ) {
    if (winner(board, tile)) {
      return maximizer ? -1 : 1;
    } else if (isBoardFull(board)) {
      return 0;
    }

    if (maximizer) {
      let maxEval = -Infinity;
      for (let i = 0; i < 9; i += 1) {
        if (board[i] === "") {
          board[i] = role;
          const score = minimax(board, i, false, getOppositeRole(role));
          board[i] = "";
          maxEval = Math.max(score, maxEval);
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 9; i += 1) {
        if (board[i] === "") {
          board[i] = role;
          const score = minimax(board, i, true, getOppositeRole(role));
          board[i] = "";
          minEval = Math.min(score, minEval);
        }
      }
      return minEval;
    }
  }
</script>

{#if tie}
  <h2>Tie</h2>
{:else if winLose}
  <h2>{playerRole} wins!</h2>
{/if}
<div class="board">
  <div class="row">
    <Tile
      {gameOver}
      tileSelectHandler={() => selectTile(0)}
      {playerRole}
      {selections}
      tilePosition={0}
    />
    <div class="column top-col" />
    <Tile
      {gameOver}
      tileSelectHandler={() => selectTile(1)}
      {playerRole}
      {selections}
      tilePosition={1}
    />
    <div class="column top-col" />
    <Tile
      {gameOver}
      tileSelectHandler={() => selectTile(2)}
      {playerRole}
      {selections}
      tilePosition={2}
    />
  </div>
  <div class="row-separator" />
  <div class="row">
    <Tile
      {gameOver}
      tileSelectHandler={() => selectTile(3)}
      {playerRole}
      {selections}
      tilePosition={3}
    />
    <div class="column" />
    <Tile
      {gameOver}
      tileSelectHandler={() => selectTile(4)}
      {playerRole}
      {selections}
      tilePosition={4}
    />
    <div class="column" />
    <Tile
      {gameOver}
      tileSelectHandler={() => selectTile(5)}
      {playerRole}
      {selections}
      tilePosition={5}
    />
  </div>
  <div class="row-separator" />
  <div class="row">
    <Tile
      {gameOver}
      tileSelectHandler={() => selectTile(6)}
      {playerRole}
      {selections}
      tilePosition={6}
    />
    <div class="column bot-col" />
    <Tile
      {gameOver}
      tileSelectHandler={() => selectTile(7)}
      {playerRole}
      {selections}
      tilePosition={7}
    />
    <div class="column bot-col" />
    <Tile
      {gameOver}
      tileSelectHandler={() => selectTile(8)}
      {playerRole}
      {selections}
      tilePosition={8}
    />
  </div>
</div>

<style>
  h2 {
    font-size: 36px;
    font-weight: 400;
  }
  .board {
    display: grid;
    grid-template-rows: 1fr 10px 1fr 10px 1fr;
    grid-template-columns: auto;
    width: 500px;
    height: 500px;
    margin: 0 auto;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 10px 1fr 10px 1fr;
  }

  .column {
    background: rgba(239, 204, 210, 1);
    min-width: 10px;
  }

  .row-separator {
    background: rgba(239, 204, 210, 1);
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
