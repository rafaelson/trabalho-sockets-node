const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let connected = [];
let toReconnect;
let id = 0;

app.use(express.static("static"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const game = (() => {
  const board = new Array(9).fill(undefined);
  let playNumber = 0;
  let currentPlayer;
  let player1 = { score: 0 };
  let player2 = { score: 0 };

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
      win(currentPlayer);
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
    if (player == "X") player1.score++;
    else player2.score++;
    io.emit("scoreUpdate", {
      player1: player1.score,
      player2: player2.score,
    });
    reset();
  };

  const checkReturn = () => {
    let element = board.find((element) => element == "X" || element == "O");
    if (element) {
      io.emit("boardUpdate", board);
    }
  };

  return { checkReturn, round };
})();

io.on("connection", (socket) => {
  console.log("client conectado");
  if (id == 0) {
    connected[0] = { player: "X" };
    socket.data.player = 1;
  } else {
    connected[1] = { player: "O" };
    socket.data.player = 2;
  }
  socket.emit("player", connected[id]);
  id++;

  if (toReconnect) {
    game.checkReturn();
    toReconnect = false;
  }

  socket.on("play", (play) => {
    game.round(play);
  });

  socket.on("disconnect", () => {
    if (socket.data.player == 1) {
      id = 0;
    } else {
      id = 1;
    }
    connected.splice(id, 1, undefined);
    toReconnect = true;
    console.log("client desconectado");
  });
});

server.listen(3000, "localhost", () => {
  console.log("escutando em localhost:3000");
});
