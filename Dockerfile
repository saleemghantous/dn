FROM python:3.11-slim

# --- Install MongoDB Community Server 7.0 (Debian bookworm) ---
RUN apt-get update && apt-get install -y --no-install-recommends \
        curl gnupg ca-certificates \
    && curl -fsSL https://pgp.mongodb.com/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg \
    && echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" \
        > /etc/apt/sources.list.d/mongodb-org-7.0.list \
    && apt-get update && apt-get install -y --no-install-recommends mongodb-org \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /data/db /var/log/mongodb

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x /app/entrypoint.sh

# Local-only Mongo instance running inside this same container.
# NOTE: without a Render Persistent Disk mounted at /data/db, this data
# is wiped every time the container restarts/redeploys/spins down.
ENV MONGO_DB_URL=mongodb://127.0.0.1:27017/emrgcall

EXPOSE 5050

CMD ["/app/entrypoint.sh"]
