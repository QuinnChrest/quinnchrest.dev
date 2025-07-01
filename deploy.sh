#!/bin/bash
set -e

# Pull the latest changes from the repository
git pull

# Install dependencies
npm install

# Build the SvelteKit app
npm run build

# Build the Docker image
docker build -t sveltekit-app .

# Stop and remove any existing container
if [ $(docker ps -aq -f name=quinnchrest.dev) ]; then
  docker stop quinnchrest.dev || true
  docker rm quinnchrest.dev || true
fi

# Run the Docker container on port 3000
docker run -d --name quinnchrest.dev -p 3000:3000 sveltekit-app

echo "Deployment complete! Your app is running on http://localhost:3000" 