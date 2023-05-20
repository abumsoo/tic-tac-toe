<script>
  export let state;

  function startGame() {
    state.showRoleSelect = false;
    state.showBoard = true;
  }
  function setX() {
    state.playerRole = "X";
    startGame();
  }
  function setO() {
    state.playerRole = "O";
    state.selections[4] = "X";
    startGame();
  }
</script>

<div class="buttons">
  <button on:click={setX}>X</button>
  <button on:click={setO}>O</button>
</div>

<style>
  button {
    width: 160px;
    height: 160px;
    font-size: 128px;
    font-weight: 200;
    border: 4px solid rgba(253, 242, 237, 1);
  }
  .buttons {
    display: flex;
    justify-content: center;
    gap: 160px;
  }
</style>
