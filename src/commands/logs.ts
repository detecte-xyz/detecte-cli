import { Command } from "commander";
import kleur from "kleur";
import { apiStream } from "../lib/api.js";

export const logsCmd = new Command("logs")
  .description("Tail decisions in real time")
  .option("--agent <id>")
  .option("--status <status>", "allowed | blocked | escalated | pending_approval")
  .action(async (opts: { agent?: string; status?: string }) => {
    const ctrl = new AbortController();
    process.on("SIGINT", () => ctrl.abort());
    const qs = new URLSearchParams();
    if (opts.agent) qs.set("agent", opts.agent);
    if (opts.status) qs.set("status", opts.status);
    const path = `/v1/stream/decisions${qs.toString() ? `?${qs}` : ""}`;
    console.log(kleur.dim(`tailing ${path} — ctrl-c to exit`));
    const res = await apiStream(path, ctrl.signal);
    if (!res.body) throw new Error("No stream body");
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    while (!ctrl.signal.aborted) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const events = buf.split("\n\n");
      buf = events.pop() ?? "";
      for (const ev of events) {
        const dataLine = ev.split("\n").find((l) => l.startsWith("data: "));
        if (!dataLine) continue;
        try {
          const d = JSON.parse(dataLine.slice(6)) as {
            id: string;
            agent_id: string;
            action: string;
            status: string;
            reason?: string | null;
            created_at: string;
          };
          if ("status" in d) {
            const color =
              d.status === "blocked"
                ? kleur.red
                : d.status === "escalated"
                  ? kleur.yellow
                  : d.status === "allowed"
                    ? kleur.green
                    : kleur.cyan;
            console.log(
              `${kleur.dim(d.created_at.slice(11, 19))}  ${color(d.status.padEnd(18))}  ${kleur.bold(d.action)}  ${kleur.dim(d.agent_id)}${d.reason ? "  " + kleur.dim(d.reason) : ""}`,
            );
          }
        } catch {}
      }
    }
  });
