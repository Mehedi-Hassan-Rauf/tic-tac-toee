import { useContext, useEffect } from "react";
import Tile from "./Tile";
import Swal from "sweetalert2";
import { GameContextType } from "../../type/type";
import { GameContext } from "../../context/GameContext";
import useStore from "../../zustand/useStore";

const Board = ({ isOpen }: { isOpen: boolean }) => {
  const {
    gameState,
    currentPlayer,
    opponentName,
    playingAs,
    finishedState,
    setFinishedArrayState,
  } = useStore();
  const { socket, won, leave } = useContext(GameContext) as GameContextType;
  useEffect(() => {
    const winner = won();
    if (winner) {
      setFinishedArrayState(winner);
    } else if (finishedState === "opponentLeftMatch") {
      Swal.fire({
        title: `${opponentName} left the game!`,
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "Okay",
        allowOutsideClick: false,
      });
    }
  }, [gameState]);

  return (
    <div
      className={`board w-full h-fit md:w-1/2 ${
        isOpen ? "hidden" : "flex"
      } sm:flex flex-col items-center`}
    >
      <div className="flex justify-evenly w-full pb-8">
        {!finishedState && (
          <h1
            className={`text-lg bg-slate-500 ${
              currentPlayer === "X" && !finishedState && "animate-bounce"
            } px-5 py-2 rounded-b-full`}
          >
            X's move
          </h1>
        )}
        {finishedState && (
          <button
            className="bg-green-500 px-4 py-2 rounded-3xl"
            onClick={() => {
              socket?.emit("playAgain");
            }}
          >
            Play Again
          </button>
        )}
        {finishedState && (
          <p className="bg-gray-500 flex items-center px-1 font-medium">{`You ${
            playingAs === finishedState ? "won" : "lost"
          } the match`}</p>
        )}

        <button className="bg-red-500 px-4 py-2 rounded-3xl" onClick={leave}>
          Leave
        </button>
        {!finishedState && (
          <h1
            className={`text-lg bg-slate-500 ${
              currentPlayer === "O" && !finishedState && "animate-bounce"
            } px-5 py-2 rounded-b-full`}
          >
            O's move
          </h1>
        )}
      </div>
      <div className=" w-fit grid grid-cols-3 gap-2">
        {gameState.map((tile, i) => (
          <Tile key={i} tile={tile} id={i} />
        ))}
      </div>
    </div>
  );
};

export default Board;
