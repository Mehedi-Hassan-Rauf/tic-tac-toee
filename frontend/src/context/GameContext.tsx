import React, { useEffect } from "react";
import { Socket, io } from "socket.io-client";
import Swal from "sweetalert2";
import { createContext, useState } from "react";
import { GameContextType } from "../type/type";
import useStore from "../zustand/useStore";

export const GameContext = createContext<GameContextType | null>(null);

//winningLines
const winningLines = [
  { line: [0, 1, 2] },
  { line: [3, 4, 5] },
  { line: [6, 7, 8] },
  { line: [0, 3, 6] },
  { line: [1, 4, 7] },
  { line: [2, 5, 8] },
  { line: [0, 4, 8] },
  { line: [2, 4, 6] },
];

const GameContextProviderMain = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    setPlay,
    setPlayerName,
    opponentName,
    setOpponentName,
    setPlayingAs,
    gameState,
    setGameState,
    setCurrentPlayer,
    setFinishedState,
    setFinishedArrayState,
    messages,
    setMessages,
  } = useStore();
  const url = "https://tic-tac-toee-xfis.onrender.com";
  const [socket, setSocket] = useState<Socket | null>(null);
  const takePlayerName = async () => {
    const result = await Swal.fire({
      title: "Enter your name",
      input: "text",
      showCancelButton: true,
      allowOutsideClick: false,
      inputValidator: (value: string) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    return result;
  };
  const connectSocket = async () => {
    const newSocket = io(url, {
      withCredentials: true,
      autoConnect: true,
    });
    setSocket(newSocket);
  };

  socket?.on("connect", function () {
    setPlay(true);
  });

  socket?.on("OpponentNotFound", function () {
    setOpponentName(null);
  });

  socket?.on("OpponentFound", function (data) {
    setPlayingAs(data.playingAs);
    setOpponentName(data.opponentName);
  });

  async function playOnlineClick() {
    const result = await takePlayerName();
    if (!result.isConfirmed) {
      return;
    }
    const username = result.value;
    setPlayerName(username);
    const newSocket = io(url, {
      withCredentials: true,
      autoConnect: true,
    });

    newSocket?.emit("request_to_play", {
      playerName: username,
    });
    setSocket(newSocket);
  }
  //For App.tsx

  //

  socket?.on("requestPlayAgain", async () => {
    const result = await Swal.fire({
      title: `${opponentName} wants to play again`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Lets, play",
      cancelButtonText: "No",
      allowOutsideClick: false,
    });
    if (result.isConfirmed === true) {
      socket.emit("letsPlayAgainFromClient");
      setGameState(["", "", "", "", "", "", "", "", ""]);
      setFinishedState(null);
      setFinishedArrayState(null);
    }
    // console.log(result);
  });

  socket?.on("letsPlayAgainFromServer", () => {
    setGameState(["", "", "", "", "", "", "", "", ""]);
    setFinishedState(null);
    setFinishedArrayState(null);
  });

  const leave = () => {
    Swal.fire({
      title: "Don't want to play?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes,leave",
      cancelButtonText: "Resume",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // socket?.emit("leave");
        socket?.disconnect();
        localStorage.removeItem("uniqueList");
        setSocket(null);
        setPlay(false);
        setPlayerName(null);
        setOpponentName(null);
        setPlayingAs(null);
        setGameState(["", "", "", "", "", "", "", "", ""]);
        setFinishedState(null);
        setFinishedArrayState(null);
        setMessages([]);
      }
    });
  };

  socket?.on("opponentLeftMatch", () => {
    Swal.fire({
      title: `${opponentName} left the game!`,
      icon: "warning",
      confirmButtonColor: "#d33",
      confirmButtonText: "Ok",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // socket?.emit("leave");
        socket?.disconnect();
        localStorage.removeItem("uniqueList");
        setSocket(null);
        setPlay(false);
        setPlayerName(null);
        setOpponentName(null);
        setPlayingAs(null);
        setGameState(["", "", "", "", "", "", "", "", ""]);
        setFinishedState(null);
        setFinishedArrayState(null);
        setMessages([]);
      }
    });
  });

  socket?.on("playerMoveFromServer", (data) => {
    const id = data.state.id;
    const gameStateCopy = [...gameState];
    gameStateCopy[id] = data.state.sign;
    setGameState(gameStateCopy);
    setCurrentPlayer(data.state.sign === "O" ? "X" : "O");
  });
  //Winning Function
  const won = () => {
    for (let i = 0; i < 8; i++) {
      const { line } = winningLines[i];
      const line1 = gameState[line[0]];
      const line2 = gameState[line[1]];
      const line3 = gameState[line[2]];
      if (line1 && line1 == line2 && line2 == line3) {
        setFinishedState(line1);
        return [line[0], line[1], line[2]];
      }
    }
    return null;
  };
  //
  //chat
  const [temp, setTemp] = useState({
    name: "",
    message: "",
  });
  socket?.on("messageFromServer", (data) => {
    // temp = { ...data };
    setTemp(data);
  });
  useEffect(() => {
    if (temp.message !== "") {
      const messagesCopy = [...messages, temp];
      setMessages(messagesCopy);
    }
  }, [temp]);

  //chat
  const providerValue = {
    socket,
    setSocket,
    playOnlineClick,
    won,
    leave,
    connectSocket,
  };
  return (
    <GameContext.Provider value={providerValue}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProviderMain;
