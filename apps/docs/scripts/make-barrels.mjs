import data from "@swiftwc/ui/customElements/en" with { type: "json" };
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

await rm(resolve(__dirname, `../generated`), { recursive: true, force: true });
await mkdir(resolve(__dirname, `../generated`), { recursive: true });

await rm(resolve(__dirname, `../web-components`), { recursive: true, force: true });
await mkdir(resolve(__dirname, `../web-components`), { recursive: true });

for await (const [i, mod] of data.modules.entries()) {
  for await (const dec of mod.declarations) {
    let reflections = "";

    try {
      reflections = `\n## Parameters\n\n${await readFile(resolve(__dirname, `../reflections/${dec.tagName}.md`), "utf8")}\n`;
    } catch {
      //
    }

    let partial = "";

    try {
      partial = `\n${await readFile(resolve(__dirname, `../partials/${dec.tagName}.md`), "utf8")}\n`;
    } catch {
      //
    }

    await writeFile(
      resolve(__dirname, `../web-components/${dec.tagName}.md`),
      `${0 === i ? `---\nprev:\n  text: "Web Components"\n  link: "/web-components/"\n---\n\n` : data.modules.length - 1 === i ? `---\nnext:\n  text: "Installation"\n  link: "/installation/"\n---\n\n` : ""}<!-- #region pre -->\n\n# ${dec.name}\n\n${dec.description}.\n\n<!-- #endregion pre -->\n${partial}\n<!-- #region post -->\n${reflections}\n## Relationships\n\n### Conforms To\n\n\`${dec.superclass.name}\`\n\n<!-- #endregion post -->`,
    );
  }
}

await writeFile(
  resolve(__dirname, `../web-components/index.md`),
  `<!--@include: ../partials/index.md-->\n\n@grids gap-x-12 gap-y-1 grid-cols-3\n\n${(await Promise.all(data.modules.map((item) => `#### [${item.declarations[0].name}](/web-components/${item.declarations[0].tagName}.md)`))).join(`\n\n`)}\n\n@end\n`,
);
