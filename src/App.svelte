<script lang="ts">
  import RoleSelector from "./components/RoleSelector.svelte";
  let showRoles = false;
</script>

<main>

  <h1>Tic Tac Toe</h1>
  <h2 on:click={()=>showRoles = true}>1 player</h2>
  <h2>2 player</h2>

  {#if showRoles}
  <RoleSelector/>
  {/if}

</main>

<style>
</style>
