const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const board = new Array(9).fill(undefined);
let connected = [];
let id = 0;

app.use(express.static("static"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// app.get("/x", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

// app.get("/o", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

io.on("connection", (socket) => {
  console.log("client conectado");
  if (id % 2 == 0) {
    connected.push({ player: "X" });
  } else {
    connected.push({ player: "O" });
  }
  socket.emit("player", connected[id]);
  id++;
  socket.on("disconnect", () => {
    if (id > 0) id--;
    connected.pop();
    console.log("client desconectado");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
