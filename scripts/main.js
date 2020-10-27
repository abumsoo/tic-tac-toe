  // draw the board
(function() {
  const board = document.querySelector('.board');
  for (let i = 0; i < 9; i++) {
    let cell = document.createElement("div");
    cell.setAttribute("data-index", i);
    cell.className = "grid-item";
    board.appendChild(cell);
  }
})();

// player factory
const Player = (name, role, next) => {
  const _name = name;
  const _role = role;
  const _playerType = 'player';
  let _next = next;

  const getName = () => { return _name; };
  const getRole = () => { return _role; };
  const getPlayerType = () => _playerType;
  const isNext = () => { return _next; };
  const toggleNext = () => { _next = !_next; };

  const isWinner = (index) => {
    return (
      // check row
      gameboard.checkRow(index) ||
      // check col
      gameboard.checkCol(index) ||
      // check diags
      gameboard.checkDiags(index)
    );
  };

  return {
    getName,
    getRole,
    isNext,
    toggleNext,
    isWinner,
    getPlayerType
  }
};

const Bot = (name, role, next) => {
  const prototype = Player(name, role, next);
  const _playerType = 'bot';
  const getPlayerType = () => _playerType;

  // If bot goes first, then bot's action is called from flow
  // if we just keep all the actions within the flow
  // o/w bot gets called from player's turn listener

  return Object.assign({}, prototype, { getPlayerType });
};

const gameboard = (() => {

  let _boardArray = [
    "","","",
    "","","",
    "","",""
  ];

  const getBoard = () => _boardArray;

  const renderBoard = () => {
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
    _boardArray[index] = role;
  }

  const resetCell = (index) => {
    _boardArray[index] = "";
  }

  const checkRow = (index) => {
    let row = Math.floor(index/3);
    for (let i = 0; i < 3; i++) {
      if (_boardArray[index] !== _boardArray[row*3+i]) {
        return false;
      }
    }
    return true;
  }

  const checkCol = (index) => {
    let col = index % 3;
    for (let i = 0; i < 3; i++) {
      if (_boardArray[index] !== _boardArray[col+3*i]) {
        return false;
      }
    }
    return true;
  }

  const checkDiags = (index) => {
    const leftRightTopBot = () => {
      for (let i = 0; i < 3; i++) {
        if (_boardArray[index] !== _boardArray[i+3*i]) {
          return false;
        }
      }
      return true;
    };

    // 6 4 2
    const leftRightBotTop = () => {
      for (let i = 2; i >= 0; i--) {
        if (_boardArray[index] !== _boardArray[2*i+2]) {
          return false;
        }
      }
      return true;
    }
    // if it's the middle check both diags
    //
    if (index === 4) {
      return (leftRightTopBot() || leftRightBotTop());
    } else if (index % 2 === 0) {
      if (index % 8 === 0) {
        return leftRightTopBot();
      } else {
        return leftRightBotTop();
      }
    } else {
      return false;
    }
  }

  const isBoardFull = () => {
    for (let i = 0; i < _boardArray.length; i++) {
      if (_boardArray[i] === "") {
        return false;
      }
    }
    return true;
  }

  const indexEmpty = (index) => {
    if (_boardArray[index] === "") {
      return true;
    } else {
      return false;
    }
  }

  const removeListeners = () => {
    const cells = document.querySelectorAll('.grid-item');
    cells.forEach(cell => cell.removeEventListener('click', flow.action));
  }

  const clearBoard = () => {
    const cells = document.querySelectorAll('.grid-item');
    for (let i = 0; i < _boardArray.length; i++) {
      _boardArray[i] = "";
      cells[i].textContent = _boardArray[i];
    }
  }

  return {
    renderBoard,
    addListeners,
    updateBoard,
    checkRow,
    checkCol,
    checkDiags,
    isBoardFull,
    removeListeners,
    clearBoard,
    indexEmpty,
    resetCell,
    getBoard
  }
})();

