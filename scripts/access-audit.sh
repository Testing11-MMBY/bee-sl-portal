#!/usr/bin/env bash
# Compile the permission config (the same source the app uses) and run the
# automated navigation & permission audit. Exits non-zero on any violation.
set -euo pipefail
cd "$(dirname "$0")/.."
BUILD="$(mktemp -d)"
trap 'rm -rf "$BUILD"' EXIT
npx tsc lib/roles.ts lib/categories.ts lib/screens.ts \
  --outDir "$BUILD" --module commonjs --target es2022 \
  --moduleResolution node --skipLibCheck --esModuleInterop >/dev/null
AA_BUILD="$BUILD" node scripts/access-audit.cjs
