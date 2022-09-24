let socket = io();
let currentPlayer;

socket.on("player", (msg) => {
  currentPlayer = msg.player;
  document.querySelector(".player").textContent = `Você é o ${currentPlayer}`;
});

socket.on("boardUpdate", (board) => displayController.updateBoard(board));
socket.on("boardClear", () => setTimeout(displayController.cleanSquares, 500));
socket.on("scoreUpdate", (scores) => displayController.updateScore(scores));

const displayController = (() => {
  const initializeSquares = (() => {
    document.addEventListener("DOMContentLoaded", () => {
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

  const cleanSquares = () => {
    const squares = document.querySelectorAll(".square");
    squares.forEach((e) => (e.textContent = ""));
  };

  const updateScore = (scores) => {
    const score = document.querySelector(".score");
    score.textContent = `Player 1 (X): ${scores.player1} | Player 2 (O): ${scores.player2}`;
  };

  const updateBoard = (board) => {
    const squares = document.querySelectorAll(".square");
    squares.forEach((sq, index) => (sq.textContent = board[index]));
  };
  return { cleanSquares, updateBoard, updateScore };
})();
