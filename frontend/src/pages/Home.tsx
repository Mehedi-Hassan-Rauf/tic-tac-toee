import { useContext, useState } from "react";
import Chat from "../components/chat/Chat";
import Board from "../components/game/Board";
import { IoLogoWechat } from "react-icons/io5";
import { GameContextType } from "../type/type";
import { GameContext } from "../context/GameContext";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { leave } = useContext(GameContext) as GameContextType;
  window.addEventListener("pagehide", function (e) {
    e.preventDefault();
    localStorage.removeItem("uniqueList");
    leave();
  });

  return (
    <div className="home w-full h-full flex flex-col sm:flex-row gap-8 items-center justify-center ">
      <span
        className="flex items-center text-2xl bg-blue-500 rounded-xl px-2 sm:hidden"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {!isOpen ? (
          <>
            Chat
            <IoLogoWechat />
          </>
        ) : (
          "Game"
        )}
      </span>
      <Board isOpen={isOpen} />
      <Chat isOpen={isOpen} />
    </div>
  );
};

export default Home;
