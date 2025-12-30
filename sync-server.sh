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

echo "✓ Server folder copied successfully to functions/server"
