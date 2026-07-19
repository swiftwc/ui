import doctrine from 'doctrine'
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ArrayLiteralExpression, Project, SyntaxKind } from 'ts-morph'

const kebabCase = (str: string) =>
  str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // camelCase → camel-Case
    .replace(/[\s_]+/g, '-') // spaces/underscores → -
    .replace(/-+/g, '-') // collapse multiple -
    .toLowerCase()

const __dirname = dirname(fileURLToPath(import.meta.url))

const project = new Project({
  tsConfigFilePath: resolve(__dirname, '../tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
})

project.addSourceFilesAtPaths('js/components/**/*.ts')

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
  tags: [],
  globalAttributes: [
    {
      name: 'tint',
      description: 'Sets accent color',
      valueSet: 'tintSet',
      // values: [
      //   { name: 'infinity', description: '100%' },
      //   { name: '0', description: '0rem' },
      //   { name: '1', description: '1rem' },
      //   { name: '2', description: '2rem' },
      // ],
    },
    {
      name: 'list-item-tint',
      description: 'Sets accent color on list items',
      valueSet: 'tintSet',
      // values: [
      //   { name: 'infinity', description: '100%' },
      //   { name: '0', description: '0rem' },
      //   { name: '1', description: '1rem' },
      //   { name: '2', description: '2rem' },
      // ],
    },
    {
      name: 'foreground',
      description: 'Sets foreground color',
      valueSet: 'foregroundSet',
      // values: [
      //   { name: 'infinity', description: '100%' },
      //   { name: '0', description: '0rem' },
      //   { name: '1', description: '1rem' },
      //   { name: '2', description: '2rem' },
      // ],
    },
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
      name: 'fontSet',
      values: [
        { name: 'footnote', description: 'A font with the footnote text style' },
        { name: 'caption2', description: 'Create a font with the alternate caption text style' },
        { name: 'caption', description: 'A font with the caption text style' },
        { name: 'callout', description: 'A font with the callout text style' },
        { name: 'body', description: 'A font with the body text style' },
        { name: 'subheadline', description: 'A font with the subheadline text style' },
        { name: 'headline', description: 'A font with the headline text style' },
        { name: 'title3', description: 'Create a font for third level hierarchical headings' },
        { name: 'title2', description: 'Create a font for second level hierarchical headings' },
        { name: 'title', description: 'A font with the title text style' },
        { name: 'large-title', description: 'A font with the large title text style' },
        { name: 'extra-large-title', description: 'Create a font with the extra large title text style' },
        // { name: 'extra-large-title2', description: 'Create a font with the second level extra large title text style' },
      ],
    },
    {
      name: 'spacingSet',
      values: [
        { name: '0', description: '0rem' },
        { name: '1', description: '0.1rem' },
        { name: '2', description: '0.2rem' },
        { name: '3', description: '0.3rem' },
        { name: '4', description: '0.4rem' },
      ],
    },
    {
      name: 'tintSet',
      values: [
        { name: 'gray', description: 'like secondary, like disabled' },
        { name: 'red', description: 'system red color' },
        { name: 'blue', description: 'system blue color' },
        { name: 'green', description: 'system green color' },
        { name: 'orange', description: 'system orange color' },
        { name: 'purple', description: 'system purple color' },
      ],
    },
    {
      name: 'foregroundSet',
      values: [
        { name: 'secondary', description: 'system secondary color' },
        { name: 'blue', description: 'system blue color' },
        { name: 'blue.secondary', description: 'system secondary blue color' },
        { name: 'gray', description: 'system gray color' },
        { name: 'red', description: 'system red color' },
        { name: 'green', description: 'system green color' },
        { name: 'orange', description: 'system orange color' },
        { name: 'purple', description: 'system purple color' },
      ],
    },
    {
      name: 'alignmentSet',
      values: [
        { name: 'leading', description: 'start cross-axis alignment' },
        { name: 'center', description: 'center cross-axis alignment' },
        { name: 'trailing', description: 'end cross-axis alignment' },
        { name: 'fill', description: 'stretch cross-axis alignment' },
      ],
    },
    {
      name: 'distributionSet',
      values: [
        { name: 'leading', description: 'start cross-axis distribution' },
        { name: 'center', description: 'center cross-axis distribution' },
        { name: 'trailing', description: 'end cross-axis distribution' },
        { name: 'fill', description: 'stretch cross-axis distribution' },
      ],
    },
    {
      name: 'placementSet',
      values: [
        { name: 'fill', description: 'short cut for `distribution="fill" alignment="fill"`' },
        { name: 'leading fill', description: 'short cut for `distribution="leading" alignment="fill"`' },
        { name: 'fill leading', description: 'short cut for `distribution="fill" alignment="leading"`' },
      ],
    },
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

for (const sourceFile of project.getSourceFiles()) {
  const classes = sourceFile.getClasses()

  for (const cls of classes) {
    const is = kebabCase(`${cls.getName()}`)

    const module: CustomElementModule = {
      kind: 'javascript-module',
      path: `./generated/components/${is}.ts`,
      declarations: [
        {
          kind: 'class',
          customElement: true,
          name: `${cls.getName()}`,
          tagName: is,
          description: '',
          superclass: {
            name: `HTML${cls.getBaseClass()?.getName()?.replaceAll('Base', '')?.replaceAll('Associated', '')}Element`,
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
          name: is,
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
        !m.getName().startsWith('#') &&
        m.getName() !== 'observedAttributes'
      )
    })) {
      ;(module.declarations[0].members ??= []).push({
        kind: 'field',
        name: m.getName(),
      })
    }

    const row: VsHtmlDataTag = {
      name: is,
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
            module.declarations[0].description = tag.description ?? ''

            // TODO: override name with @element!
            continue

          case 'event':
          case 'fires':
            ;(module.declarations[0].events ??= []).push({
              name: tag.title,
              type: {
                text: 'Event',
              },
            })

            continue
          case 'slot':
            ;(module.declarations[0].slots ??= []).push({
              name: tag.title,
              description: tag.description ?? undefined,
            })

            continue
          case 'attr':
            if (!tag.description) continue

            const attr: VsHtmlDataAttr = {
              name: '',
            }

            const i = tag.description.lastIndexOf('-'),
              a = tag.description.slice(0, i !== -1 ? i : undefined).trim(),
              b = i !== -1 ? tag.description.slice(i + 1).trim() : undefined

            if (b) attr.description = `\nDescription: ${b}`

            const matches = [...a.matchAll(/\{([^}]+)\}/g)].map((m) => m[1])

            if (0 < matches.length) {
              const lastIndex = a.slice(a.lastIndexOf('}') + 1)
              ;(module.declarations[0].attributes ??= []).push({
                name: lastIndex.trim(),
              })

              attr.name = lastIndex.trim()

              const types: string[] = (matches.at(0) ?? '').split('|').map((item) => item.trim().replace(/['"`]/g, ''))
              if (matches.at(0)?.startsWith('@')) {
                attr.valueSet = matches.at(0)?.slice(1)
              } else if (types) {
                attr.description = `Value Type: “${types.join('” | “')}”${attr.description ? `\n${attr.description}` : ''}`
                attr.values ??= types.map((item) => ({ name: item }))
              }
              ;(row.attributes ??= []).push(attr)
            } else {
              ;(module.declarations[0].attributes ??= []).push({
                name: a.trim(),
              })

              attr.name = a.trim()
              ;(row.attributes ??= []).push(attr)
            }

            continue
        }
      }
    }

    const expr = cls.getGetAccessor('observedAttributes')?.getDescendantsOfKind(SyntaxKind.ReturnStatement).at(0)?.getExpression()

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

        ;(row.attributes ??= []).push(attr)
        //
        ;(module.declarations[0].attributes ??= []).push({ name: attr.name })
      }
    }

    ;(vscode.tags ??= []).push(row)

    elements.modules.push(module)
  }
}

writeFileSync(resolve(__dirname, '../web-components.html-data/en.json'), JSON.stringify(vscode, null, 2))

writeFileSync(resolve(__dirname, '../custom-elements/en.json'), JSON.stringify(elements, null, 2))
