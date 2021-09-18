const express = require("express");
const WebSocket = require("ws");
const http = require("http");
const path = require("path");

require("dotenv").config();

const app = express();
const httpServer = http.createServer(app);
const wss = new WebSocket.Server({
  server: httpServer,
});
const port = process.env.PORT || 5000;
httpServer.listen(port);

app.use("/", express.static(path.join(__dirname, "client/build")));

app.get(["/", "/newgame", "/joingame", "/innergame", "/mygame"], (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "/client/build/") });
});

const gameRooms = [];
const moves = [];

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    message = JSON.parse(message);
    switch (message.event) {
      case "setusername":
        ws.username = message.username;
        break;
      case "newgame":
        gameRooms.push({ username: ws.username, items: message.items });
        broadcastMessage({ event: "gamelist", games: gameRooms });
        break;
      case "getgames":
        broadcastMessage({ event: "gamelist", games: gameRooms });
        break;
      case "joingame":
        const game = gameRooms.find(
          (room) => room.username == message.nickname
        );
        const gameIndex = gameRooms.findIndex(
          (room) => room.username == message.nickname
        );

        gameRooms.splice(gameIndex, 1);
        broadcastMessage({ event: "gamelist", games: gameRooms });

        ws.send(JSON.stringify({ event: "gameinfo", game: game }));
        sendToUser({ event: "join", username: ws.username }, message.nickname);
        break;

      case "move":
        const playerTwoMove = moves.findIndex(
          (move) => move.username === message.to
        );
        if (playerTwoMove !== -1) {
          ws.send(
            JSON.stringify({
              event: "gameresult",
              playerTwoMove: moves[playerTwoMove].move,
            })
          );
          sendToUser(
            { event: "gameresult", playerTwoMove: message.move },
            message.to
          );
          moves.splice(playerTwoMove, 1);
        } else {
          moves.push({
            username: ws.username,
            to: message.to,
            move: message.move,
          });
        }
        break;
    }
  });
  ws.on("close", () => {
    const gameIndex = gameRooms.findIndex(
      (room) => room.username == ws.username
    );
    const moveIndex = moves.findIndex((move) => move.username == ws.username);
    gameRooms.splice(gameIndex, 1);
    moves.splice(moveIndex, 1);
    broadcastMessage({ event: "gamelist", games: gameRooms });
  });
});

function broadcastMessage(message) {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
}

function sendToUser(message, username) {
  wss.clients.forEach((client) => {
    if (client.username === username) {
      client.send(JSON.stringify(message));
    }
  });
};
