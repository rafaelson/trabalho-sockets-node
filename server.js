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
    if (diagonalChecks() || horizontalChecks() || verticalChecks()) {
      return 1;
    }
  };

  const round = (play) => {
    currentPlayer = alternatePlayer(playNumber);
    if (currentPlayer != play.player) return;
    board[play.position] = play.player;
    playNumber++;
    io.emit("boardUpdate", board);

    if (checkBoard()) {
      win();
    } else if (playNumber == 9 && !checkBoard()) {
      reset();
    }
  };

  const verticalChecks = () => {
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

  const horizontalChecks = () => {
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

  const diagonalChecks = () => {
    if (
      (board[0] == board[4] && board[4] == board[8] && board[0] != undefined) ||
      (board[2] == board[4] && board[4] == board[6] && board[2] != undefined)
    ) {
      return 1;
    }
  };

  const reset = () => {
    playNumber = 0;
    io.emit("boardClear");
    board.forEach((element, index) => (board[index] = undefined));
  };

  const win = (player) => {
    reset();
  };

  return { round };
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
    game.round(play);
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
