import data from '@swiftwc/ui/customElements/en' with { type: 'json' }
import webData from '@swiftwc/ui/webComponentsHTMLData/en' with { type: 'json' }
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

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

    const attrs = webData.tags.find((item) => item?.name === dec.tagName)?.attributes

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

    let declaration = `<${dec.tagName}></${dec.tagName}>`
    switch (dec.superclass.name) {
      case 'HTMLButtonElement':
        declaration = `<button is="${dec.tagName}"></button>`
        break
      case 'HTMLDialogElement':
        declaration = `<dialog is="${dec.tagName}"></dialog>`
        break
      case 'HTMLDetailsElement':
        declaration = `<details is="${dec.tagName}"></details>`
        break
      case 'HTMLFormElement':
        declaration = `<form is="${dec.tagName}"></form>`
        break
    }

    await writeFile(
      resolve(__dirname, `../web-components/${dec.tagName}.md`),
      `${0 === i ? `---\nprev:\n  text: "Web Components"\n  link: "/web-components/"\n---\n\n` : data.modules.length - 1 === i ? `---\nnext:\n  text: "Installation"\n  link: "/installation/"\n---\n\n` : ''}<!-- #region pre -->

# ${dec.name}

###### ${dec.description}${dec.description && !dec.description.endsWith('.') ? '.' : ''}

\`${declaration}\`

<!-- #endregion pre -->\n${partial}\n<!-- #region post -->
${reflections}
${topicsMd}

## Relationships

### Conforms To

\`${dec.superclass.name}\`
## Reference

${
  attrs?.length
    ? `
### Attributes

<div class="*:w-full *:table-fixed *:table!">

| Name          |      Type     |  Description  |
| ------------- | :-----------: | ------------- |
${(
  await Promise.all(
    attrs.map((item, index) => {
      return `| **\`${item.name}\`** | ${
        'valueSet' in item
          ? `[\`${item.valueSet}\`](/installation/editor-setup/html-data.json#${item.valueSet?.toLowerCase()})`
          : 'values' in item
            ? `\`"${item.values?.map((item) => item.name)?.join('" \\| "')}"\``
            : 'description' in item
              ? `\`${(item?.description ?? '').match(/Value Type: ([^\r\n]*)/)?.[1]}\``
              : '`string`'
      } | ${'description' in item ? (-1 < (item?.description?.indexOf('Description:') ?? -1) ? item?.description?.slice(item?.description?.lastIndexOf('Description:') + 12) : '') : ''} |`
    })
  )
).join(`\n`)}

</div>`
    : `
### No Attributes
`
}

${
  'slots' in dec
    ? `
### Slots

<div>

| Name          |  Description  |
| ------------- | ------------- |
${(
  await Promise.all(
    dec.slots.map((item, index) => {
      return `| ${item.name ? `**\`${item.name}\`**` : '_default_'} | ${'description' in item ? (item?.description ?? '') : ''} |`
    })
  )
).join(`\n`)}

</div>`
    : `
### No Slots
`
}

${
  'events' in dec
    ? `
### Events

<div>

| Name          |  Description  |
| ------------- | ------------- |
${(
  await Promise.all(
    dec.events.map((item, index) => {
      return `| **\`${item.name}\`** | ${'description' in item ? (item?.description ?? '') : ''} |`
    })
  )
).join(`\n`)}

</div>`
    : `
### No Events
`
}

${
  'members' in dec
    ? `
### Properties

<div class="*:w-full *:table-fixed *:table!">

| Name          |      Type     |  Description  |
| ------------- | :-----------: | ------------- |
${(
  await Promise.all(
    dec.members
      .filter((item) => 'field' === item.kind)
      .map((item, index) => {
        return `| **\`${item.name}\`**${'readonly' in item && item.readonly ? ` \`readonly\`` : ''} | ${'type' in item ? `\`${item.type?.text.replaceAll('|', '\\|')}\`` : ''} | ${item?.description ?? ''} |`
      })
  )
).join(`\n`)}

</div>`
    : `
### No Properties
`
}

${
  'members' in dec
    ? `
### Methods

<div class="*:w-full *:table-fixed *:table!">

| Name          |    Returns    |  Description  |
| ------------- | :-----------: | ------------- |
${(
  await Promise.all(
    dec.members
      .filter((item) => 'method' === item.kind)
      .map((item, index) => {
        return `| **\`${item.name}\`** | ${'return' in item ? `\`${item.return?.type?.text.replaceAll('|', '\\|')}\`` : ''} | ${item?.description ?? ''} |`
      })
  )
).join(`\n`)}

</div>`
    : `
### No Methods
`
}

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
      (item, index) => `### ${item.name}

<div class="relative group">
<input type="checkbox" id="show-more${index}" class="peer hidden">

<div class="relative max-h-40 overflow-hidden peer-checked:max-h-none rounded-lg border border-gray-200 p-4">

| Name          |  Description  |
| ------------- | ------------- |
${item.values
  .map((item, index) => {
    return `| **\`${item.name}\`** | ${item?.description ?? ''} |`
  })
  .join(`\n`)}

<div class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent peer-checked:hidden"></div>

</div>

<label for="show-more${index}" class="group-has-checked:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-1 text-sm font-medium text-gray-700 shadow-sm select-none">Show more</label>

<label for="show-more${index}" class="hidden group-has-checked:block absolute -bottom-4 left-1/2 -translate-x-1/2 cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-1 text-sm font-medium text-gray-700 shadow-sm select-none">Show less</label>

</div>

`
    )
  )
).join(`\n\n`)}

`
)
