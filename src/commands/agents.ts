import { Command } from "commander";
import kleur from "kleur";
import prompts from "prompts";
import { api } from "../lib/api.js";

interface Agent {
  id: string;
  name: string;
  tier: string;
  description?: string;
  declared_capabilities: string[];
}

export const agentsCmd = new Command("agents").description("Manage agents");

agentsCmd
  .command("list")
  .description("List agents")
  .action(async () => {
    const r = await api<{ data: Agent[] }>("/v1/agents?limit=100");
    if (r.data.length === 0) return console.log(kleur.dim("No agents."));
    for (const a of r.data) {
      console.log(`${kleur.cyan(a.id)}  ${kleur.bold(a.name)}  ${kleur.dim(a.tier)}`);
    }
  });

agentsCmd
  .command("create")
  .description("Register an agent")
  .option("--name <name>")
  .option("--description <text>")
  .option("--interactive", "Prompt for fields")
  .action(async (opts: { name?: string; description?: string; interactive?: boolean }) => {
    let { name, description } = opts;
    if (opts.interactive || !name) {
      const a = await prompts([
        { type: "text", name: "name", message: "Agent name", initial: name },
        { type: "text", name: "description", message: "Description", initial: description },
        {
          type: "select",
          name: "tier",
          message: "Initial tier",
          choices: [
            { title: "low", value: "low" },
            { title: "medium", value: "medium" },
            { title: "high", value: "high" },
            { title: "restricted", value: "restricted" },
          ],
          initial: 1,
        },
      ]);
      name = a.name as string;
      description = a.description as string;
      const r = await api<Agent>("/v1/agents", {
        method: "POST",
        body: JSON.stringify({ name, description, tier: a.tier }),
      });
      console.log(kleur.green("✓ ") + `Created ${r.id}`);
      return;
    }
    const r = await api<Agent>("/v1/agents", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });
    console.log(kleur.green("✓ ") + `Created ${r.id}`);
  });
