<script lang="ts">
  import RoleSelector from "./components/RoleSelector.svelte";
  import Board from "./components/Board.svelte";
  import Header from "./components/Header.svelte";

  let state: {
    showRoleSelect: boolean;
    showLandingPage: boolean;
    showBoard: boolean;
    playerRole: "X" | "O" | undefined;
    mode: "single" | "multi" | undefined;
    selections: string[];
  } = {
    showRoleSelect: false,
    showLandingPage: true,
    showBoard: false,
    playerRole: undefined,
    mode: undefined,
    selections: new Array(9).fill(""),
  };

  function startSinglePlayer() {
    state.mode = "single";
    state.showLandingPage = false;
    state.showRoleSelect = true;
  }

  function start2Player() {
    state.mode = "multi";
    state.showLandingPage = false;
    state.showBoard = true;
    state.playerRole = "X";
  }
</script>

<Header />
<main>
  {#if state.showLandingPage}
    <h1>Tic Tac Toe</h1>
    <button on:click={startSinglePlayer}><h2>1 player</h2></button>
    <button on:click={start2Player}><h2>2 player</h2></button>
  {/if}

  {#if state.showRoleSelect}
    <RoleSelector bind:state />
  {/if}

  {#if state.showBoard}
    <Board
      playerRole={state.playerRole}
      mode={state.mode}
      selections={state.selections}
    />
  {/if}
</main>

<style>
</style>
