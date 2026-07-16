import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import AdminPage from "./components/AdminPage/AdminPage";
import PlayersPage from "./components/PlayersPage/PlayersPage";
import GameView from "./components/GameView/GameView";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route exact path="/admin" element={<AdminPage />} />
          <Route exact path="/players" element={<PlayersPage />} />
          <Route exact path="/game/:gameId" element={<GameView />} />
          <Route path="/*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;



