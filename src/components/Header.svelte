<script>
  export let state;
</script>

<header>
  <button
    on:click={() => {
      state.showLandingPage = true;
      state.showBoard = false;
      state.showRoleSelect = false;
    }}>Main Menu</button
  >
  <button
    on:click={() => {
      state.selections = new Array(9).fill("");
    }}>Restart</button
  >
</header>
