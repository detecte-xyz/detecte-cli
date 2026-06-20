import { Command } from "commander";
import kleur from "kleur";
import ora from "ora";
import { api } from "../lib/api.js";

interface ScanResult {
  agent_id: string;
  score: number;
  tier: "low" | "medium" | "high" | "restricted";
  tests_passed?: number;
  tests_total?: number;
  credential?: string;
  expires_at?: string;
}

export const scanCmd = new Command("scan")
  .description("Run the KYA verification battery on an agent")
  .argument("<agent-id>", "agent id (agent_…)")
  .action(async (agentId: string) => {
    const spinner = ora(`Running KYA battery on ${agentId}…`).start();
    try {
      const r = await api<ScanResult>(`/v1/agents/${agentId}/verify`, { method: "POST" });
      spinner.succeed("Battery complete");
      console.log("");
      const tierColor = ({ low: kleur.green, medium: kleur.cyan, high: kleur.yellow, restricted: kleur.red } as const)[r.tier];
      console.log(`  Score:  ${kleur.bold(String(r.score))}/100`);
      console.log(`  Tier:   ${tierColor(r.tier)}`);
      if (r.tests_passed != null && r.tests_total != null) {
        console.log(`  Tests:  ${r.tests_passed}/${r.tests_total} passed`);
      }
      if (r.expires_at) {
        console.log(`  Valid:  until ${new Date(r.expires_at).toLocaleString()}`);
      }
    } catch (e) {
      spinner.fail((e as Error).message);
      process.exit(1);
    }
  });
