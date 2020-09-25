(function() {
  const board = document.querySelector('.board');
  for (let i = 0; i < 9; i++) {
    let cell = document.createElement("div");
    cell.setAttribute("data-index", i);
    cell.className = "grid-item";
    board.appendChild(cell);
  }
})();

const Player = (name, role, next) => {
  const _name = name;
  const _role = role;
  let _next = next;

  const getRole = () => { return _role; };
  const isNext = () => { return _next; };
  const toggleNext = () => { _next = !_next; };

  return {
    getRole,
    isNext,
    toggleNext,
  }
};

const gameboard = (() => {

  let _boardArray = [
    "","","",
    "","","",
    "","",""
  ];

  const render = () => {
    const cells = document.querySelectorAll('.grid-item');
    for (let i = 0; i < _boardArray.length; i++) {
      cells[i].textContent = _boardArray[i];
    }
  }

  const addListeners = () => {
    const cells = document.querySelectorAll('.grid-item');
    /* When you click on a cell
     * * update the board array
     * * render the new board
     * * check if the game is over or not
     */
    cells.forEach(cell => cell.addEventListener('click', flow.action));
  }

  const updateBoard = (index, role) => {
    if (_boardArray[index] === "") {
      _boardArray[index] = role;
    } else {
      throw "That cell already has a value";
    }
  }

  return {
    render,
    addListeners,
    updateBoard
  }
})();

const flow = (() => {
  const init = () => {
    gameboard.render();
    gameboard.addListeners();
  }

  const _p1 = Player(document.getElementById('p1').value, 'O', true);
  const _p2 = Player(document.getElementById('p2').value, 'X', false);

  // update boardArray
  // update player states
  // check if the game is over
  const action = (e) => {
    const index = Number(e.target.getAttribute('data-index'));

    const _helper = (player) => {
      try {
        gameboard.updateBoard(index, player.getRole());
      }
      catch(err) {
        return err;
      }
      _p1.toggleNext();
      _p2.toggleNext();
    };

    if (_p1.isNext()) {
      _helper(_p1);
    } else if (_p2.isNext()) {
      _helper(_p2);
    }

    gameboard.render();
  }

  const getGameState = () => {
    // check if the board is full
    gameboard.isBoardFull();
    // check if the last move won the game
    gameboard.
  }

  return {
    init,
    action
  }
})();

flow.init();
