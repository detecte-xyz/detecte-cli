#!/usr/bin/env node
import { Command } from "commander";
import kleur from "kleur";
import { loginCmd } from "./commands/login.js";
import { initCmd } from "./commands/init.js";
import { keysCmd } from "./commands/keys.js";
import { agentsCmd } from "./commands/agents.js";
import { policiesCmd } from "./commands/policies.js";
import { logsCmd } from "./commands/logs.js";
import { scanCmd } from "./commands/scan.js";
import { statusCmd } from "./commands/status.js";
import { openCmd } from "./commands/open.js";

const program = new Command();

program
  .name("detecte")
  .description(kleur.dim("Runtime security for AI agents — https://detecte.xyz"))
  .version("0.1.0");

program.addCommand(loginCmd);
program.addCommand(initCmd);
program.addCommand(keysCmd);
program.addCommand(agentsCmd);
program.addCommand(policiesCmd);
program.addCommand(logsCmd);
program.addCommand(scanCmd);
program.addCommand(statusCmd);
program.addCommand(openCmd);

program.parseAsync(process.argv).catch((err) => {
  console.error(kleur.red("✗ ") + (err instanceof Error ? err.message : String(err)));
  process.exit(1);
});
