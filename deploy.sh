#!/bin/bash

# Pull latest code
git pull

# Create necessary environment files
echo "REACT_APP_API_URL=http://18.218.119.92:8000" > client/.env.production

# Build and start containers
docker-compose down
docker-compose build
docker-compose up -d 