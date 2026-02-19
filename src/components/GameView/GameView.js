import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux_slice/UserSlice";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./GameView.css";

function GameView() {
  const { gameId } = useParams();
  const { loginStatus, username } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);
  const lastHashRef = useRef("");

  // Full data fetch — only called when hash changes
  const fetchFullData = useCallback(async () => {
    try {
      const [gameRes, debtsRes] = await Promise.all([
        axios.get("/api/games"),
        axios.get(`/api/games/${gameId}/debts?username=${username}`),
      ]);
      const foundGame = gameRes.data.find((g) => g.id === gameId);
      setGame(foundGame || null);
      setDebts(debtsRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [gameId, username]);

  // Lightweight poll — only checks hash
  const pollForChanges = useCallback(async () => {
    try {
      const res = await axios.get(`/api/games/${gameId}/poll?username=${username}`);
      const newHash = res.data.hash;
      if (newHash !== lastHashRef.current) {
        lastHashRef.current = newHash;
        await fetchFullData();
      }
    } catch (err) {
      console.error(err);
    }
  }, [gameId, username, fetchFullData]);

  useEffect(() => {
    if (!loginStatus) {
      navigate("/");
      return;
    }
    fetchFullData();
    // Poll every 5 seconds — lightweight hash check
    intervalRef.current = setInterval(pollForChanges, 5000);
    return () => clearInterval(intervalRef.current);
  }, [loginStatus, navigate, fetchFullData, pollForChanges]);

  const getMyDebtTo = (toUser) => {
    const d = debts.find((d) => d.from_user === username && d.to_user === toUser);
    return d ? d.amount : 0;
  };

  const getDebtToMe = (fromUser) => {
    const d = debts.find((d) => d.from_user === fromUser && d.to_user === username);
    return d ? d.amount : 0;
  };

  const handleSetDebt = async (toUser, amount) => {
    const clamped = Math.max(0, Math.min(50, amount));
    // Optimistic update
    setDebts((prev) => {
      const existing = prev.find((d) => d.from_user === username && d.to_user === toUser);
      if (existing) {
        return prev.map((d) =>
          d.from_user === username && d.to_user === toUser ? { ...d, amount: clamped } : d
        );
      } else if (clamped > 0) {
        return [...prev, { game_id: gameId, from_user: username, to_user: toUser, amount: clamped }];
      }
      return prev;
    });
    try {
      await axios.put(`/api/games/${gameId}/debt`, {
        from_user: username,
        to_user: toUser,
        amount: clamped,
      });
      lastHashRef.current = ""; // force next poll to refetch
    } catch (err) {
      alert(err.response?.data?.error || "فشل التحديث");
      fetchFullData();
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const handleBack = () => {
    navigate("/players");
  };

  if (loading) {
    return (
      <div className="gameview-container">
        <p className="loading-text">جاري التحميل...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="gameview-container">
        <p className="loading-text">اللعبة غير موجودة.</p>
        <button className="back-btn" onClick={handleBack}>→ رجوع</button>
      </div>
    );
  }

  const otherPlayers = game.players.filter((p) => p !== username);

  const getSummary = () => {
    const summary = [];
    otherPlayers.forEach((player) => {
      const iOwe = getMyDebtTo(player);
      const theyOweMe = getDebtToMe(player);
      const net = theyOweMe - iOwe;
      summary.push({ player, iOwe, theyOweMe, net });
    });
    return summary;
  };

  const summary = getSummary();
  const totalIOwe = summary.reduce((s, x) => s + x.iOwe, 0);
  const totalOwedToMe = summary.reduce((s, x) => s + x.theyOweMe, 0);

  return (
    <div className="gameview-container">
      <div className="gameview-header">
        <button className="back-btn" onClick={handleBack}>→ رجوع</button>
        <h1>🎲 {game.name}</h1>
        <div className="header-right">
          <span className="welcome-text">{username}</span>
          <button className="logout-btn" onClick={handleLogout}>خروج</button>
        </div>
      </div>

      {/* Net Summary */}
      <div className="gameview-card summary-card">
        <div className="summary-row">
          <div className="summary-item owe">
            <span className="summary-label">عليّ</span>
            <span className="summary-amount">₪{totalIOwe}</span>
          </div>
          <div className="summary-item owed">
            <span className="summary-label">إلي</span>
            <span className="summary-amount">₪{totalOwedToMe}</span>
          </div>
          <div className={`summary-item net ${totalOwedToMe - totalIOwe >= 0 ? "positive" : "negative"}`}>
            <span className="summary-label">الصافي</span>
            <span className="summary-amount">
              {totalOwedToMe - totalIOwe >= 0 ? "+" : ""}₪{totalOwedToMe - totalIOwe}
            </span>
          </div>
        </div>
      </div>

      {/* Debt per player */}
      <div className="gameview-card">
        <h2>حدد المبلغ اللي عليك</h2>
        <p className="card-subtitle">اضغط + أو - لتحديد كم بتدين لكل لاعب (٠–٥٠، كل خطوة ٥)</p>

        {otherPlayers.length === 0 ? (
          <p className="no-players-text">لا يوجد لاعبين آخرين في اللعبة بعد.</p>
        ) : (
          <div className="debt-list">
            {summary.map(({ player, iOwe, theyOweMe, net }) => (
              <div className="debt-item" key={player}>
                <div className="debt-player-row">
                  <span className="debt-player-name">{player}</span>
                  {theyOweMe > 0 && (
                    <span className="owes-me-badge">مدين لك ₪{theyOweMe}</span>
                  )}
                  {net !== 0 && (
                    <span className={`net-badge ${net > 0 ? "positive" : "negative"}`}>
                      {net > 0 ? `+₪${net}` : `-₪${Math.abs(net)}`}
                    </span>
                  )}
                </div>
                <div className="debt-controls">
                  <button
                    className="debt-btn minus"
                    onClick={() => handleSetDebt(player, iOwe - 5)}
                    disabled={iOwe <= 0}
                  >
                    −
                  </button>
                  <span className="debt-amount">₪{iOwe}</span>
                  <button
                    className="debt-btn plus"
                    onClick={() => handleSetDebt(player, iOwe + 5)}
                    disabled={iOwe >= 50}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live status indicator */}
      <div className="live-indicator">
        <span className="live-dot"></span> مباشر — تحديث تلقائي
      </div>
    </div>
  );
}

export default GameView;
