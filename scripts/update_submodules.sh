#!/bin/bash

# Navigate to the root directory of the monorepo
cd "$(dirname "$0")/.."

# Update each submodule to the latest commit on their respective main branches
echo "Updating each submodule to the latest commit on their respective main branches..."
git submodule foreach '
  branch=$(git rev-parse --abbrev-ref HEAD)
  if [ "$branch" == "main" ]; then
    git fetch origin main
    git reset --hard origin/main
  else
    git checkout main
    git fetch origin main
    git reset --hard origin/main
  fi
'

# Stage and commit the changes in the monorepo
echo "Staging and committing the changes in the monorepo..."
git add .
echo "Committing changes..."
git commit -m "chore: Sync submodule references to latest main branches"
echo "Pushing changes..."
git push
