let socket = io();
let currentPlayer;

socket.on("player", (msg) => {
  currentPlayer = msg.player;
  console.log(currentPlayer);
});

socket.on("boardUpdate", (b) => displayController.updateBoard(b));
socket.on("boardClear", (b) => setTimeout(displayController.cleanSquares, 500));

const player = function () {
  let score = 0;
  return { score };
};

const game = (function () {})();

const displayController = (function () {
  const initializeSquares = (function () {
    document.addEventListener("DOMContentLoaded", function () {
      const squares = document.querySelectorAll(".square");
      squares.forEach((sq) =>
        sq.addEventListener("click", (e) => {
          if (e.currentTarget.textContent == "") {
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

  const updateBoard = function (board) {
    const squares = document.querySelectorAll(".square");
    squares.forEach((sq, index) => (sq.textContent = board[index]));
  };
  return { changeSquare, cleanSquares, updateBoard, updateScore };
})();
