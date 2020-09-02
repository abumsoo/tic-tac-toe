// gameboard module
const gameBoard = (function() {
  let _gameboard = [
    "X","O","X",
    "O", "X", "O",
    "O", "X", "O"
  ];

  function getGameboard() {
    return _gameboard;
  }

  return {
    getGameboard
  };
})();

// game flow display module
const displayController = (function () {

  let drawBoard = (gameboard) => {
    let cells = document.querySelectorAll(".cell");
    for (let i = 0; i < 9; i++) {
      cells[i].innerHTML = gameboard[i];
    }
  };

  return {
    drawBoard
  };
})();

// player factory func
const Player = () => {

  return {

  };
};

let gameboard = gameBoard.getGameboard();
displayController.drawBoard(gameboard);
