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
    startGame();
  }
</script>

<button on:click={setX}>X</button>
<button on:click={setO}>O</button>
