// Gameboard module
const gameboard = (function () {
  let _gameboard = ['','','','','','','','',''];

  let lastTurn = 'O';

  const getGameboard = () => _gameboard;

  const isFull = () => {
    return _gameboard.reduce((bool, value) => {
      return (bool && !isEmpty(value));
    }, true);
  }

  const checkRow = (index) => {
    let rowIndex = Math.floor(index/3)*3;
    if (_gameboard[rowIndex] === _gameboard[rowIndex+1] &&
        _gameboard[rowIndex] === _gameboard[rowIndex+2]) {
      return true;
    }
    return false;
  };

  const checkCol = (index) => {
    let colIndex = index % 3;
    if (_gameboard[colIndex] === _gameboard[colIndex+3] &&
        _gameboard[colIndex] === _gameboard[colIndex+6]) {
      return true;
    }
    return false;
  };

  const checkDiag = (index) => {
    // check top left to bottom right
    if (index == 0 || index == 8) {
      return (_gameboard[0] === _gameboard[4]) &&
        (_gameboard[0] === _gameboard[8])
    } else if (index == 6 || index == 2) {
      return (_gameboard[6] === _gameboard[4]) &&
        (_gameboard[2] === _gameboard[4])
    } else if (index == 4) {
      return ((_gameboard[0] === _gameboard[4]) &&
              (_gameboard[0] === _gameboard[8])) ||
        ((_gameboard[6] === _gameboard[4]) &&
         (_gameboard[2] === _gameboard[4]))
    }
    return false;
  };

  const isGameover = (index) => {
    if (isFull()) {
      return true;
    }
    if (index % 2 !== 0) {
      return checkRow(index) || checkCol(index);
    } else {
      return checkRow(index) || checkCol(index) || checkDiag(index);
    }
  };

  const isEmpty = (value) => {
    return !(value || value.length);
  }

  const restart = () => {
    removeListeners();
    addListeners();
    _gameboard = _gameboard.map(cell => '');
    document.querySelector(".game-over").textContent='';
    flowControl.render();
  };

  const setCell = (e) => {
    let index = e.target.getAttribute("data-index");
    if (isEmpty(_gameboard[index])) {
      if (lastTurn === 'X') {
        _gameboard[index] = 'O';
      } else {
        _gameboard[index] = 'X';
      }
      lastTurn = _gameboard[index];
      flowControl.render();
      if (isGameover(index)) {
        const text = document.createElement('p');
        text.setAttribute("class", "game-over");
        text.textContent = "Game over!";
        document.querySelector(".text-container").appendChild(text);
        flowControl.exit();
      }
    }
  };

  const addListeners = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => cell.addEventListener('click', setCell));
  };

  const removeListeners = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => cell.removeEventListener('click', setCell));
  };

  return {
    getGameboard,
    addListeners,
    removeListeners,
    restart
  }
})();

// player factory
const Player = (name) => {
  let _name = name || "Joe";
  return {

  }
};

const flowControl = (function () {
  const init = () => {
    addMainListeners();
    render();
  };

  const addMainListeners = () => {
    const startBtn = document.querySelector(".start");
    startBtn.addEventListener('click', gameboard.addListeners);
    const restartBtn = document.querySelector(".restart");
    restartBtn.addEventListener('click', gameboard.restart);
  };

  const render = () => {
    const cells = document.querySelectorAll(".cell");
    for (let i = 0; i < cells.length; i++) {
      cells[i].innerHTML = gameboard.getGameboard()[i];
    }
  }

  const exit = () => {
    gameboard.removeListeners();
  };

  return {
    init,
    exit,
    render
  }
})();

flowControl.init();
