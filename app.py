from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from datetime import date
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os
import hashlib
import json

load_dotenv()

app = Flask(__name__, static_folder="build")
cors = CORS(app)
app.config["CORS-HEADERS"] = "Content-Type"

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "pokeradmin")

# ---------- MongoDB connection ----------
MONGO_URI = os.getenv("MONGO_DB_URL", "mongodb+srv://saleemghantous_db_user:SM9UbE76sNzj327n@cluster0.dgy2czw.mongodb.net/?retryWrites=true&w=majority")
client = MongoClient(MONGO_URI)
db = client["poker"]
users_col = db["users"]
games_col = db["games"]
debts_col = db["debts"]


def user_to_dict(u):
    """Convert a MongoDB user document to a JSON-friendly dict."""
    return {
        "id": str(u["_id"]),
        "username": u.get("username", ""),
        "phone": u.get("phone", ""),
        "active": u.get("active", True),
    }


def game_to_dict(g):
    """Convert a MongoDB game document to a JSON-friendly dict."""
    return {
        "id": str(g["_id"]),
        "name": g.get("name", ""),
        "date": g.get("date", ""),
        "open": g.get("open", True),
        "players": g.get("players", []),
        "allowed_players": g.get("allowed_players", []),
    }


# ---------- Serve React build ----------
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def index(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


# ---------- Auth ----------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    password = data.get("password", "").strip()

    # Admin login
    if password == ADMIN_PASSWORD:
        return jsonify({"success": True, "role": "admin", "username": "Admin"})

    # Normal user login by phone number
    phone = password
    user = users_col.find_one({"phone": phone, "active": True})
    if user:
        return jsonify({"success": True, "role": "user", "username": user["username"]})

    return jsonify({"success": False, "message": "Invalid credentials"}), 401


# ---------- Users CRUD (admin) ----------
@app.route("/api/users", methods=["GET"])
def get_users():
    users = [user_to_dict(u) for u in users_col.find()]
    return jsonify(users)


@app.route("/api/users/active", methods=["GET"])
def get_active_users():
    users = [user_to_dict(u) for u in users_col.find({"active": True})]
    return jsonify(users)


@app.route("/api/users", methods=["POST"])
def add_user():
    data = request.get_json()
    new_user = {
        "username": data.get("username", ""),
        "phone": data.get("phone", ""),
        "active": data.get("active", True),
    }
    result = users_col.insert_one(new_user)
    new_user["_id"] = result.inserted_id
    return jsonify(user_to_dict(new_user)), 201


@app.route("/api/users/<user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()
    update_fields = {}
    if "username" in data:
        update_fields["username"] = data["username"]
    if "phone" in data:
        update_fields["phone"] = data["phone"]
    if "active" in data:
        update_fields["active"] = data["active"]
    users_col.update_one({"_id": ObjectId(user_id)}, {"$set": update_fields})
    user = users_col.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user_to_dict(user))


@app.route("/api/users/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    users_col.delete_one({"_id": ObjectId(user_id)})
    return jsonify({"success": True})


# ---------- Games ----------
@app.route("/api/games", methods=["GET"])
def get_games():
    games = [game_to_dict(g) for g in games_col.find()]
    return jsonify(games)


@app.route("/api/games/open", methods=["GET"])
def get_open_games():
    username = request.args.get("username", "")
    all_open = [game_to_dict(g) for g in games_col.find({"open": True})]
    if username:
        # Only return games where the user is in allowed_players (or allowed_players is empty = legacy)
        filtered = [g for g in all_open if username in g.get("allowed_players", []) or len(g.get("allowed_players", [])) == 0]
        return jsonify(filtered)
    return jsonify(all_open)


@app.route("/api/games", methods=["POST"])
def create_game():
    today = date.today().strftime("%d/%m/%Y")
    # Count how many games already exist for today to build a unique name
    today_count = games_col.count_documents({"date": today})
    name = today if today_count == 0 else f"{today} (#{today_count + 1})"
    new_game = {
        "name": name,
        "date": today,
        "open": True,
        "players": [],
        "allowed_players": [],
    }
    result = games_col.insert_one(new_game)
    new_game["_id"] = result.inserted_id
    return jsonify(game_to_dict(new_game)), 201


@app.route("/api/games/<game_id>/toggle", methods=["PUT"])
def toggle_game(game_id):
    game = games_col.find_one({"_id": ObjectId(game_id)})
    if not game:
        return jsonify({"error": "Game not found"}), 404
    new_open = not game["open"]
    games_col.update_one({"_id": ObjectId(game_id)}, {"$set": {"open": new_open}})
    game["open"] = new_open
    return jsonify(game_to_dict(game))


@app.route("/api/games/<game_id>/join", methods=["POST"])
def join_game(game_id):
    data = request.get_json()
    username = data.get("username", "")
    game = games_col.find_one({"_id": ObjectId(game_id)})
    if not game:
        return jsonify({"error": "Game not found"}), 404
    if not game["open"]:
        return jsonify({"error": "Game is closed"}), 400
    allowed = game.get("allowed_players", [])
    if len(allowed) > 0 and username not in allowed:
        return jsonify({"error": "ليس لديك صلاحية للانضمام لهذه اللعبة"}), 403
    if username in game.get("players", []):
        return jsonify({"error": "Already joined"}), 400
    games_col.update_one({"_id": ObjectId(game_id)}, {"$push": {"players": username}})
    game = games_col.find_one({"_id": ObjectId(game_id)})
    return jsonify(game_to_dict(game))


@app.route("/api/games/<game_id>/leave", methods=["POST"])
def leave_game(game_id):
    data = request.get_json()
    username = data.get("username", "")
    game = games_col.find_one({"_id": ObjectId(game_id)})
    if not game:
        return jsonify({"error": "Game not found"}), 404
    games_col.update_one({"_id": ObjectId(game_id)}, {"$pull": {"players": username}})
    game = games_col.find_one({"_id": ObjectId(game_id)})
    return jsonify(game_to_dict(game))


@app.route("/api/games/<game_id>", methods=["DELETE"])
def delete_game(game_id):
    games_col.delete_one({"_id": ObjectId(game_id)})
    # Also delete all debts for this game
    debts_col.delete_many({"game_id": game_id})
    return jsonify({"success": True})


# ---------- Allowed Players per Game ----------
@app.route("/api/games/<game_id>/allowed", methods=["PUT"])
def set_allowed_players(game_id):
    """Set the list of allowed players for a game."""
    data = request.get_json()
    allowed = data.get("allowed_players", [])
    game = games_col.find_one({"_id": ObjectId(game_id)})
    if not game:
        return jsonify({"error": "Game not found"}), 404
    games_col.update_one({"_id": ObjectId(game_id)}, {"$set": {"allowed_players": allowed}})
    game = games_col.find_one({"_id": ObjectId(game_id)})
    return jsonify(game_to_dict(game))


# ---------- Debts (single record per pair) ----------
# Schema: { game_id: str, player_a: str, player_b: str, amount: int }
# player_a < player_b (alphabetically sorted — canonical ordering)
# amount > 0 → player_b owes player_a
# amount < 0 → player_a owes player_b


def canonical_pair(user1, user2):
    """Return (player_a, player_b, user1_is_a)."""
    if user1 < user2:
        return user1, user2, True
    else:
        return user2, user1, False


@app.route("/api/games/<game_id>/debts", methods=["GET"])
def get_game_debts(game_id):
    """Return balances oriented for the requesting user.
    Each item: { other: str, amount: int }
    amount > 0 → the other owes me  |  amount < 0 → I owe the other."""
    username = request.args.get("username", "")
    if not username:
        raw = list(debts_col.find({"game_id": game_id}, {"_id": 0}))
        return jsonify(raw)

    raw = list(debts_col.find({
        "game_id": game_id,
        "$or": [{"player_a": username}, {"player_b": username}]
    }, {"_id": 0}))

    oriented = []
    for d in raw:
        if d["player_a"] == username:
            oriented.append({"other": d["player_b"], "amount": d["amount"]})
        else:
            oriented.append({"other": d["player_a"], "amount": -d["amount"]})
    return jsonify(oriented)


@app.route("/api/games/<game_id>/debt", methods=["PUT"])
def set_debt(game_id):
    """Set balance between two users.
    Body: { user, other, amount } — amount from user's perspective (-50 to +50, step 5).
    amount > 0 → other owes user  |  amount < 0 → user owes other."""
    data = request.get_json()
    user = data.get("user", "")
    other = data.get("other", "")
    amount = data.get("amount", 0)

    if user == other:
        return jsonify({"error": "Cannot owe yourself"}), 400

    if amount < -50 or amount > 50 or amount % 5 != 0:
        return jsonify({"error": "Amount must be -50 to +50 in steps of 5"}), 400

    player_a, player_b, user_is_a = canonical_pair(user, other)
    canonical_amount = amount if user_is_a else -amount

    if canonical_amount == 0:
        debts_col.delete_one({"game_id": game_id, "player_a": player_a, "player_b": player_b})
    else:
        debts_col.update_one(
            {"game_id": game_id, "player_a": player_a, "player_b": player_b},
            {"$set": {"amount": canonical_amount}},
            upsert=True
        )

    return jsonify({"success": True, "user": user, "other": other, "amount": amount})


# ---------- Polling optimization ----------
@app.route("/api/games/<game_id>/poll", methods=["GET"])
def poll_game(game_id):
    """Lightweight poll endpoint. Returns a hash of the game+debts state.
    Client compares hash — only fetches full data when hash changes."""
    username = request.args.get("username", "")
    game = games_col.find_one({"_id": ObjectId(game_id)})
    if not game:
        return jsonify({"hash": "none"})
    debts = list(debts_col.find({
        "game_id": game_id,
        "$or": [{"player_a": username}, {"player_b": username}]
    }, {"_id": 0}))
    # Build a deterministic string from game players + debts
    state_str = json.dumps({
        "players": game.get("players", []),
        "open": game.get("open", True),
        "allowed_players": game.get("allowed_players", []),
        "debts": sorted(debts, key=lambda d: (d.get("player_a",""), d.get("player_b","")))
    }, sort_keys=True)
    state_hash = hashlib.md5(state_str.encode()).hexdigest()
    return jsonify({"hash": state_hash})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(debug=False, host="0.0.0.0", port=port)
