// TODO: Bot/player organization. Is bot a subclass of player?
// TODO: AI logic - minimax
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

  const playerAction = (e) => {
  }

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
    playerAction,
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
    try {
      if (_boardArray[index] === "") {
        _boardArray[index] = role;
      } else {
        throw "That cell already has a value";
      }
    } catch(err) {
      return err;
    }
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
    resetCell
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
    const start = document.getElementById('start-btn');
    start.addEventListener('click', _gameStart);
    const botO = document.getElementById('bot1');
    botO.addEventListener('click', toggleBot);
    const botX = document.getElementById('bot2');
    botX.addEventListener('click', toggleBot);
  }

  const toggleBot = (e) => {
    if (e.target.checked) {
      if (e.target.id === 'bot1') {
        const p1Field = document.querySelector('#p1');
        p1Field.value = 'Bot O'
        p1Field.readOnly = true;
      } else {
        const p2Field = document.querySelector('#p2');
        p2Field.value = 'Bot X'
        p2Field.readOnly = true;
      }
      // blank out player name field
      //
    } else {
      if (e.target.id === 'bot1') {
        const p1Field = document.querySelector('#p1');
        p1Field.value = ''
        p1Field.readOnly = false;
      } else {
        const p2Field = document.querySelector('#p2');
        p2Field.value = ''
        p2Field.readOnly = false;
      }
    }
  }

  const _toggleStartRestart = (btn) => {
    if (btn.id === "start-btn") {
      btn.value = "Restart"
      btn.id = "restart-btn"
      btn.removeEventListener('click', _gameStart);
      btn.addEventListener('click', _gameRestart);
    } else if (btn.id === "restart-btn") {
      btn.value = "Start"
      btn.id = "start-btn"
      btn.removeEventListener('click', _gameRestart);
      btn.addEventListener('click', _gameStart);
    }
  }

  const _toggleReadOnly = () => {
    const inputFields = document.querySelectorAll('.input');
    inputFields.forEach(input => input.readOnly = !(input.readOnly));
  }

  const _minimax = (index, currPlayer, nextPlayer, maximizer) => {
    // determine if it's X's or O's turn

    // base case: max wins, tie, min wins = 1, 0, or -1
    if (currPlayer.isWinner(index)) {
      return (maximizer ? 1 : -1);
    }
    if (gameboard.isBoardFull()) {
      return 0;
    }
      // if it's a minimizer get the lowest score of its children
      // // if scores aren't available, recurse into that node
      // if it's a maximizer get the highest score of its children
      // // if scores aren't available, recurse into that node
    if (maximizer) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (gameboard.indexEmpty(i)) {
          gameboard.updateBoard(i, currPlayer.getRole());
          let score = _minimax(i, nextPlayer, currPlayer, false);
          gameboard.resetCell(i);
          bestScore = Math.max(bestScore, score);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (gameboard.indexEmpty(i)) {
          gameboard.updateBoard(i, currPlayer.getRole());
          let score = _minimax(i, nextPlayer, currPlayer, true);
          gameboard.resetCell(i);
          bestScore = Math.min(bestScore, score);
        }
      }
      return bestScore;
    }
  }

  const botAction = () => {

    let currPlayer = {};
    let nextPlayer = {};
    if (_p1.isNext()) {
      currPlayer = _p1;
      nextPlayer = _p2;
    } else if (_p2.isNext()){
      currPlayer = _p2;
      nextPlayer = _p1;
    }
    // tick a random cell that isn't already taken
    // while there are still indices to check, call minimax on them
    // go through each empty index
    // get the minimax score of each
    let bestScore = -Infinity;
    let index = -1;
    for (let i = 0; i < 9; i++) {
      if (gameboard.indexEmpty(i)) {
        console.log('index', i);
        gameboard.updateBoard(i, currPlayer.getRole());
        let score = _minimax(i, currPlayer, nextPlayer, false);
        gameboard.resetCell(i);
        console.log(score);
        if (score > bestScore) {
          bestScore = score;
          index = i;
        }
      }
    }

    gameboard.updateBoard(index, currPlayer.getRole());
    // toggle next on both players
    _p1.toggleNext();
    _p2.toggleNext();
    // if (currPlayer.isNext()) {
    //   currPlayer.toggleNext();
    // }
    // if (!nextPlayer.isNext()) {
    //   nextPlayer.toggleNext();
    // }

    gameboard.renderBoard();

    // if the game is over render game over message
    // TODO: Put these into functions for something like
    // if (gameOver)
    // render game over
    if (currPlayer.isWinner(index)) {
      gameboard.removeListeners();
      let name = currPlayer.getName();
      const message = document.createElement('div');
      message.textContent = `${name} is the winner!`;
      document.querySelector('.container').appendChild(message);
    } else if (gameboard.isBoardFull()) {
      gameboard.removeListeners();
      const message = document.createElement('div');
      message.textContent = `Tie!`;
      document.querySelector('.container').appendChild(message);
    }
  }

  const _gameStart = () => {

    // blank out all input fields
    _toggleReadOnly();
    //  turn start into restart
    const btn = document.getElementById('start-btn');
    _toggleStartRestart(btn);

    // set players
    if (document.getElementById('bot1').checked) {
      _p1 = Bot(document.getElementById('p1').value, 'O', true);
    } else {
      _p1 = Player(document.getElementById('p1').value, 'O', true);
    }
    if (document.getElementById('bot2').checked) {
      _p2 = Bot(document.getElementById('p2').value, 'X', false);
    } else {
      _p2 = Player(document.getElementById('p2').value, 'X', false);
    }
    if (_p1.getPlayerType() === 'bot') {
      botAction();
    }

    // start board cell listeners
    gameboard.addListeners();
  }

  const _gameRestart = () => {
    // clear the board
    gameboard.clearBoard();
    // change btn back to start
    const btn = document.getElementById('restart-btn');
    _toggleStartRestart(btn);
    // unblank input fields
    _toggleReadOnly();
    gameboard.removeListeners();
  }

  const action = (e) => {
    const index = Number(e.target.getAttribute('data-index'));
    // flow.action is called from the cells event listener
    // flow.action differentiates between a player and a bot
    // the problem lies in the player calling the bot action
    // so flow.action should handle that logic
    // flow.action {
    //    check who's next
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
    //    we know that the one that's next is a player
    //    we need to check if the other one is a bot or a player
    //    if it's a player do nothing. If it's a bot, call bot.action
    //    check by calling the function botAction
    // }
  };

  const _playerAction = (index, player, nextPlayer) => {

    // update boardArray
    gameboard.updateBoard(index, player.getRole());
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
      gameboard.removeListeners();
      let name = player.getName();
      const message = document.createElement('div');
      message.textContent = `${name} is the winner!`;
      document.querySelector('.container').appendChild(message);
    } else if (gameboard.isBoardFull()) {
      const message = document.createElement('div');
      message.textContent = `Tie!`;
      document.querySelector('.container').appendChild(message);
    }
    // if it's not a bot, nothing happens
    if (nextPlayer.getPlayerType() === 'bot') {
      console.log('bot action');
      botAction();
    }
  };

  return {
    init,
    botAction,
    action
  }
})();

flow.init();
