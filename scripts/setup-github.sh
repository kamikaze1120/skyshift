#!/usr/bin/env bash
# One-time GitHub setup for Skyshift: creates the repo (public), pushes this
# scaffold, and locks down main per docs/RULES_COMPLIANCE.md / CONTRIBUTING.md.
#
# Requires: gh auth login (already done), run from the repo root.
# Usage: ./scripts/setup-github.sh [repo-name]

set -euo pipefail

REPO_NAME="${1:-skyshift}"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI not found on PATH. Install it (winget install GitHub.cli) and open a new terminal." >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Not logged in. Run: gh auth login" >&2
  exit 1
fi

OWNER="$(gh api user --jq .login)"

echo "Creating public repo ${OWNER}/${REPO_NAME} and pushing current branch..."
gh repo create "${REPO_NAME}" --public --source=. --remote=origin --push

echo "Enabling squash-merge only, auto-delete of merged branches, and disabling merge/rebase commits..."
gh api -X PATCH "repos/${OWNER}/${REPO_NAME}" \
  -f allow_squash_merge=true \
  -f allow_merge_commit=false \
  -f allow_rebase_merge=false \
  -f delete_branch_on_merge=true >/dev/null

echo "Enabling secret scanning + push protection..."
gh api -X PATCH "repos/${OWNER}/${REPO_NAME}" \
  -f "security_and_analysis[secret_scanning][status]=enabled" \
  -f "security_and_analysis[secret_scanning_push_protection][status]=enabled" >/dev/null || \
  echo "  (secret scanning API call failed — enable manually under Settings > Code security if this repo isn't eligible for it on your plan)"

echo "Setting branch protection on main (1 approval, passing CI, linear history, no force-push/deletion)..."
gh api -X PUT "repos/${OWNER}/${REPO_NAME}/branches/main/protection" \
  --input - <<JSON
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Secret scan (gitleaks)", "Block large / raw FITS files", "Conventional Commits PR title"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON

echo "Done. Repo: https://github.com/${OWNER}/${REPO_NAME}"
echo "Admin bypass on branch protection stays on by default, so you can still merge solo until teammates join."
