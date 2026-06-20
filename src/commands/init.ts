import { Command } from "commander";
import prompts from "prompts";
import kleur from "kleur";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export const initCmd = new Command("init")
  .description("Scaffold a starter project that uses @detecte/sdk")
  .argument("[dir]", "directory to create", "detecte-starter")
  .option("--framework <name>", "vercel-ai | langchain | mcp | bare", "bare")
  .action(async (dir: string, opts: { framework: string }) => {
    if (existsSync(dir)) {
      console.error(kleur.red(`✗ ${dir} already exists`));
      process.exit(1);
    }
    const a = await prompts([
      { type: "text", name: "name", message: "Project name", initial: dir },
    ]);

    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "package.json"), pkg(a.name as string, opts.framework));
    writeFileSync(join(dir, ".env.example"), envExample());
    writeFileSync(join(dir, "tsconfig.json"), tsconfig());
    writeFileSync(join(dir, "README.md"), readme(a.name as string, opts.framework));
    mkdirSync(join(dir, "src"), { recursive: true });
    writeFileSync(join(dir, "src/index.ts"), entry(opts.framework));

    console.log("");
    console.log(kleur.green("✓ ") + `Scaffolded ${a.name} (${opts.framework})`);
    console.log("");
    console.log(kleur.dim("Next:"));
    console.log(`  cd ${dir}`);
    console.log("  cp .env.example .env  # paste your DETECTE_API_KEY");
    console.log("  npm install");
    console.log("  npm start");
  });

const pkg = (name: string, framework: string) =>
  JSON.stringify(
    {
      name,
      version: "0.0.1",
      private: true,
      type: "module",
      scripts: {
        start: "tsx src/index.ts",
      },
      dependencies: {
        "@detecte/sdk": "^0.1.1",
        ...(framework === "vercel-ai" ? { ai: "^3.4.0", "@ai-sdk/openai": "^0.0.66" } : {}),
        tsx: "^4.16.0",
      },
    },
    null,
    2,
  );

const envExample = () => `DETECTE_API_KEY=sk_test_replace_me
`;

const tsconfig = () =>
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
      },
      include: ["src"],
    },
    null,
    2,
  );

const entry = (framework: string) => {
  if (framework === "vercel-ai") {
    return `import "dotenv/config";
import { Detecte } from "@detecte/sdk";
import { detecteWrap } from "@detecte/sdk/integrations/vercel-ai";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const detecte = new Detecte({ apiKey: process.env.DETECTE_API_KEY! });

const guarded = detecteWrap(
  { model: openai("gpt-4o-mini"), tools: { /* ... */ } },
  { detecte, agentId: "agent_starter" }
);

const { text } = await generateText({
  model: guarded.model,
  tools: guarded.tools,
  prompt: "Refund order ord_123 for $42.",
});

console.log(text);
`;
  }
  return `import "dotenv/config";
import { Detecte } from "@detecte/sdk";

const detecte = new Detecte({ apiKey: process.env.DETECTE_API_KEY! });

const decision = await detecte.verify({
  agent: "starter_bot",
  action: "refund_order",
  params: { orderId: "ord_8821", amount: 49.99 },
});

console.log(decision.allowed ? "ALLOWED" : "BLOCKED:", decision.reason ?? "");
`;
};

const readme = (name: string, framework: string) => `# ${name}

A Detecte starter (${framework}).

\`\`\`bash
cp .env.example .env
npm install
npm start
\`\`\`
`;
