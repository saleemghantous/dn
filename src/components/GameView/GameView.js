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
  const [balances, setBalances] = useState([]); // [{ other, amount }]
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
      setBalances(debtsRes.data); // [{ other, amount }]
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

  const getBalance = (otherPlayer) => {
    const b = balances.find((x) => x.other === otherPlayer);
    return b ? b.amount : 0;
  };

  const handleSetBalance = async (otherPlayer, newAmount) => {
    const clamped = Math.max(-50, Math.min(50, newAmount));
    const rounded = Math.round(clamped / 5) * 5;

    // Optimistic update
    setBalances((prev) => {
      const existing = prev.find((b) => b.other === otherPlayer);
      if (existing) {
        if (rounded === 0) {
          return prev.filter((b) => b.other !== otherPlayer);
        }
        return prev.map((b) =>
          b.other === otherPlayer ? { ...b, amount: rounded } : b
        );
      } else if (rounded !== 0) {
        return [...prev, { other: otherPlayer, amount: rounded }];
      }
      return prev;
    });

    try {
      await axios.put(`/api/games/${gameId}/debt`, {
        user: username,
        other: otherPlayer,
        amount: rounded,
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

  // Show ALL allowed players (even if they haven't joined yet)
  const allowedSet = new Set(game.allowed_players || []);
  const joinedSet = new Set(game.players || []);
  const allRelevant = [...new Set([...allowedSet, ...joinedSet])].filter((p) => p !== username);

  const totalPositive = allRelevant.reduce((s, p) => {
    const b = getBalance(p);
    return b > 0 ? s + b : s;
  }, 0);
  const totalNegative = allRelevant.reduce((s, p) => {
    const b = getBalance(p);
    return b < 0 ? s + b : s;
  }, 0);
  const netTotal = totalPositive + totalNegative;

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
          <div className="summary-item owed">
            <span className="summary-label">إلي</span>
            <span className="summary-amount" dir="ltr">₪{totalPositive}</span>
          </div>
          <div className="summary-item owe">
            <span className="summary-label">عليّ</span>
            <span className="summary-amount" dir="ltr">₪{Math.abs(totalNegative)}</span>
          </div>
          <div className={`summary-item net ${netTotal >= 0 ? "positive" : "negative"}`}>
            <span className="summary-label">الصافي</span>
            <span className="summary-amount" dir="ltr">
              {netTotal >= 0 ? "+" : ""}{netTotal}₪
            </span>
          </div>
        </div>
      </div>

      {/* Balance per player */}
      <div className="gameview-card">
        <h2>حدد المبلغ لكل لاعب</h2>
        <p className="card-subtitle">
          + يعني إلك عنده &nbsp;|&nbsp; − يعني عليك إله &nbsp;(−٥٠ إلى +٥٠)
        </p>

        {allRelevant.length === 0 ? (
          <p className="no-players-text">لا يوجد لاعبين آخرين في اللعبة بعد.</p>
        ) : (
          <div className="debt-list">
            {allRelevant.map((player) => {
              const bal = getBalance(player);
              const isOnline = joinedSet.has(player);
              return (
                <div className={`debt-item ${!isOnline ? "offline" : ""}`} key={player}>
                  <div className="debt-player-row">
                    <span className="debt-player-name">
                      {player}
                      <span className={`online-dot ${isOnline ? "on" : "off"}`} title={isOnline ? "في اللعبة" : "لم يدخل بعد"}></span>
                    </span>
                    <span className={`balance-badge ${bal > 0 ? "positive" : bal < 0 ? "negative" : "zero"}`} dir="ltr">
                      {bal > 0 ? `₪${bal} إلك` : bal < 0 ? `₪${Math.abs(bal)} عليك` : "متعادل"}
                    </span>
                  </div>
                  <div className="debt-controls">
                    <button
                      className="debt-btn minus"
                      onClick={() => handleSetBalance(player, bal - 5)}
                      disabled={bal <= -50}
                    >
                      −
                    </button>
                    <span className={`debt-amount ${bal > 0 ? "positive" : bal < 0 ? "negative" : ""}`} dir="ltr">
                      {bal > 0 ? "+" : ""}{bal}
                    </span>
                    <button
                      className="debt-btn plus"
                      onClick={() => handleSetBalance(player, bal + 5)}
                      disabled={bal >= 50}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
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
