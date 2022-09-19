const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let connected = [];
let id = 0;

app.use(express.static("static"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const game = (() => {
  const board = new Array(9).fill(undefined);
  let playNumber = 0;
  let currentPlayer;

  const alternatePlayer = (plays) => {
    if (plays % 2 == 0) return "X";
    else return "O";
  };

  const checkBoard = () => {
    if (
      diagonalChecks() == 1 ||
      horizontalChecks() == 1 ||
      verticalChecks() == 1
    ) {
      win();
    }
  };

  const verticalChecks = function () {
    for (i = 0; i <= 3; i++) {
      if (
        board[i] == board[i + 3] &&
        board[i + 3] == board[i + 6] &&
        board[i] != undefined
      ) {
        return 1;
      }
    }
  };

  const horizontalChecks = function () {
    for (i = 0; i <= 6; i += 3) {
      if (
        board[i] == board[i + 1] &&
        board[i + 1] == board[i + 2] &&
        board[i] != undefined
      ) {
        return 1;
      }
    }
  };

  const diagonalChecks = function () {
    if (
      (board[0] == board[4] && board[4] == board[8] && board[0] != undefined) ||
      (board[2] == board[4] && board[4] == board[6] && board[2] != undefined)
    ) {
      return 1;
    }
  };

  const win = (player) => {
    // io.emit("clear");
    board.forEach((element, index) => (board[index] = undefined));
  };
  return { board, currentPlayer, playNumber, alternatePlayer, checkBoard };
})();

io.on("connection", (socket) => {
  console.log("client conectado");
  if (id % 2 == 0) {
    connected.push({ player: "X" });
  } else {
    connected.push({ player: "O" });
  }
  socket.emit("player", connected[id]);
  id++;

  socket.on("play", (play) => {
    game.currentPlayer = game.alternatePlayer(game.playNumber);
    if (game.currentPlayer != play.player) return;
    game.board[play.position] = play.player;
    game.checkBoard();
    io.emit("boardUpdate", game.board);
    game.playNumber++;
  });

  socket.on("disconnect", () => {
    if (id > 0) id--;
    connected.pop();
    console.log("client desconectado");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
