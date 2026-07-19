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

    // try {
    //   reflections = `\n## Parameters\n\n${await readFile(resolve(__dirname, `../reflections/${dec.tagName}.md`), "utf8")}\n`;
    // } catch {
    //   //
    // }

    let partial = "";

    try {
      partial = `\n${await readFile(resolve(__dirname, `../partials/${dec.tagName}.md`), "utf8")}\n`;
    } catch {
      //
    }

    await writeFile(
      resolve(__dirname, `../web-components/${dec.tagName}.md`),
      `${0 === i ? `---\nprev:\n  text: "Web Components"\n  link: "/web-components/"\n---\n\n` : data.modules.length - 1 === i ? `---\nnext:\n  text: "Installation"\n  link: "/installation/"\n---\n\n` : ""}<!-- #region pre -->\n\n# ${dec.name}\n\n${dec.description}${dec.description && !dec.description.endsWith(".") ? "." : ""}\n\n<!-- #endregion pre -->\n${partial}\n<!-- #region post -->\n${reflections}\n## Relationships\n\n### Conforms To\n\n\`${dec.superclass.name}\`\n\n<!-- #endregion post -->`,
    );
  }
}

await writeFile(
  resolve(__dirname, `../web-components/index.md`),
  `<!-- !! AUTO GENERATED DON’T TOUCH !! -->\n\n<!--@include: ../partials/index.md-->\n\n<div class="@container"><div class="grid gap-x-6 gap-y-3 grid-cols-2 @2xl:grid-cols-3 *:m-0!">\n\n${(await Promise.all(data.modules.map((item, index) => `#### [${item.declarations[0].name}](/web-components/${item.declarations[0].tagName}.md) {#no-anchor${index}}`))).join(`\n\n`)}\n\n</div></div>\n`,
);
