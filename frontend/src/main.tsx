import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import GameContextProviderMain from "./context/GameContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GameContextProviderMain>
      <App />
    </GameContextProviderMain>
  </React.StrictMode>
);
