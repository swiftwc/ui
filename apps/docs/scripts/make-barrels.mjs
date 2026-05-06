import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function getMarkdownTitles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const mdFiles = entries.filter((e) => e.isFile() && e.name.endsWith(".md")).map((e) => e.name);

  const results = [];

  for await (const file of mdFiles) {
    const fullPath = join(dir, file);
    const content = await readFile(fullPath, "utf-8");
    if (fullPath.endsWith("index.md")) continue;
    // Extract first H1 (# Title)
    const match = content.match(/^#\s+(.+)$/m);

    results.push({
      file,
      title: match ? match[1].trim() : undefined,
    });
  }

  return results;
}

const items = await getMarkdownTitles(resolve(__dirname, "../web-components"));

const content = `
${items.map((i) => (i.file.endsWith("barrel.md") ? "" : `\n@flex\n\n#### [${i.title ?? i.file}](/web-components/${i.file})\n`)).join("\n")}
`;

await writeFile(resolve(__dirname, "../web-components/barrel.md"), content);
