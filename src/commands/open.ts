import { Command } from "commander";
import open from "open";

export const openCmd = new Command("open")
  .description("Open the dashboard in your browser")
  .argument("[page]", "agents | policies | incidents | audit | settings", "")
  .action(async (page: string) => {
    const url = `https://app.detecte.xyz/${page}`.replace(/\/$/, "");
    await open(url);
  });
