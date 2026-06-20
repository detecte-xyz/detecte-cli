import { Command } from "commander";
import kleur from "kleur";
import { apiUrl } from "../lib/config.js";

export const statusCmd = new Command("status")
  .description("Show health of api.detecte.xyz")
  .action(async () => {
    const t0 = Date.now();
    try {
      const res = await fetch(`${apiUrl()}/health`);
      const latency = Date.now() - t0;
      if (res.ok) {
        const data = (await res.json()) as { ok: boolean; region?: string };
        console.log(`${kleur.green("✓")} ${apiUrl()}  ${kleur.dim(`region=${data.region ?? "?"}  ${latency}ms`)}`);
      } else {
        console.log(`${kleur.red("✗")} ${apiUrl()}  ${res.status}`);
      }
    } catch (e) {
      console.log(`${kleur.red("✗")} ${apiUrl()}  ${(e as Error).message}`);
    }
  });
