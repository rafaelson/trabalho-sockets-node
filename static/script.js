let socket = io();
let currentPlayer;

socket.on("player", (msg) => {
  currentPlayer = msg.player;
  console.log(currentPlayer);
});

socket.on("boardUpdate", (b) => updateBoard(b));

function updateBoard(board) {
  const squares = document.querySelectorAll(".square");
  squares.forEach((sq, index) => (sq.textContent = board[index]));
}

// const player = function () {
//   let score = 0;
//   return { score };
// };

// const game = (function () {
//   let board = [];
//   let count = 0;
//   let player1 = player();
//   let player2 = player();
//   let lastWinner;

//   const move = function (location) {
//     if (count % 2 == 0) {
//       displayController.changeSquare(location, "X");
//       board[location.dataset.number] = "X";
//     } else {
//       displayController.changeSquare(location, "O");
//       board[location.dataset.number] = "O";
//     }
//     count++;
//     checkBoard();
//   };

//   const checkBoard = function () {
//     if (
//       diagonalChecks() == 1 ||
//       horizontalChecks() == 1 ||
//       verticalChecks() == 1
//     ) {
//       if (lastWinner == "X") {
//         player1.score++;
//       } else {
//         player2.score++;
//       }
//       setTimeout(() => {
//         displayController.updateScore();
//         cleanBoard();
//       }, 100);
//     } else {
//       if (count == 9) {
//         setTimeout(cleanBoard, 300);
//       }
//     }
//   };

//   const verticalChecks = function () {
//     for (i = 0; i <= 3; i++) {
//       if (
//         board[i] == board[i + 3] &&
//         board[i + 3] == board[i + 6] &&
//         board[i] != undefined
//       ) {
//         lastWinner = board[i];
//         return 1;
//       }
//     }
//   };

//   const horizontalChecks = function () {
//     for (i = 0; i <= 6; i += 3) {
//       if (
//         board[i] == board[i + 1] &&
//         board[i + 1] == board[i + 2] &&
//         board[i] != undefined
//       ) {
//         lastWinner = board[i];
//         return 1;
//       }
//     }
//   };

//   const diagonalChecks = function () {
//     if (
//       (board[0] == board[4] && board[4] == board[8] && board[0] != undefined) ||
//       (board[2] == board[4] && board[4] == board[6] && board[2] != undefined)
//     ) {
//       lastWinner = board[i];
//       return 1;
//     }
//   };

//   const reset = function () {
//     board = [];
//     count = 0;
//     player1.score = 0;
//     player2.score = 0;
//     displayController.cleanSquares();
//     displayController.updateScore();
//   };

//   const cleanBoard = function () {
//     board = [];
//     count = 0;
//     displayController.cleanSquares();
//   };

//   return { player1, player2, move, reset };
// })();

const displayController = (function () {
  const initializeSquares = (function () {
    document.addEventListener("DOMContentLoaded", function () {
      const squares = document.querySelectorAll(".square");
      squares.forEach((sq) =>
        sq.addEventListener("click", (e) => {
          if (e.currentTarget.textContent == "") {
            // game.move(e.currentTarget);
            // console.log(e.currentTarget.dataset.number);
            socket.emit("play", {
              player: currentPlayer,
              position: e.currentTarget.dataset.number,
            });
          }
        })
      );
    });
  })();

  const initializeResetButton = (function () {
    document
      .querySelector(".reset-button")
      .addEventListener("click", () => game.reset());
  })();

  const cleanSquares = function () {
    const squares = document.querySelectorAll(".square");
    squares.forEach((e) => (e.textContent = ""));
  };

  const updateScore = function () {
    const score = document.querySelector(".score");
    score.textContent = `Player 1 (X): ${game.player1.score} | Player 2 (O): ${game.player2.score}`;
  };

  const changeSquare = function (square, play) {
    square.textContent = play;
  };
  return { changeSquare, cleanSquares, updateScore };
})();
