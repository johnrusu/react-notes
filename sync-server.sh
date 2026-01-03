#!/bin/bash

# Copy server folder to functions/server
echo "Copying server folder to functions/server..."

# Remove existing functions/server directory if it exists
if [ -d "functions/server" ]; then
  echo "Removing existing functions/server..."
  rm -rf functions/server
fi

# Copy server directory to functions/server
cp -r server functions/server

# Copy package-lock.json to functions directory to ensure sync
if [ -f "functions/package-lock.json" ]; then
  cp functions/package-lock.json functions/package-lock.json.bak
fi

echo "✓ Server folder copied successfully to functions/server"
