# Install workflows manually
GitHub token lacks `workflow` scope. To enable npm auto-publish on tag:
1. `mkdir -p .github/workflows`
2. Move `release.yml` to `.github/workflows/release.yml`
3. Add an `NPM_TOKEN` repo secret (Automation token from npmjs.com → Profile → Access Tokens)
4. Commit + push from GitHub UI.
