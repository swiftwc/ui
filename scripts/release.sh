#!/usr/bin/env bash
# release.sh — bump a canary prerelease, merge into main, push (CI builds + publishes to npm)
set -euo pipefail

PKG="${1:?Usage: ./release.sh <workspace-name> [<npm-version-arg>]}"
BUMP="${2:-prerelease}"

git checkout canary
git pull

npm run typecheck -w "$PKG"

npm version "$BUMP" --no-git-tag-version --preid=canary -w "$PKG"

WORKSPACE_DIR=$(npm ls -w "$PKG" --parseable --depth=0 | head -n1)
NAME=$(node -p "require('$WORKSPACE_DIR/package.json').name")
VERSION=$(node -p "require('$WORKSPACE_DIR/package.json').version")
echo "$NAME@$VERSION"

git add -A
git commit -m "chore(release): ${NAME}@${VERSION}"

git checkout main
git pull
git merge --no-ff canary -m "Merge branch 'canary'"
git push

git checkout canary
git merge main
git push