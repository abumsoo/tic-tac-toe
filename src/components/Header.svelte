<script>
  import { gameTie, gameWin } from "../store";

  export let state;
</script>

<header>
  <button
    on:click={() => {
      // unset playerRole
      state.playerRole = undefined;
      // reset gameOver and tie variables to false
      // remove the game end message
      gameTie.set(false);
      gameWin.set(false);
      // go back to landing page
      state.showLandingPage = true;
      state.showBoard = false;
      state.showRoleSelect = false;
      // clear the board
      state.selections = new Array(9).fill("");
    }}>Main Menu</button
  >
  <button
    on:click={() => {
      // reset gameOver and tie variables to false
      // remove the game end message
      gameTie.set(false);
      gameWin.set(false);
      // clear the board
      state.selections = new Array(9).fill("");
    }}>Restart</button
  >
</header>
