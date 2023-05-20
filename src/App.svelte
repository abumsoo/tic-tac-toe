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

<Header {state} />
<main>
  {#if state.showLandingPage}
    <h1>Tic Tac Toe</h1>
    <div class="buttons">
      <button on:click={startSinglePlayer}>1 player</button>
      <button on:click={start2Player}>2 player</button>
    </div>
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
  main {
    text-align: center;
  }
  h1 {
    font-size: 72px;
  }
  button {
    width: 300px;
    height: 40px;
    font-size: 24px;
    background: #2a5965;
    border: 2px solid rgba(253, 242, 237, 1);
    border-radius: 5px;
    color: rgba(253, 242, 237, 1);
  }
  button:hover {
    cursor: pointer;
    background: rgba(62, 89, 101);
  }
  .buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
</style>
