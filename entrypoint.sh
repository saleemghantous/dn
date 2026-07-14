#!/bin/sh
set -e

# Start MongoDB, bound to localhost only (not reachable outside this container).
mongod --dbpath /data/db --bind_ip 127.0.0.1 --logpath /var/log/mongodb/mongod.log --fork

# Wait for MongoDB to accept connections before starting the app.
until mongosh --quiet --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  echo "Waiting for MongoDB to start..."
  sleep 1
done
echo "MongoDB is up."

exec gunicorn -b 0.0.0.0:"${PORT:-5050}" app:app
