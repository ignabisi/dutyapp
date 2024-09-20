#!/bin/bash

DB_NAME="test_dutydb"

docker exec -it dutyapp-db-1 psql -U secret -d dutydb -c "CREATE DATABASE $DB_NAME;"

export NODE_ENV="test"

# # Navigate to the parent directory of the project
cd "$(dirname "$0")/.." || exit

# # Run Jest tests
npx jest --verbose --detectOpenHandles