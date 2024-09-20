#!/bin/bash

# Navigate to the parent directory of the project
cd "$(dirname "$0")/.." || exit

# Stop the database
docker-compose stop db