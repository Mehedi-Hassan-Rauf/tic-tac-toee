import { useEffect } from "react";
import useStore from "../../zustand/useStore";

const MessageBox = () => {
  const { messages, playerName } = useStore();
  useEffect(() => {}, [messages]);

  return (
    <div className="w-full sm:w-2/3 h-full text-black bg-white flex flex-col overflow-auto border border-white">
      {Array.isArray(messages)
        ? messages.map((message: { name: string; message: string }, i) => {
            return (
              <div
                key={i}
                className={`max-w-[300px] my-1 ${
                  message.name === playerName && "ml-auto flex justify-end"
                }`}
              >
                <p
                  className={`p-2 ${
                    message.name === playerName
                      ? "bg-green-500 rounded-s-3xl rounded-ee-3xl"
                      : "bg-slate-500 rounded-e-3xl rounded-es-3xl"
                  } w-fit h-fit ${
                    message.name === playerName ? "mr-2" : "ml-2"
                  } pb-2`}
                >
                  {message.message}
                </p>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default MessageBox;
