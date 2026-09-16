#!/usr/bin/env bash
# promote.sh — move the current version forward to 'beta' or 'latest'
set -euo pipefail

PKG="${1:?Usage: ./promote.sh <workspace-name> <beta|latest>}"
CHANNEL="${2:?Usage: ./promote.sh <workspace-name> <beta|latest>}"

case "$CHANNEL" in
  beta|latest) ;;
  *) echo "Channel must be 'beta' or 'latest'" >&2; exit 1 ;;
esac

git checkout main
git pull

# npm version prerelease increments the prerelease number (same preid) or starts fresh at .0 (new preid)
# e.g. 1.2.4-canary.7 -> 1.2.4-canary.8   |   1.2.4 -> 1.2.5-canary.0

if [ "$CHANNEL" = "beta" ]; then
  # any other prerelease identifier -> beta.0, or 1.2.4 -> 1.2.5-beta.0 if starting fresh
  npm version prerelease --no-git-tag-version --preid=beta -w "$PKG"
else
  # strips whatever prerelease suffix is present, keeping the same x.y.z
  npm version patch --no-git-tag-version -w "$PKG"
fi

WORKSPACE_DIR=$(npm query ".workspace" --json | node -e "
  const workspaces = JSON.parse(require('fs').readFileSync(0, 'utf8'));
  const match = workspaces.find(w => w.name === process.argv[1]);
  if (!match) { console.error('Workspace not found: ' + process.argv[1]); process.exit(1); }
  console.log(match.location);
" "$PKG")
WORKSPACE_DIR="$(git rev-parse --show-toplevel)/$WORKSPACE_DIR"
NAME=$(node -p "require('$WORKSPACE_DIR/package.json').name")
VERSION=$(node -p "require('$WORKSPACE_DIR/package.json').version")

git add -A
git commit -m "chore(release): ${CHANNEL} ${NAME}@${VERSION}"
git push

git checkout canary
git pull
git merge main
git push