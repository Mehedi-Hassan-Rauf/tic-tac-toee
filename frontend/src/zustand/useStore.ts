import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  play: boolean;
  playerName: string | null;
  opponentName: string | null;
  playingAs: string | null;
  gameState: string[];
  currentPlayer: string | null;
  finishedState: string | null;
  finishedArrayState: null | number[];
  messages: { name: string; message: string }[] | [];
};

type Actions = {
  setPlay: (play: boolean) => void;
  setPlayerName: (playerName: string | null) => void;
  setOpponentName: (opponentName: string | null) => void;
  setPlayingAs: (playingAs: string | null) => void;
  setGameState: (gameState: string[]) => void;
  setCurrentPlayer: (currentPlayer: string | null) => void;
  setFinishedState: (finishedState: string | null) => void;
  setFinishedArrayState: (finishedArrayState: null | number[]) => void;
  setMessages: (message: { name: string; message: string }[] | []) => void;
};

const useStore = create<State & Actions>()(
  persist(
    (set) => ({
      play: false,
      setPlay: (play: boolean) => set({ play: play }),
      playerName: null,
      setPlayerName: (playerName: string | null) =>
        set({ playerName: playerName }),
      opponentName: null,
      setOpponentName: (opponentName: string | null) =>
        set({ opponentName: opponentName }),
      playingAs: null,
      setPlayingAs: (playingAs: string | null) => set({ playingAs: playingAs }),
      gameState: ["", "", "", "", "", "", "", "", ""],
      setGameState: (gameState: string[]) =>
        set(() => ({ gameState: gameState })),
      currentPlayer: "X",
      setCurrentPlayer: (currentPlayer: string | null) =>
        set({ currentPlayer: currentPlayer }),
      finishedState: null,
      setFinishedState: (finishedState: string | null) =>
        set({ finishedState: finishedState }),
      finishedArrayState: null,
      setFinishedArrayState: (finishedArrayState: null | number[]) =>
        set({ finishedArrayState: finishedArrayState }),
      messages: [],
      setMessages: (messages: { name: string; message: string }[] | []) =>
        set({ messages: messages }),
    }),
    {
      name: "uniqueList",
    }
  )
);

export default useStore;
