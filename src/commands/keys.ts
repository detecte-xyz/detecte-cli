import { Command } from "commander";
import kleur from "kleur";
import { api } from "../lib/api.js";

interface ApiKey {
  id: string;
  env: "test" | "live";
  prefix: string;
  name: string | null;
  last_used_at: string | null;
  created_at: string;
}

export const keysCmd = new Command("keys").description("Manage API keys");

keysCmd
  .command("list")
  .description("List active API keys")
  .action(async () => {
    const data = await api<{ data: ApiKey[] }>("/v1/keys");
    if (data.data.length === 0) {
      console.log(kleur.dim("No keys."));
      return;
    }
    for (const k of data.data) {
      console.log(
        `${kleur.cyan(k.prefix)}…  ${k.env === "live" ? kleur.green("LIVE") : kleur.gray("TEST")}  ${k.name ?? "—"}  ${kleur.dim(k.id)}`,
      );
    }
  });

keysCmd
  .command("create")
  .description("Create a new API key")
  .option("--env <env>", "test | live", "test")
  .option("--name <name>", "key name")
  .action(async (opts: { env: "test" | "live"; name?: string }) => {
    const r = await api<{ key: string; prefix: string; id: string }>("/v1/keys", {
      method: "POST",
      body: JSON.stringify({ env: opts.env, name: opts.name }),
    });
    console.log(kleur.bold("Save this — shown once:"));
    console.log("  " + kleur.green(r.key));
    console.log(kleur.dim(`  ${r.prefix}…  id=${r.id}`));
  });

keysCmd
  .command("revoke <id>")
  .description("Revoke a key by id")
  .action(async (id: string) => {
    await api(`/v1/keys/${id}`, { method: "DELETE" });
    console.log(kleur.green("✓ ") + `Revoked ${id}`);
  });