const flow = (() => {
  const init = () => {
    _addMainListeners();
  }

  // initialize empty players
  let _p1 = {};
  let _p2 = {};

  const _addMainListeners = () => {
    const singlePlayerBtn = document.getElementById('single-btn');
    singlePlayerBtn.addEventListener('click', startSinglePlayer);
    const multiPlayerBtn = document.getElementById('multi-btn');
    multiPlayerBtn.addEventListener('click', startMultiPlayer);
  }

  const startMultiPlayer = () => {
    document.querySelector(".main-menu").style.display = "none";
    document.querySelector(".name-menu-multi").style.display = "flex";
    const p1 = document.getElementById("p1");
    const p2 = document.getElementById("p2");
    const beginBtn = document.getElementById('begin-btn');
    beginBtn.addEventListener('click', () => {
      p1.readOnly = true;
      p2.readOnly = true;
      _p1 = Player(p1.value, "X", true);
      _p2 = Player(p2.value, "O", false);
      _startGame();
    });
  }

  const startSinglePlayer = () => {
    const mainMenu = document.querySelector(".main-menu");
    mainMenu.style.display = "none";
    document.querySelector(".name-menu").style.display = "flex";
    const nameInput = document.getElementById("name");
    const continueBtn = document.getElementById('continue-btn');
    continueBtn.addEventListener('click', () => {
      // set _p1 data values
      roleSelect(nameInput.value);
    });
  }

  const roleSelect = (name) => {
    document.querySelector(".name-menu").style.display = "none";
    document.querySelector(".role-menu").style.display = "flex";
    const x = document.getElementById("xrole");
    x.addEventListener('click', () => {
      _p1 = Player(name, "X", true);
      _p2 = Bot("ai", "O", false);
      _startGame();
    });
    const o = document.getElementById("orole");
    o.addEventListener('click', () => {
      _p1 = Bot("ai", "X", true);
      _p2 = Player(name, "O", false);
      _startGame();
    });
  }

  const _startGame = () => {
    document.querySelector(".role-menu").style.display = "none";
    const board = document.querySelector(".board");
    board.style.display = "grid";

    // set players
    if (_p1.getPlayerType() === 'bot') {
      gameboard.removeListeners();
      setTimeout(botAction, 650, _p1, _p2);
    } else {
      // start board cell listeners
      gameboard.addListeners();
    }

  }


  const action = (e) => {
    const index = Number(e.target.getAttribute('data-index'));
    let currPlayer = {};
    let nextPlayer = {};
    if (_p1.isNext()) {
      currPlayer = _p1;
      nextPlayer = _p2;
    } else if (_p2.isNext()){
      currPlayer = _p2;
      nextPlayer = _p1;
    }

    _playerAction(index, currPlayer, nextPlayer);
  };

  const showWinner = (player) => {
    gameboard.removeListeners();
    let name = player.getName();
    const message = document.getElementById("gg-message");
    message.textContent = `${name} is the winner!`;
  }

  const showTie = () => {
    gameboard.removeListeners();
    const message = document.getElementById("gg-message");
    message.textContent = "Tie!";
  }

  const restartGame = () => {
    // moving draw board stuff
    // clear the board
    gameboard.clearBoard();
    toggleRestartBtn();
    toggleNewGameBtn();

    if (_p1.getPlayerType() === 'bot') {
      gameboard.removeListeners();
      setTimeout(botAction, 650, _p1, _p2);
    } else {
      gameboard.addListeners();
    }

  }

  const _playerAction = (index, player, nextPlayer) => {

    // update boardArray
    if (gameboard.indexEmpty(index)) {
      gameboard.updateBoard(index, player.getRole());
    } else {
      return;
    }
    // toggle next on both players
    if (player.isNext()) {
      player.toggleNext();
    }
    if (!nextPlayer.isNext()) {
      nextPlayer.toggleNext();
    }

    gameboard.renderBoard();

    // if the game is over render game over message
    if (player.isWinner(index)) {
      if (!_p1.isNext()) {
        _p1.toggleNext();
      }
      if (_p2.isNext()) {
        _p2.toggleNext();
      }
      showWinner(player);
      toggleRestartBtn();
      toggleNewGameBtn();
    } else if (gameboard.isBoardFull()) {
      if (!_p1.isNext()) {
        _p1.toggleNext();
      }
      if (_p2.isNext()) {
        _p2.toggleNext();
      }
      showTie();
      toggleRestartBtn();
      toggleNewGameBtn();
    } else if (nextPlayer.getPlayerType() === 'bot') {
      gameboard.removeListeners();
      setTimeout(botAction, 650, nextPlayer, player);
    }
  };

  const toggleRestartBtn = () => {
      const restartBtn = document.getElementById("restart-btn");
      if (restartBtn.style.display == "inline-block") {
        restartBtn.style.display = "none";
        restartBtn.removeEventListener('click', restartGame);
      } else {
        restartBtn.style.display = "inline-block";
        restartBtn.addEventListener('click', restartGame);
      }
  }

  const toggleNewGameBtn = () => {
      const newGameBtn = document.getElementById("new-game-btn");
      if (newGameBtn.style.display == "inline-block") {
        newGameBtn.style.display = "none";
        newGameBtn.removeEventListener('click', startNewGame);
      } else {
        newGameBtn.style.display = "inline-block";
        newGameBtn.addEventListener('click', startNewGame);
      }
  }

  const startNewGame = () => {
    gameboard.clearBoard();
    gameboard.removeListeners();
    toggleRestartBtn();
    toggleNewGameBtn();
    document.getElementById('gg-message').innerText = "";
    document.getElementById('p1').value = "";
    document.getElementById('p1').readOnly = false;
    document.getElementById('p2').value = "";
    document.getElementById('p2').readOnly = false;
    document.getElementById('name').value = "";
    document.querySelector('.name-menu-multi').style.display = "none";
    document.querySelector('.board').style.display = "none";
    document.querySelector('.main-menu').style.display = "block";
  };

  //player action calls botAction
  const botAction = (bot, human) => {
    let bestScore = -Infinity;
    let moveIndex = null;
    let index = null;
    let indexHash = {};
    // loop through each index in the board
    do {
      index = Math.floor(Math.random()*9);
      if (!(index in indexHash)) {
        // check if the cell is empty
        if (gameboard.indexEmpty(index)) {
          // fill the cell with the correct role
          gameboard.updateBoard(index, bot.getRole());
          // call minimax to get the score of each index
          let score = minimax(index, human, bot, false);
          // reset the cell
          gameboard.resetCell(index);
          // store the best score of those scores as well as its index
          if (score > bestScore) {
            bestScore = score;
            moveIndex = index;
          }
        }
        indexHash[index] = 0;
      }
    } while (Object.keys(indexHash).length < 9);

    // use the new index to fill the corresponding cell
    gameboard.updateBoard(moveIndex, bot.getRole());

    // render the board
    gameboard.renderBoard();
    
    // toggle who's next
    _p1.toggleNext();
    _p2.toggleNext();

    if (bot.isWinner(moveIndex)) {
      if (!_p1.isNext()) {
        _p1.toggleNext();
      }
      if (_p2.isNext()) {
        _p2.toggleNext();
      }
      showWinner(bot);
      toggleRestartBtn();
      toggleNewGameBtn();
    } else if (gameboard.isBoardFull()) {
      if (!_p1.isNext()) {
        _p1.toggleNext();
      }
      if (_p2.isNext()) {
        _p2.toggleNext();
      }
      showTie();
      toggleRestartBtn();
      toggleNewGameBtn();
    } else {
      gameboard.addListeners();
    }
  }

  const minimax = (index, currPlayer, nextPlayer, maximizing) => {
    // base cases
    if (currPlayer.isWinner(index)) {
      return maximizing ? -1 : 1;
    } else if (gameboard.isBoardFull()) {
      return 0;
    }

    if (maximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (gameboard.indexEmpty(i)) {
          gameboard.updateBoard(i, currPlayer.getRole());
          let score = minimax(i, nextPlayer, currPlayer, false);
          gameboard.resetCell(i);
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (gameboard.indexEmpty(i)) {
          gameboard.updateBoard(i, currPlayer.getRole());
          let score = minimax(i, nextPlayer, currPlayer, true);
          gameboard.resetCell(i);
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  return {
    init,
    action
  }
})();

flow.init();