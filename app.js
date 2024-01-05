// Function to toggle the visibility of an element with the id "select"
function toggleHide() {
  var selectDiv = document.getElementById("select");
  selectDiv.style.display = "none"; 
}

// Player constructor function
const Player = (sign) => {
  this.sign = sign;

  const getSign = () => {
    return sign;
  };

  return { getSign };
};

// Module for the game board
const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

// Set the value at a specific index on the board  
  const setField = (index, sign) => {
    if (index > board.length) return;
    board[index] = sign;
  };

 // Get the value at a specific index on the board 
  const getField = (index) => {
    if (index > board.length) return;
    return board[index];
  };

// Reset the entire board 
  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { setField, getField, reset };
})();

// Module for the display controller
const displayController = (() => {
  let gameStarted = false;
  
  const fieldElements = document.querySelectorAll(".field");
  const messageElement = document.getElementById("status");
  const resetButton = document.getElementById("reset");
  const startButton = document.getElementById("start");

  startButton.addEventListener("click", () => {
      gameStarted = true;
      startButton.disabled = true;
      displayController.setMessageElement("Player X's turn");
      document.querySelector(".gameboard").style.display = "grid"; // Show GameBoard
      messageElement.style.display = "block"; // Show status
      resetButton.style.display = "block"; // Show Reset Button     
  });

  fieldElements.forEach((field) =>
      field.addEventListener("click", (e) => {
          if (!gameStarted || gameController.getIsOver() || e.target.textContent !== "") return;
          gameController.playRound(parseInt(e.target.dataset.index));
          updateGameboard();
      })
  );

  resetButton.addEventListener("click", (e) => {
      gameBoard.reset();
      gameController.reset();
      updateGameboard();
      setMessageElement("Player X's turn");
      gameStarted = false;
      startButton.disabled = false;
      document.querySelector(".gameboard").style.display = "none";
      messageElement.style.display = "none"; // Hide status
      resetButton.style.display = "none"; // Hide reset button      
  });

  const updateGameboard = () => {
      for (let i = 0; i < fieldElements.length; i++) {
          fieldElements[i].textContent = gameBoard.getField(i);
      }
  };

  const setResultMessage = (winner) => {
      if (winner === "Draw") {
          setMessageElement("It's a draw!");
      } else {
          setMessageElement(`Player ${winner} has won!`);
      }
  };

  const setMessageElement = (message) => {
      messageElement.textContent = message;
  };

  return { setResultMessage, setMessageElement };
})();

// Module for the game controller
const gameController = (() => {
  const playerX = Player("X");
  const playerO = Player("O");
  let round = 1;
  let isOver = false;

  const playRound = (fieldIndex) => {
      gameBoard.setField(fieldIndex, getCurrentPlayerSign());
      if (checkWinner(fieldIndex)) {
          displayController.setResultMessage(getCurrentPlayerSign());
          isOver = true;
          return;
      }
      if (round === 9) {
          displayController.setResultMessage("Draw");
          isOver = true;
          return;
      }
      round++;
      displayController.setMessageElement(
          `Player ${getCurrentPlayerSign()}'s turn`
      );
  };

  const getCurrentPlayerSign = () => {
      return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
  };

// Function to check if there is a winner  
  const checkWinner = (fieldIndex) => {
      const winConditions = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
      ];

      return winConditions
          .filter((combination) => combination.includes(fieldIndex))
          .some((possibleCombination) =>
              possibleCombination.every(
                  (index) => gameBoard.getField(index) === getCurrentPlayerSign()
              )
          );
  };

  const getIsOver = () => {
      return isOver;
  };

  const reset = () => {
      round = 1;
      isOver = false;
  };

  return { playRound, getIsOver, reset };
})();
