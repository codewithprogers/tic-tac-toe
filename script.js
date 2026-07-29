function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeMarker = (chosenRow, chosenColumn, player) => {
    const selectedCell = board[chosenRow][chosenColumn];

    if (selectedCell.getValue() !== "") return false;

    selectedCell.addMarker(player);
    return true;
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue()),
    );
    console.log(boardWithCellValues);
  };

  return {
    getBoard,
    placeMarker,
    printBoard,
  };
}

function Cell() {
  let value = "";

  const addMarker = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addMarker,
    getValue,
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two",
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      marker: "X",
    },
    {
      name: playerTwoName,
      marker: "O",
    },
  ];

  let activePlayer = players[0];
  let gameIsOver = false;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const getBoard = () => board.getBoard();

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    if (gameIsOver) {
      console.log("This game has ended.");
      return;
    }

    console.log(
      `Placing ${getActivePlayer().name}'s marker into row ${row}, column ${column}.`,
    );
    const moveWasSuccessful = board.placeMarker(
      row,
      column,
      getActivePlayer().marker,
    );

    if (!moveWasSuccessful) {
      console.log("That spot is already taken.");
      return;
    }

    // Check for a winner or tie after a successful move.
    const marker = getActivePlayer().marker;
    const currentBoard = board.getBoard();

    const winPossibilities = [
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],

      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],

      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
    ];

    for (let i = 0; i < winPossibilities.length; i++) {
      const currentPossibility = winPossibilities[i];
      let thisPossibilityMatches = true;

      for (let j = 0; j < currentPossibility.length; j++) {
        const coordinate = currentPossibility[j];
        const boardValue = currentBoard[coordinate[0]][coordinate[1]].getValue();

        if (boardValue !== marker) {
          thisPossibilityMatches = false;
          break;
        }
      }

      if (thisPossibilityMatches) {
        board.printBoard();
        console.log(`${getActivePlayer().name} wins!`);
        gameIsOver = true;
        return;
      }
    }

    let boardIsFull = true;

    for (let i = 0; i < currentBoard.length; i++) {
      for (let j = 0; j < currentBoard[i].length; j++) {
        if (currentBoard[i][j].getValue() === "") {
          boardIsFull = false;
          break;
        }
      }
      
      if (!boardIsFull) {
        break;
      }
    }

    if (boardIsFull) {
      board.printBoard();
      console.log("No winning combination. This game is a tie.");
      gameIsOver = true;
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard,
  };
}

function screenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const cellElements = document.querySelectorAll(".game-cell");

  const updateScreen = () => {
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.marker}'s Turn`;

    for (let i = 0; i < cellElements.length; i++) {
      const cell = cellElements[i];

      const row = Number(cell.dataset.row);
      const column = Number(cell.dataset.column);

      cell.textContent = board[row][column].getValue();
    }
  };

  const clickCell = (event) => {
    const selectedCell = event.target;

    const row = Number(selectedCell.dataset.row);
    const column = Number(selectedCell.dataset.column);
    
    game.playRound(row, column);
    updateScreen();
  };

  cellElements.forEach((cell) => {
    cell.addEventListener("click", clickCell);
  });

  updateScreen();
}

screenController();