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
  let _next = next;

  const getName = () => { return _name; };
  const getRole = () => { return _role; };
  const isNext = () => { return _next; };
  const toggleNext = () => { _next = !_next; };

  const action = (e) => {
    const index = Number(e.target.getAttribute('data-index'));

    // check if the opponent is a bot at the end player's action

    // update boardArray
    gameboard.updateBoard(index, player.getRole());
    // update player states
    _p1.toggleNext();
    _p2.toggleNext();

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
    } else if (_p1.isBot() || _p2.isBot()){
      if (_p1.isNext()) {
        player = _p1;
      } else if (_p2.isNext()){
        player = _p2;
      }
      _botAction(player);
    }
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
    action
  }
};

const Bot = (name, role, next) => {
  const prototype = Player(name, role, next);
  const action = () => {
    flow.botAction();
  }
  return Object.assign({}, prototype, {

  });
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
    cells.forEach(cell => cell.addEventListener('click', flow.playerAction));
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
    indexEmpty
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

  const _minimax = (bot, index) => {
    // input index, board
    // base case: max wins, tie, min wins = 1, 0, or -1
    if (bot.isWinner(index)) {
      return 1;
    }
    else if (gameboard.isBoardFull()) {
      return 0;
    }
    // if it's a minimizer get the lowest score of its children
    // // if scores aren't available, recurse into that node
    // if it's a maximizer get the highest score of its children
    // // if scores aren't available, recurse into that node
  }

  const botAction = (bot) => {
    // tick a random cell that isn't already taken
    let index = Math.floor(Math.random()*9);
    while (!gameboard.indexEmpty(index)) {
      index = Math.floor(Math.random()*9);
    }

    // go through each empty index
    // get the minimax score of each
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (gameboard.indexEmpty(i)) {
        let score = minimax();

      }
    }
    gameboard.updateBoard(index, bot.getRole());
    // toggle next on both players
    _p1.toggleNext();
    _p2.toggleNext();

    gameboard.renderBoard();

    // if the game is over render game over message
    if (bot.isWinner(index)) {
      gameboard.removeListeners();
      let name = bot.getName();
      const message = document.createElement('div');
      message.textContent = `${name} is the winner!`;
      document.querySelector('.container').appendChild(message);
    } else if (gameboard.isBoardFull()) {
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

    // reset players
    if (document.getElementById('bot1').checked) {
      _p1 = Bot(document.getElementById('p1').value, 'O', true);
      // if _p1 is a bot, then start the bot
      _p1.action();
    } else {
      _p1 = Player(document.getElementById('p1').value, 'O', true);
    }
    if (document.getElementById('bot2').checked) {
      _p2 = Bot(document.getElementById('p2').value, 'X', false);
    } else {
      _p2 = Player(document.getElementById('p2').value, 'X', false);
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

  const playerAction = (e) => {
    const index = Number(e.target.getAttribute('data-index'));

    // bot always goes right after real player goes
    // check if the opponent is a bot at the end player's action

    // listener invokes flow.action

    let player = {};
    if (_p1.isNext()) {
      player = _p1;
    } else if (_p2.isNext()){
      player = _p2;
    }
    // player.action(e);
    // update boardArray
    gameboard.updateBoard(index, player.getRole());
    // update player states
    _p1.toggleNext();
    _p2.toggleNext();

    gameboard.renderBoard();

    // cell event listener calls player action
    // player action calls bot action if the next player is a bot
    // if it's not a bot, nothing happens

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
    } else {
      // if the next turn is a bot's turn, then call bot action
      // instead of using isBot, just call action on player
      if (_p1.isNext()) {
        player = _p1;
      } else if (_p2.isNext()){
        player = _p2;
      }
      if (player.isBot()) {
        _botAction(player);
      }
    }
  }

  return {
    init,
    playerAction,
    botAction
  }
})();

flow.init();
