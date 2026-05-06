import doctrine from 'doctrine'
import { writeFileSync } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ArrayLiteralExpression, Project, SyntaxKind } from 'ts-morph'
import { kebabCase } from '../js/internal/utils'

const __dirname = dirname(fileURLToPath(import.meta.url))

const project = new Project({
  tsConfigFilePath: resolve(__dirname, '../tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
})

project.addSourceFilesAtPaths('js/components/**/*.ts')

// https://github.com/webcomponents/custom-elements-manifest
interface CustomElementDataV2 {
  schemaVersion: '2.1.0'
  readme: string
  modules: CustomElementModule[]
}

interface CustomElementModule {
  kind: string
  path: string
  declarations: CustomElementDecl[]
  exports: { kind: string; name: string; declaration: { name: string } }[]
}

// https://custom-elements-manifest.open-wc.org/analyzer/getting-started/
interface CustomElementDecl {
  kind: string
  customElement: boolean
  name: string
  tagName: string
  description: string
  members?: { name: string; kind: string }[]
  events?: {
    name: string
    type: {
      text: string
    }
  }[]
  slots?: { name: string; description?: string }[]
  attributes?: { name: string }[]
  superclass: { name: string }
}

// https://github.com/microsoft/vscode-custom-data/tree/main/samples/webcomponents
interface VsHtmlDataV1 {
  version: 1.1
  tags?: VsHtmlDataTag[]
  globalAttributes?: VsHtmlDataAttr[]
  valueSets?: VsHtmlDataValueSet[]
}

interface VsHtmlDataValueSet {
  name: string
  values: VsHtmlDataAttrValue[]
}

interface VsHtmlDataAttrValue {
  name: string
  description?: string
}

interface VsHtmlDataAttr {
  name: string
  description?: string
  values?: { name?: string; description?: string }[]
  valueSet?: string
}

interface VsHtmlDataTag {
  name: string
  description?: string
  attributes?: VsHtmlDataAttr[]
}

// https://github.com/microsoft/vscode-html-languageservice/blob/main/docs/customData.schema.json
const vscode: VsHtmlDataV1 = {
  version: 1.1,
  tags: [
    // {
    //   name: 'v-keyboard',
    //   description: 'Required for all.\n\nAdd a `<v-keyboard>` element inside your body markup.',
    //   references: [
    //     {
    //       name: 'GitHub',
    //       url: 'https://github.com/github/time-elements#relative-time',
    //     },
    //     {
    //       name: 'WebComponents',
    //       url: 'https://www.webcomponents.org/element/time-elements#relative-time',
    //     },
    //     {
    //       name: 'NPM',
    //       url: 'https://www.npmjs.com/package/@github/time-elements#relative-time',
    //     },
    //   ],
    // },
    // {
    //   name: 'label-view',
    //   description: 'title',
    //   references: [
    //     {
    //       name: 'GitHub',
    //       url: 'https://github.com/github/time-elements#time-until',
    //     },
    //     {
    //       name: 'WebComponents',
    //       url: 'https://www.webcomponents.org/element/time-elements#time-until',
    //     },
    //     {
    //       name: 'NPM',
    //       url: 'https://www.npmjs.com/package/@swiftwc/ui/generated/components/label-view.js',
    //     },
    //   ],
    //   attributes: [
    //     {
    //       name: 'title',
    //       description: 'Value Type: ISO 8601 date.\nDescription: Required date of element such as `2014-06-01T13:05:07Z`',
    //       references: [
    //         {
    //           name: 'GitHub',
    //           url: 'https://github.com/github/time-elements#options',
    //         },
    //       ],
    //     },
    //     {
    //       name: 'line-limit',
    //       description: 'Value Type: ISO 8601 date.\nDescription: Required date of element such as `2014-06-01T13:05:07Z`',
    //       references: [
    //         {
    //           name: 'GitHub',
    //           url: 'https://github.com/github/time-elements#options',
    //         },
    //       ],
    //     },
    //   ],
    // },
  ],
  globalAttributes: [
    {
      name: 'frame:width',
      description: 'Sets inline-size',
      valueSet: 'frameWidth',
      // values: [
      //   { name: 'infinity', description: '100%' },
      //   { name: '0', description: '0rem' },
      //   { name: '1', description: '1rem' },
      //   { name: '2', description: '2rem' },
      // ],
    },
    {
      name: 'frame:max-width',
      description: 'Sets max-inline-size',
      valueSet: 'frameMaxWidth',
      // values: [
      //   { name: 'infinity', description: '100%' },
      //   { name: '0', description: '0cqi' },
      //   { name: '1', description: '1cqi' },
      //   { name: '2', description: '2cqi' },
      // ],
    },
  ],
  valueSets: [
    {
      name: 'frameWidth',
      values: [
        { name: 'infinity', description: '100%' },
        { name: '0', description: '0rem' },
        { name: '1', description: '1rem' },
        { name: '2', description: '2rem' },
      ],
    },
    {
      name: 'frameMaxWidth',
      values: [
        { name: 'infinity', description: '100%' },
        { name: '0', description: '0rem' },
        { name: '1', description: '1rem' },
        { name: '2', description: '2rem' },
      ],
    },
  ],
}

const elements: CustomElementDataV2 = {
  schemaVersion: '2.1.0',
  readme: 'README.md',
  modules: [],
}

const mds: [string, string][] = []

// interface MetaType {
//   element?: string
//   description?: string
//   summary?: string
// }

// const extr = (jsDoc?: JSDoc) => {
//   const meta: MetaType = {
//     description: jsDoc?.getComment()?.toString() ?? '',
//   }
//   for (const tag of jsDoc?.getTags() ?? []) {
//     const name = tag.getTagName(),
//       value = tag?.getComment() ?? ''
//     if (!meta[name]) meta[name] = value
//     else {
//       // handle repeated tags like @param, @event
//       if (!Array.isArray(meta[name])) meta[name] = [meta[name]]
//       meta[name].push(value)
//     }
//   }

//   return meta
// }

for (const sourceFile of project.getSourceFiles()) {
  const classes = sourceFile.getClasses()

  for (const cls of classes) {
    const module: CustomElementModule = {
      kind: 'javascript-module',
      path: `./generated/components/${kebabCase(`${cls.getName()}`)}.ts`,
      declarations: [
        {
          kind: 'class',
          customElement: true,
          name: `${cls.getName()}`,
          tagName: kebabCase(`${cls.getName()}`),
          description: 'This is the description of the class',
          superclass: {
            name: cls.getBaseClass()?.getName() ?? 'HTMLElement',
          },
        },
      ],
      exports: [
        {
          kind: 'js',
          name: `${cls.getName()}`,
          declaration: {
            name: `${cls.getName()}`,
          },
        },
        {
          kind: 'custom-element-definition',
          name: kebabCase(`${cls.getName()}`),
          declaration: {
            name: `${cls.getName()}`,
          },
        },
      ],
    }

    for (const m of cls.getGetAccessors().filter((m) => {
      return (
        !m.hasModifier?.('private') &&
        !m.hasModifier?.('protected') &&
        !m.hasModifier?.(SyntaxKind.PrivateKeyword) &&
        !m.hasModifier?.(SyntaxKind.ProtectedKeyword) &&
        !m.getName().startsWith('#')
      )
    })) {
      module.declarations[0].members ??= []
      module.declarations[0].members.push({
        kind: 'field',
        name: m.getName(),
        // type: {
        //   text: 'boolean',
        // },
        // description: 'disabled state',
        // default: 'true',
        // kind2: m.getKindName(),
        // returnType2: m.getReturnType?.()?.getText?.(),
      })

      const classNames = [
        ...m
          .getReturnType?.()
          ?.getText?.()
          .matchAll(/\.([A-Z]\w*)/g),
      ].map((match) => match[1])

      mds.push([
        kebabCase(`${cls.getName()}`),
        `\`${m.getName()}\`\n\n: ${'GetAccessor' === m.getKindName() ? '<Badge type="warning" text="readonly" />' : ''} ${0 < classNames.length ? classNames.join(' | ') : m.getReturnType?.()?.getText?.()}`,
      ])
    }

    const row: VsHtmlDataTag = {
      name: kebabCase(`${cls.getName()}`),
    }

    const leading = cls
      .getLeadingCommentRanges()
      .map((c) => c.getText().trim())
      ?.at(0)

    if (leading) {
      const { description, tags } = doctrine.parse(leading, { unwrap: true, recoverable: true })

      row.description = description
      module.declarations[0].description = description

      for (const tag of tags ?? []) {
        switch (tag.title) {
          case 'summary':
            row.description = tag.description ?? undefined

            // TODO: override name with @element!
            continue

          case 'event':
          case 'fires':
            module.declarations[0].events ??= []

            module.declarations[0].events.push({
              name: tag.title,
              type: {
                text: 'Event',
              },
            })

            continue
          case 'slot':
            module.declarations[0].slots ??= []

            module.declarations[0].slots.push({
              name: tag.title,
              description: tag.description ?? undefined,
            })

            continue
        }
      }
    }

    // const tag =
    //   cls
    //     .getDecorators()
    //     .find((d) => d.getName() === 'customElement')
    //     ?.getArguments()[0]
    //     ?.getText()
    //     ?.replace(/['"`]/g, '') ?? meta?.element

    // const staticProp = cls.getStaticProperty('observedAttributes')
    const getter = cls.getGetAccessor('observedAttributes') // cls.getStaticMethod?.('observedAttributes')

    const returnStmt = getter?.getDescendantsOfKind(SyntaxKind.ReturnStatement).at(0)
    const expr = returnStmt?.getExpression()

    if (expr instanceof ArrayLiteralExpression) {
      for (const prop of expr.getElements()) {
        const attr: VsHtmlDataAttr = {
          name: prop.getText().replace(/['"`]/g, ''),
        }

        const leading = prop
          .getLeadingCommentRanges()
          .map((c) => c.getText().trim())
          ?.at(0)

        if (leading) {
          const { description, tags } = doctrine.parse(leading, { unwrap: true, recoverable: true })

          attr.description = `Description: ${description}`

          for (const tag of tags ?? []) {
            if ('type' === tag.title) {
              const types: string[] = []
              // @ts-expect-error
              if ('UnionType' === tag.type?.type) for (const el of tag.type?.elements ?? []) if ('StringLiteralType' === el?.type) types.push(el.value)

              if (types) {
                attr.description = `Value Type: “${types.join('” | “')}”${tag.description ? ` ${tag.description}` : ''}${attr.description ? `\n${attr.description}` : ''}`
                attr.values ??= types.map((item) => ({ name: item }))
              }
            }
          }
        }

        row.attributes ??= []
        row.attributes.push(attr)

        module.declarations[0].attributes ??= []
        module.declarations[0].attributes.push({ name: attr.name })
      }
    }

    vscode.tags ??= []
    vscode.tags.push(row)

    elements.modules.push(module)
  }
}

writeFileSync(resolve(__dirname, '../web-components.html-data/en.json'), JSON.stringify(vscode, null, 2))

writeFileSync(resolve(__dirname, '../custom-elements/en.json'), JSON.stringify(elements, null, 2))

const reflections = resolve(__dirname, `../../../apps/docs/reflections`)

await rm(reflections, { recursive: true, force: true })

await mkdir(reflections, { recursive: true })

for (const [k, md] of mds) writeFileSync(resolve(__dirname, `${reflections}/${k}.md`), md, {})
