import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux_slice/UserSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PlayersPage.css";

function PlayersPage() {
  const { loginStatus, username } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [games, setGames] = useState([]);

  useEffect(() => {
    if (!loginStatus) {
      navigate("/");
      return;
    }
    fetchOpenGames();
  }, [loginStatus, navigate]);

  const fetchOpenGames = async () => {
    const res = await axios.get(`/api/games/open?username=${username}`);
    setGames(res.data);
  };

  const handleEnterGame = async (game) => {
    // Join if not already in, then navigate to game view
    if (!game.players.includes(username)) {
      try {
        await axios.post(`/api/games/${game.id}/join`, { username });
      } catch (err) {
        alert(err.response?.data?.error || "فشل الانضمام");
        return;
      }
    }
    navigate(`/game/${game.id}`);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div className="players-container">
      <div className="players-header">
        <h1>♠  بوكر</h1>
        <div className="header-right">
          <span className="welcome-text">أهلاً، {username}!</span>
          <button className="logout-btn" onClick={handleLogout}>خروج</button>
        </div>
      </div>

      {games.length === 0 ? (
        <div className="players-card">
          <p className="no-players">لا توجد ألعاب مفتوحة حالياً. تحقق لاحقاً!</p>
        </div>
      ) : (
        games.map((game) => (
          <div className="players-card game-card" key={game.id}>
            <div className="game-card-header">
              <h2>🎲 لعبة — {game.name}</h2>
              <button className="join-btn" onClick={() => handleEnterGame(game)}>
                {game.players.includes(username) ? "دخول اللعبة" : "انضمام ودخول"}
              </button>
            </div>

            <p className="game-card-count">{game.players.length} لاعب{game.players.length > 1 ? "ين" : ""}</p>

            <div className="players-list">
              {game.players.map((player, idx) => (
                <div className={`player-item ${player === username ? "player-me" : ""}`} key={idx}>
                  <div className="player-index">{idx + 1}</div>
                  <div className="player-info">
                    <span className="player-name">{player}{player === username ? " (أنت)" : ""}</span>
                  </div>
                  <div className="player-status">✓ موجود</div>
                </div>
              ))}
              {game.players.length === 0 && (
                <p className="no-players">لم ينضم أحد بعد. كن الأول!</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default PlayersPage;
