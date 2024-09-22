#!/bin/bash

# Navigate to the parent directory of the project
cd "$(dirname "$0")/.." || exit

# Start the application
docker-compose up app frontend