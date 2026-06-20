import { apiKey, apiUrl } from "./config.js";

export async function api<T>(
  path: string,
  init: RequestInit & { stream?: false } = {},
): Promise<T> {
  const res = await fetch(`${apiUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey()}`,
      "User-Agent": "detecte-cli/0.1.0",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return (await res.json()) as T;
}

export async function apiStream(path: string, signal?: AbortSignal): Promise<Response> {
  const res = await fetch(`${apiUrl()}${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      Accept: "text/event-stream",
      "User-Agent": "detecte-cli/0.1.0",
    },
    signal,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res;
}
