<script lang="ts">
  import RoleSelector from "./components/RoleSelector.svelte";
  import Board from "./components/Board.svelte";
  import Header from "./components/Header.svelte";

  let state: {
    showRoleSelect: boolean;
    showLandingPage: boolean;
    showBoard: boolean;
    playerRole: "X" | "O" | undefined;
  } = {
    showRoleSelect: false,
    showLandingPage: true,
    showBoard: false,
    playerRole: undefined,
  };

  function renderRoleSelect() {
    state.showRoleSelect = true;
    state.showLandingPage = false;
  }
</script>

<Header />
<main>
  {#if state.showLandingPage}
    <h1>Tic Tac Toe</h1>
    <button on:click={renderRoleSelect}><h2>1 player</h2></button>
    <button><h2>2 player</h2></button>
  {/if}

  {#if state.showRoleSelect}
    <RoleSelector bind:state />
  {/if}

  {#if state.showBoard}
    <Board playerRole={state.playerRole} />
  {/if}

  <button on:click={() => console.log(state.playerRole)}>playerRole</button>
</main>

<style>
</style>
