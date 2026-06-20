# @detecte/cli

The command-line interface for [Detecte](https://detecte.xyz) — runtime security for AI agents.

```bash
npm install -g @detecte/cli
detecte login
detecte status
```

## Commands

| Command | What it does |
|---|---|
| `detecte login` | Authenticate the CLI (paste an `sk_test_…` or `sk_live_…` key) |
| `detecte init [dir]` | Scaffold a starter project (`--framework vercel-ai\|langchain\|mcp\|bare`) |
| `detecte status` | Health check against `api.detecte.xyz` |
| `detecte open [page]` | Open the dashboard in your browser |
| `detecte keys list` | List active API keys |
| `detecte keys create --env test\|live --name "..."` | Create a key (shown once) |
| `detecte keys revoke <id>` | Revoke a key |
| `detecte agents list` | List registered agents |
| `detecte agents create --interactive` | Register a new agent |
| `detecte policies list` | List policies |
| `detecte policies test <file>` | Dry-run a policy JSON against historical actions |
| `detecte logs` | Tail decisions in real time (SSE) |
| `detecte logs --agent agent_xxx --status blocked` | Filtered tail |
| `detecte scan <agent-id>` | Run the KYA verification battery |

Config lives in `~/.detecte/config.json` (mode `0600`).

## License

MIT
