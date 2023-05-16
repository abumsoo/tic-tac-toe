<div class="board">
  <div class="row">
    <div class="tile" />
    <div class="column top-col" />
    <div class="tile" />
    <div class="column top-col" />
    <div class="tile" />
  </div>
  <div class="row-separator" />
  <div class="row">
    <div class="tile" />
    <div class="column" />
    <div class="tile" />
    <div class="column" />
    <div class="tile" />
  </div>
  <div class="row-separator" />
  <div class="row">
    <div class="tile" />
    <div class="column bot-col" />
    <div class="tile" />
    <div class="column bot-col" />
    <div class="tile" />
  </div>
</div>

<style>
  .board {
    display: grid;
    grid-template-rows: 1fr 10px 1fr 10px 1fr;
    grid-template-columns: auto;
    width: 500px;
    height: 500px;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 10px 1fr 10px 1fr;
  }

  .tile {
    min-width: 100px;
    min-height: 100px;
  }

  .column {
    background-color: red;
    min-width: 10px;
  }

  .row-separator {
    background-color: green;
    min-height: 10px;
    border-radius: 8px;
  }

  .top-col {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .bot-col {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
</style>
