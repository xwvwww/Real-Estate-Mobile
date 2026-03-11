#!/usr/bin/env bash
set -euo pipefail

if grep -RInE '^(<<<<<<<|=======|>>>>>>>)' \
  --exclude-dir=.git \
  --exclude-dir=node_modules \
  .; then
  echo ""
  echo "Found unresolved merge markers. Resolve them before commit/merge."
  exit 1
fi

echo "OK: no merge markers found."
