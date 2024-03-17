import { useContext } from "react";
import { GameContextType } from "../../type/type";
import { GameContext } from "../../context/GameContext";
import useStore from "../../zustand/useStore";

const Tile = ({ tile, id }: { tile: string; id: number }) => {
  const { socket } = useContext(GameContext) as GameContextType;
  const {
    currentPlayer,
    finishedState,
    finishedArrayState,
    setCurrentPlayer,
    gameState,
    setGameState,
    playingAs,
  } = useStore();
  const clickOnSquare = (id: number) => {
    console.log(playingAs, currentPlayer);
    if (playingAs !== currentPlayer) {
      return;
    }
    if (finishedState) return;

    socket?.emit("playerMoveFromClient", {
      state: {
        id,
        sign: currentPlayer,
      },
    });

    const gameStateCopy = [...gameState];
    gameStateCopy[id] = currentPlayer as string;
    setGameState(gameStateCopy);
    setCurrentPlayer(currentPlayer === "O" ? "X" : "O");
  };
  return (
    <div
      className={`w-28 h-28 text-6xl flex items-center justify-center ${
        finishedState || playingAs !== currentPlayer
          ? " cursor-not-allowed"
          : " cursor-pointer"
      } ${
        finishedArrayState?.includes(id) && tile === playingAs
          ? " bg-green-500"
          : finishedArrayState?.includes(id) && tile !== playingAs
          ? "bg-red-500"
          : "bg-slate-500"
      }`}
      onClick={() => {
        clickOnSquare(id);
      }}
    >
      {tile}
    </div>
  );
};

export default Tile;
