import { useContext } from "react";
import "./App.css";
import Home from "./pages/Home";
import { GameContext } from "./context/GameContext";
import { GameContextType } from "./type/type";
import useStore from "./zustand/useStore";
function App() {
  const { play, playerName, opponentName, playingAs } = useStore();
  const { playOnlineClick } = useContext(GameContext) as GameContextType;
  return (
    <div className="app min-h-screen max-w-screen items-center text-white flex flex-col justify-around backdrop-sepia-0 bg-slate-900/80">
      <div className="flex flex-col gap-6">
        <h1 className="w-full text-center text-5xl font-bold">Tic Tac Toe</h1>
        {playerName && opponentName && (
          <div className="border-y border-green-400 flex items-center gap-4">
            <p className="text-center text-green-400 font-bold text-sm sm:text-xl">
              You are playing as "{playingAs}"
            </p>
            <p className="text-center text-green-400 font-bold text-4xl sm:text-6xl">
              vs
            </p>
            <p className="text-center text-green-400 font-bold text-sm sm:text-xl">
              {opponentName} is playing as "{playingAs === "X" ? "O" : "X"}"
            </p>
          </div>
        )}
      </div>
      {!play ? (
        <div className="w-full h-[30rem] sm:w-1/3 px-5 sm:px-0 flex flex-col gap-5">
          <p className="text-xl font-bold">
            <span className="text-red-500 text-xl font-bold">NOTE : </span>
            Here you can play and chat with your opponent. Before clicking play
            button make sure that another person also play this from his/her
            phone. Otherwise there will be no opponent to play. Hope you'll
            enjoy
          </p>
          <button className="bg-green-500 px-5 py-2" onClick={playOnlineClick}>
            Play
          </button>
        </div>
      ) : play && !opponentName ? (
        <div className="h-[30rem] flex items-center sm:items-baseline gap-5">
          <p className="text-2xl font-thin">Waiting for opponent</p>
          <div className="w-10 h-10 border-r-4 border-white rounded-full animate-spin"></div>
        </div>
      ) : (
        <Home />
      )}
    </div>
  );
}

export default App;
