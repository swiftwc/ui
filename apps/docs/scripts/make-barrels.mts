import data from '@swiftwc/ui/customElements/en' with { type: 'json' }
import webData from '@swiftwc/ui/webComponentsHTMLData/en' with { type: 'json' }
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as prettier from 'prettier'

const __dirname = dirname(fileURLToPath(import.meta.url))

await rm(resolve(__dirname, `../generated`), { recursive: true, force: true })
await mkdir(resolve(__dirname, `../generated`), { recursive: true })

await rm(resolve(__dirname, `../web-components`), { recursive: true, force: true })
await mkdir(resolve(__dirname, `../web-components`), { recursive: true })

for await (const [i, mod] of data.modules.entries()) {
  for await (const dec of mod.declarations) {
    let reflections = ''

    const desc = webData.tags.find((item) => item?.name === dec.tagName)?.description ?? '',
      topicsMd = -1 < desc.indexOf('### **Examples:**') ? desc.slice(desc.indexOf('### **Examples:**')).replaceAll('### **Examples:**', '## Topics') : ''

    // const attrs = webData.tags.find((item) => item?.name === dec.tagName)?.attributes

    // try {
    //   reflections = `\n## Parameters\n\n${await readFile(resolve(__dirname, `../reflections/${dec.tagName}.md`), "utf8")}\n`;
    // } catch {
    //   //
    // }

    let partial = ''

    try {
      partial = `\n${await readFile(resolve(__dirname, `../partials/${dec.tagName}.md`), 'utf8')}\n`
    } catch {
      //
    }

    const declaration = webData.tags.find((item) => item?.name === dec.tagName)?.description?.match(/```ts([\s\S]*?)```/)?.[1]

    await writeFile(
      resolve(__dirname, `../web-components/${dec.tagName}.md`),
      `${0 === i ? `---\nprev:\n  text: "Web Components"\n  link: "/web-components/"\n---\n\n` : data.modules.length - 1 === i ? `---\nnext:\n  text: "Installation"\n  link: "/installation/"\n---\n\n` : ''}<!-- #region pre -->

# ${dec.name}

###### ${dec.description}${dec.description && !dec.description.endsWith('.') ? '.' : ''}

\`\`\`ts
${declaration}
\`\`\`

<!-- #endregion pre -->\n${partial}\n<!-- #region post -->
${reflections}
${topicsMd}

## Relationships

### Conforms To

\`${dec.superclass.name}\`

<!-- #endregion post -->`
    )
  }
}

// create barrel file from all the files
await writeFile(
  resolve(__dirname, `../web-components/index.md`),
  `<!-- !! AUTO GENERATED DON’T TOUCH !! -->

<!--@include: ../partials/index.md-->

<div class="@container"><div class="grid gap-x-6 gap-y-3 grid-cols-2 @2xl:grid-cols-3 *:m-0!">

${(await Promise.all(data.modules.map((item, index) => `#### [${item.declarations[0].name}](/web-components/${item.declarations[0].tagName}.md) {#no-anchor${index}}`))).join(`\n\n`)}

</div></div>
`
)

// create barrel file from all the files
await writeFile(
  resolve(__dirname, `../partials/html-data-value-sets.md`),
  `<!-- !! AUTO GENERATED DON’T TOUCH !! -->

${(
  await Promise.all(
    webData.valueSets.map(
      async (item, index) => `
<div class="relative group">
<input type="checkbox" id="show-more${index}" class="peer hidden">

<div class="relative max-h-40 overflow-hidden peer-checked:max-h-none">

\n\n\`\`\`ts\n${await prettier.format(
        `enum ${item.name} {
${item.values
  .map((item, index) => {
    return `  '${item.name}\', // ${item?.description ?? ''}`
  })
  .join(`\n`)}
}`,
        { parser: 'typescript', singleQuote: true, semi: false }
      )}\n\`\`\`

<div class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent group-has-checked:hidden"></div>

</div>

<label for="show-more${index}" class="group-has-checked:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-1 text-sm font-medium text-gray-700 shadow-sm select-none z-1">Show more</label>

<label for="show-more${index}" class="hidden group-has-checked:block absolute -bottom-0 left-1/2 -translate-x-1/2 cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-1 text-sm font-medium text-gray-700 shadow-sm select-none z-1">Show less</label>

</div>

`
    )
  )
).join(`\n\n`)}

`
)
