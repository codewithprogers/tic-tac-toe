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

    if (selectedCell.getValue() !== "") return;

    selectedCell.addMarker(player);
  };

  return {
    getBoard,
    placeMarker,
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