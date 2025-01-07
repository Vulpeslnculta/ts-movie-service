#!/bin/bash

echo "Starting up the application..."
echo "This script will prompt you for environment variables and then run docker-compose commands."

# Prompt user for environment variables
read -p "Enter JWT_SECRET: " JWT_SECRET
read -p "Enter MONGO_DB_URI: " MONGO_DB_URI
read -p "Enter OMDB_API_KEY: " OMDB_API_KEY

# Export environment variables
export JWT_SECRET
export MONGO_DB_URI
export OMDB_API_KEY

# Run docker-compose commands
docker-compose build
docker-compose up