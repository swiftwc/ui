import doctrine from 'doctrine'
import type { Node } from 'gonzales-pe'
import gonzales from 'gonzales-pe'
import { readFileSync, writeFileSync } from 'node:fs'
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

const ast = gonzales.parse(readFileSync(resolve(__dirname, '../scss/_maps.scss'), 'utf-8'), { syntax: 'scss' })

const listVals = new Map<string, string[]>()

ast.traverseByType('declaration', function (node: Node) {
  const property = node.first('property')

  if (!property?.toString().endsWith('-list-vals')) return

  const value = node.first('value')

  // console.dir(value?.toJson(), { depth: 50 })

  const outer = value?.content.find((child: Node) => child.type === 'parentheses')

  const entries = outer?.content.filter((child: Node) => child.type === 'parentheses').map((child: Node) => child.toString().trim())

  listVals.set(
    property?.toString(),
    entries.map((item: string) => item.replace(/^\(|\)$/g, ''))
  )
})

const maps = new Map<string, Map<string, string[]>>()

ast.traverseByType('declaration', (node: Node) => {
  const name = node.first('property')?.toString()

  if (!name?.endsWith('-map')) return

  const outer = node.first('value')?.first('parentheses')

  if (!outer) return

  const map = new Map<string, string[]>()

  for (let i = 0; i < outer.content.length; i++) {
    const keyNode = outer.content[i] as Node

    if (!['ident', 'string'].includes(keyNode.type)) continue

    const colon = outer.content[i + 1] as Node
    const value = outer.content[i + 3] as Node

    if (colon?.type !== 'operator' || colon.toString() !== ':') continue
    if (value?.type !== 'parentheses') continue

    const key = keyNode.toString().replace(/^['"]|['"]$/g, '')

    const rules = value.content
      .filter((child: Node) => child.type === 'parentheses')
      .map((child: Node) => {
        const [property, ...rest] = child
          .toString()
          .replace(/^\(|\)$/g, '')
          .trim()
          .split(/\s+/)

        const val = rest.join(' ').replace(/^\(|\)$/g, '')

        return `${property}: ${val};`
      })

    map.set(key, rules)

    i += 3
  }

  maps.set(name, map)
})

// ast.traverseByType('variable', function (node: Node, index: number, parent: Node) {
// if (node?.toString() !== '$stack-templates-list-vals') return
// console.log(4444, node)
// })

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
      values: Array.from({ length: 51 }, (_, i) => ({ name: String(i), description: `${i / 10}rem` })),
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
      name: 'inlineSet',
      values:
        Array.from(maps.get('$inline-map')?.entries() ?? [])?.map((item) => ({
          name: item[0],
          description: `Applies \`${item[1].join(' ')}\` rules`,
        })) ?? [],
    },
    {
      name: 'blockSet',
      values:
        Array.from(maps.get('$block-map')?.entries() ?? [])?.map((item) => ({
          name: item[0],
          description: `Applies \`${item[1].join(' ')}\` rules`,
        })) ?? [],
    },
    {
      name: 'inlinePlacementSet',
      values:
        Array.from(maps.get('$inline-placement-map')?.entries() ?? [])?.map((item) => ({
          name: item[0],
          description: `Applies \`${item[1].join(' ')}\` rules`,
        })) ?? [],
    },
    {
      name: 'blockPlacementSet',
      values:
        Array.from(maps.get('$block-placement-map')?.entries() ?? [])?.map((item) => ({
          name: item[0],
          description: `Applies \`${item[1].join(' ')}\` rules`,
        })) ?? [],
    },
    {
      name: 'templateSet',
      values:
        listVals.get('$stack-templates-list-vals')?.map((item) => ({
          name: item.replace('minmax(0, 1fr)', 'spacer').replace(/repeat\(([^)]*)\)/g, (_, inner) => `repeat(${inner.replace(/\s+/g, '')})`),
          description: `Applies a \`${item}\` grid-template to the main-axis`,
        })) ?? [],
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
