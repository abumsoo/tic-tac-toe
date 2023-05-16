<script>
  export let role;
  export let state;

  function setX() {
    role = "X";
    state.showRoleSelect = false;
    state.showBoard = true;
  }
  function setO() {
    role = "O";
    state.showRoleSelect = false;
    state.showBoard = true;
  }
</script>

<button on:click={setX}>X</button>
<button on:click={setO}>O</button>
