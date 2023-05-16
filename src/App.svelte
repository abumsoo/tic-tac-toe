<script lang="ts">
  import RoleSelector from "./components/RoleSelector.svelte";
  import Board from "./components/Board.svelte";
  import Header from "./components/Header.svelte";

  let displayState = {
    showRoleSelect: false,
    showLandingPage: true,
    showBoard: false,
  };

  let playerRole: "X" | "O" | undefined;

  function renderRoleSelect() {
    displayState.showRoleSelect = true;
    displayState.showLandingPage = false;
  }
</script>

<Header />
<main>
  {#if displayState.showLandingPage}
    <h1>Tic Tac Toe</h1>
    <button on:click={renderRoleSelect}><h2>1 player</h2></button>
    <button><h2>2 player</h2></button>
  {/if}

  {#if displayState.showRoleSelect}
    <RoleSelector bind:role={playerRole} bind:state={displayState} />
  {/if}

  {#if displayState.showBoard}
    {console.log(playerRole)}
    <Board />
  {/if}
</main>

<style>
</style>
