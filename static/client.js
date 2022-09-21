let socket = io();
let currentPlayer;

socket.on("player", (msg) => {
  currentPlayer = msg.player;
  document.querySelector(".player").textContent = `Você é o ${currentPlayer}`;
});

socket.on("boardUpdate", (b) => displayController.updateBoard(b));
socket.on("boardClear", (b) => setTimeout(displayController.cleanSquares, 500));

const player = () => {
  let score = 0;
  return { score };
};

const game = (() => {})();

const displayController = (() => {
  const initializeSquares = (() => {
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

  // const initializeResetButton = (function () {
  //   document
  //     .querySelector(".reset-button")
  //     .addEventListener("click", () => game.reset());
  // })();
  const cleanSquares = () => {
    const squares = document.querySelectorAll(".square");
    squares.forEach((e) => (e.textContent = ""));
  };

  const updateScore = () => {
    const score = document.querySelector(".score");
    score.textContent = `Player 1 (X): ${game.player1.score} | Player 2 (O): ${game.player2.score}`;
  };

  const changeSquare = (square, play) => {
    square.textContent = play;
  };

  const updateBoard = (board) => {
    const squares = document.querySelectorAll(".square");
    squares.forEach((sq, index) => (sq.textContent = board[index]));
  };
  return { changeSquare, cleanSquares, updateBoard, updateScore };
})();
