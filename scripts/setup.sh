#!/bin/bash

# Navigate to the root directory of the monorepo
cd "$(dirname "$0")/.."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
  echo "pnpm is not installed. Please install it globally using the following command:"
  echo "npm install -g pnpm"
  exit 1
fi

# Initialize and update all submodules
echo "Initializing and updating all submodules..."
git submodule update --init --recursive

# Install dependencies for all directories
echo "Installing dependencies for all directories..."
pnpm install

# Build the project packages
echo "Building the project packages..."
pnpm build

