import { useContext, useState } from "react";
import MessageBox from "./MessageBox";
import useStore from "../../zustand/useStore";
import { GameContext } from "../../context/GameContext";
import { GameContextType } from "../../type/type";

const Chat = ({ isOpen }: { isOpen: boolean }) => {
  const { messages, setMessages, playerName } = useStore();
  const { socket } = useContext(GameContext) as GameContextType;
  const [val, setVal] = useState("");
  const handleSend = () => {
    const temp = {
      name: playerName ? playerName : "",
      message: val,
    };
    const messagesCopy = [...messages, temp];
    setMessages(messagesCopy);
    socket?.emit("messageFromClient", temp);
    setVal("");
  };

  return (
    <div
      className={`w-full h-[450px] px-7 sm:px-0 md:w-1/2 ${
        !isOpen ? "hidden" : "flex"
      } sm:flex flex-col items-center`}
    >
      <h1 className="font-bold text-xl">Chat with your opponent..</h1>
      <MessageBox />
      <div className="w-full sm:w-2/3 h-fit flex">
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="w-full outline-none text-black py-2 border border-black"
        />
        <button onClick={handleSend} className="bg-green-500 px-5 py-2">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
