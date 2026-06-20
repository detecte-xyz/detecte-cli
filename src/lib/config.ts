import { homedir } from "node:os";
import { join } from "node:path";
import { mkdirSync, readFileSync, writeFileSync, existsSync, chmodSync } from "node:fs";

const CONFIG_DIR = join(homedir(), ".detecte");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");

export interface Config {
  apiKey?: string;
  apiUrl?: string;
  workspaceId?: string;
}

export function loadConfig(): Config {
  if (!existsSync(CONFIG_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf8")) as Config;
  } catch {
    return {};
  }
}

export function saveConfig(cfg: Config): void {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
  try {
    chmodSync(CONFIG_PATH, 0o600);
  } catch {}
}

export function apiUrl(): string {
  return process.env.DETECTE_API_URL ?? loadConfig().apiUrl ?? "https://api.detecte.xyz";
}

export function apiKey(): string {
  const k = process.env.DETECTE_API_KEY ?? loadConfig().apiKey;
  if (!k) {
    throw new Error("Not logged in. Run `detecte login` or set DETECTE_API_KEY.");
  }
  return k;
}
