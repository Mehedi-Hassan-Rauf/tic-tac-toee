import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";

export interface GameContextType {
  socket: Socket | null;
  setSocket: Dispatch<SetStateAction<Socket | null>>;
  playOnlineClick: () => void;
  won: () => number[] | null;
  leave: () => void;
}
