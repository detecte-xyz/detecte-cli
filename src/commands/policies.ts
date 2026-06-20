import { Command } from "commander";
import kleur from "kleur";
import { readFileSync } from "node:fs";
import { api } from "../lib/api.js";

interface Policy {
  id: string;
  name: string;
  enabled: boolean;
  agents: string[];
}

export const policiesCmd = new Command("policies").description("Manage policies");

policiesCmd
  .command("list")
  .description("List policies")
  .action(async () => {
    const r = await api<{ data: Policy[] }>("/v1/policies?limit=200");
    if (r.data.length === 0) return console.log(kleur.dim("No policies."));
    for (const p of r.data) {
      console.log(
        `${kleur.cyan(p.id)}  ${p.enabled ? kleur.green("●") : kleur.dim("○")} ${p.name}  ${kleur.dim(`agents=${p.agents.length || "all"}`)}`,
      );
    }
  });

policiesCmd
  .command("test <file>")
  .description("Dry-run a policy JSON file against historical actions")
  .option("--sample <n>", "sample size", "1000")
  .action(async (file: string, opts: { sample: string }) => {
    const policy = JSON.parse(readFileSync(file, "utf8")) as object;
    const r = await api<{
      sample_size: number;
      would_have_blocked: number;
      would_have_escalated: number;
      would_have_required_approval: number;
      would_have_allowed: number;
      examples: unknown[];
    }>("/v1/policies/dry-run", {
      method: "POST",
      body: JSON.stringify({ policy, sample_size: Number(opts.sample) }),
    });
    console.log(kleur.bold(`Dry-run over ${r.sample_size} actions`));
    console.log(`  ${kleur.red("blocked")}:           ${r.would_have_blocked}`);
    console.log(`  ${kleur.yellow("escalated")}:         ${r.would_have_escalated}`);
    console.log(`  ${kleur.yellow("required approval")}: ${r.would_have_required_approval}`);
    console.log(`  ${kleur.green("allowed")}:           ${r.would_have_allowed}`);
  });
