import { Command } from "commander";
import prompts from "prompts";
import kleur from "kleur";
import open from "open";
import { saveConfig, loadConfig } from "../lib/config.js";

export const loginCmd = new Command("login")
  .description("Authenticate the CLI with your Detecte workspace")
  .option("--api-key <key>", "Use a key directly (sk_test_… or sk_live_…)")
  .option("--api-url <url>", "Override the API URL")
  .action(async (opts: { apiKey?: string; apiUrl?: string }) => {
    let key = opts.apiKey;
    if (!key) {
      console.log(
        kleur.dim("Opening dashboard so you can copy a key from Settings → API keys…"),
      );
      try {
        await open("https://app.detecte.xyz/settings");
      } catch {}
      const a = await prompts({
        type: "password",
        name: "key",
        message: "Paste your API key",
        validate: (v: string) =>
          /^sk_(test|live)_[A-Za-z0-9]{24,}$/.test(v) || "Doesn't look like a valid sk_ key",
      });
      key = a.key as string;
    }
    if (!key) process.exit(1);
    saveConfig({ ...loadConfig(), apiKey: key, apiUrl: opts.apiUrl });
    console.log(kleur.green("✓ ") + "Saved to ~/.detecte/config.json");
  });
