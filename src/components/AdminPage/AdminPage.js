import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux_slice/UserSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminPage.css";

function AdminPage() {
  const { role } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", phone: "" });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ username: "", phone: "", active: true });
  const [games, setGames] = useState([]);
  const [expandedGameId, setExpandedGameId] = useState(null);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
      return;
    }
    fetchUsers();
    fetchGames();
  }, [role, navigate]);

  const fetchUsers = async () => {
    const res = await axios.get("/api/users");
    setUsers(res.data);
  };

  const fetchGames = async () => {
    const res = await axios.get("/api/games");
    setGames(res.data);
  };

  const handleCreateGame = async () => {
    try {
      await axios.post("/api/games");
      fetchGames();
    } catch (err) {
      alert(err.response?.data?.error || "فشل إنشاء اللعبة");
    }
  };

  const handleToggleGame = async (gameId) => {
    await axios.put(`/api/games/${gameId}/toggle`);
    fetchGames();
  };

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm("حذف هذه اللعبة؟")) return;
    await axios.delete(`/api/games/${gameId}`);
    fetchGames();
  };

  const handleToggleAllowed = async (gameId, username) => {
    const game = games.find((g) => g.id === gameId);
    if (!game) return;
    const allowed = game.allowed_players || [];
    let newAllowed;
    if (allowed.includes(username)) {
      newAllowed = allowed.filter((u) => u !== username);
    } else {
      newAllowed = [...allowed, username];
    }
    await axios.put(`/api/games/${gameId}/allowed`, { allowed_players: newAllowed });
    fetchGames();
  };

  const handleAllowAll = async (gameId) => {
    const activeUsers = users.filter((u) => u.active).map((u) => u.username);
    await axios.put(`/api/games/${gameId}/allowed`, { allowed_players: activeUsers });
    fetchGames();
  };

  const handleAllowNone = async (gameId) => {
    await axios.put(`/api/games/${gameId}/allowed`, { allowed_players: [] });
    fetchGames();
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.username.trim() || !newUser.phone.trim()) return;
    await axios.post("/api/users", { ...newUser, active: true });
    setNewUser({ username: "", phone: "" });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("حذف هذا اللاعب؟")) return;
    await axios.delete(`/api/users/${id}`);
    fetchUsers();
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditData({ username: user.username, phone: user.phone, active: user.active });
  };

  const handleSaveEdit = async (id) => {
    await axios.put(`/api/users/${id}`, editData);
    setEditingId(null);
    fetchUsers();
  };

  const toggleActive = async (user) => {
    await axios.put(`/api/users/${user.id}`, { ...user, active: !user.active });
    fetchUsers();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>♠ لوحة التحكم</h1>
        <button className="logout-btn" onClick={handleLogout}>خروج</button>
      </div>

      {/* Today's Game */}
      <div className="admin-card game-section">
        <div className="game-header">
          <h2>🎲 لعبة اليوم</h2>
          <button className="create-game-btn" onClick={handleCreateGame}>+ لعبة جديدة</button>
        </div>
        {games.length === 0 ? (
          <p className="no-game-text">لا توجد ألعاب بعد. اضغط "لعبة جديدة" لإنشاء واحدة.</p>
        ) : (
          <div className="games-list">
            {games.map((game) => (
              <div key={game.id} className={`game-item ${game.open ? "game-open" : "game-closed"}`}>
                <div className="game-info">
                  <span className="game-name">📅 {game.name}</span>
                  <span className="game-players-count">{game.players.length} لاعب{game.players.length > 1 ? "ين" : ""} انضموا</span>
                </div>
                {game.players.length > 0 && (
                  <div className="game-players-list">
                    {game.players.map((p, i) => (
                      <span key={i} className="game-player-chip">{p}</span>
                    ))}
                  </div>
                )}
                <div className="game-actions">
                  <span
                    className={`game-status-badge ${game.open ? "open" : "closed"}`}
                    onClick={() => handleToggleGame(game.id)}
                    title="Click to toggle open/closed"
                  >
                    {game.open ? "مفتوحة" : "مغلقة"}
                  </span>
                  <button
                    className="allowed-btn"
                    onClick={() => setExpandedGameId(expandedGameId === game.id ? null : game.id)}
                  >
                    🔑 صلاحيات ({(game.allowed_players || []).length})
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteGame(game.id)}>حذف</button>
                </div>

                {/* Allowed Players Panel */}
                {expandedGameId === game.id && (
                  <div className="allowed-panel">
                    <div className="allowed-panel-header">
                      <h3>اللاعبين المسموح لهم</h3>
                      <div className="allowed-quick-actions">
                        <button className="quick-btn" onClick={() => handleAllowAll(game.id)}>تحديد الكل</button>
                        <button className="quick-btn" onClick={() => handleAllowNone(game.id)}>إزالة الكل</button>
                      </div>
                    </div>
                    {(game.allowed_players || []).length === 0 && (
                      <p className="allowed-hint">⚠️ لم يتم تحديد أي لاعب — لن يستطيع أحد الانضمام</p>
                    )}
                    <div className="allowed-list">
                      {users.filter((u) => u.active).map((user) => {
                        const isAllowed = (game.allowed_players || []).includes(user.username);
                        return (
                          <div
                            key={user.id}
                            className={`allowed-item ${isAllowed ? "allowed" : "not-allowed"}`}
                            onClick={() => handleToggleAllowed(game.id, user.username)}
                          >
                            <span className="allowed-check">{isAllowed ? "✓" : ""}</span>
                            <span className="allowed-name">{user.username}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add new user form */}
      <div className="admin-card">
        <h2>إضافة لاعب جديد</h2>
        <form className="add-form" onSubmit={handleAddUser}>
          <input
            type="text"
            placeholder="اسم المستخدم"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <input
            type="text"
            placeholder="رقم الهاتف"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
          />
          <button type="submit" className="add-btn">+ إضافة لاعب</button>
        </form>
      </div>

      {/* Users table */}
      <div className="admin-card">
        <h2>اللاعبين ({users.length})</h2>
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>الهاتف</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} className={!user.active ? "inactive-row" : ""}>
                  <td>{idx + 1}</td>
                  <td>
                    {editingId === user.id ? (
                      <input
                        className="edit-input"
                        value={editData.username}
                        onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td>
                    {editingId === user.id ? (
                      <input
                        className="edit-input"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      />
                    ) : (
                      user.phone
                    )}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${user.active ? "active" : "inactive"}`}
                      onClick={() => toggleActive(user)}
                      title="Click to toggle"
                    >
                      {user.active ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    {editingId === user.id ? (
                      <>
                        <button className="save-btn" onClick={() => handleSaveEdit(user.id)}>حفظ</button>
                        <button className="cancel-btn" onClick={() => setEditingId(null)}>إلغاء</button>
                      </>
                    ) : (
                      <>
                        <button className="edit-btn" onClick={() => startEdit(user)}>تعديل</button>
                        <button className="delete-btn" onClick={() => handleDelete(user.id)}>حذف</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
