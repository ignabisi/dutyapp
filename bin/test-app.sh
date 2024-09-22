#!/bin/bash

DB_NAME="test_dutydb"

docker exec -it dutyapp-db-1 psql -U secret -d dutydb -c "CREATE DATABASE $DB_NAME;"

export NODE_ENV="test"

cd "$(dirname "$0")/.." || exit

# Run backend Jest tests using a specific Jest config
echo "Running backend tests..."
npx jest --verbose --detectOpenHandles --config jest.backend.config.js


cd frontend || exit

# Run frontend tests with yarn
echo "Running frontend tests..."
yarn test --verbose --detectOpenHandles
