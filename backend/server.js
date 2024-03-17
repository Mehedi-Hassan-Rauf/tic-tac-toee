import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
// import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

dotenv.config();
app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const allUsers = {};
const allRooms = [];

io.on("connection", (socket) => {
  allUsers[socket.id] = {
    socket: socket,
    online: true,
  };

  socket.on("request_to_play", (data) => {
    const currentUser = allUsers[socket.id];
    currentUser.playerName = data.playerName;

    let opponentPlayer;

    for (const key in allUsers) {
      const user = allUsers[key];
      if (user.online && !user.playing && socket.id !== key) {
        user.playing = true;
        opponentPlayer = user;
        break;
      }
    }

    if (opponentPlayer) {
      allRooms.push({
        player1: opponentPlayer,
        player2: currentUser,
      });

      currentUser.socket.emit("OpponentFound", {
        opponentName: opponentPlayer.playerName,
        playingAs: "O",
      });

      opponentPlayer.socket.emit("OpponentFound", {
        opponentName: currentUser.playerName,
        playingAs: "X",
      });

      currentUser.socket.on("playerMoveFromClient", (data) => {
        opponentPlayer.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });

      opponentPlayer.socket.on("playerMoveFromClient", (data) => {
        currentUser.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });

      currentUser.socket.on("playAgain", () => {
        // console.log("Play Again");
        opponentPlayer.socket.emit("requestPlayAgain");
      });
      opponentPlayer.socket.on("playAgain", () => {
        // console.log("Play Again");
        currentUser.socket.emit("requestPlayAgain");
      });

      currentUser.socket.on("letsPlayAgainFromClient", () => {
        opponentPlayer.socket.emit("letsPlayAgainFromServer");
      });
      opponentPlayer.socket.on("letsPlayAgainFromClient", () => {
        currentUser.socket.emit("letsPlayAgainFromServer");
      });

      //chat start
      currentUser.socket.on("messageFromClient", (data) => {
        opponentPlayer.socket.emit("messageFromServer", {
          ...data,
        });
      });
      opponentPlayer.socket.on("messageFromClient", (data) => {
        currentUser.socket.emit("messageFromServer", {
          ...data,
        });
      });
      //chat end
    } else {
      currentUser.socket.emit("OpponentNotFound");
    }
    currentUser.socket.on("leave", () => {
      // currentUser.online = false;
      // currentUser.playing = false;
      // opponentPlayer.socket.emit("opponentLeftMatch");
      socket.disconnect();
    });
  });

  socket.on("disconnect", function () {
    const currentUser = allUsers[socket.id];
    currentUser.online = false;
    currentUser.playing = false;

    for (let index = 0; index < allRooms.length; index++) {
      const { player1, player2 } = allRooms[index];

      if (player1.socket.id === socket.id) {
        player2.socket.emit("opponentLeftMatch");
        break;
      }

      if (player2.socket.id === socket.id) {
        player1.socket.emit("opponentLeftMatch");
        break;
      }
    }
  });
});

httpServer.listen(PORT);
