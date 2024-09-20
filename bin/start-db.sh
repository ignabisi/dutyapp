#!/bin/bash

# Navigate to the parent directory of the project
cd "$(dirname "$0")/.." || exit

# Start the database in detached mode
docker-compose up -d db