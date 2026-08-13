import doctrine from 'doctrine'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as prettier from 'prettier'
import { ArrayLiteralExpression, ArrowFunction, FunctionExpression, Project, PropertyDeclaration, SyntaxKind, Node as TSMNode, TypeFormatFlags } from 'ts-morph'
// @ts-expect-error no types available
import gonzales from 'gonzales-pe'
// @ts-expect-error no types available
import type { Node } from 'gonzales-pe'

const kebabCase = (str: string) =>
    str
      .replace(/([a-z])([A-Z])/g, '$1-$2') // camelCase → camel-Case
      .replace(/[\s_]+/g, '-') // spaces/underscores → -
      .replace(/-+/g, '-') // collapse multiple -
      .toLowerCase(),
  extractAb = (str: string) => {
    const i = str.lastIndexOf('—'),
      a = str.slice(0, i !== -1 ? i : undefined).trim(),
      b = i !== -1 ? str.slice(i + 1).trim() : undefined
    return [a.trim(), b?.trim()]
  },
  extractTypes = (tags: doctrine.Tag[]): { types: string[]; description?: string } => {
    for (const tag of tags ?? []) {
      if ('type' === tag.title) {
        const types: string[] = []
        // console.debug(tag?.type?.elements)
        if ('UnionType' === tag.type?.type)
          for (const el of tag.type?.elements ?? [])
            switch (el?.type as string | undefined) {
              case 'StringLiteralType':
                // @ts-expect-error
                types.push(el.value)
                break
              case 'NameExpression':
                // @ts-expect-error
                types.push(el.name)
                break
              case 'NullLiteral':
                types.push('null')
                break
            }
        else if ('NameExpression' === tag.type?.type) types.push(tag.type.name)

        return { types, description: tag.description ?? undefined }
      }
    }

    return { types: [], description: undefined }
  }

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
// console.debug(listVals)

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
// console.debug(maps)

const names = new Map<string, string[]>()

ast.traverseByType('declaration', function (node: Node) {
  const property = node.first('property')

  if (!property?.toString().endsWith('-names')) return

  const value = node.first('value')

  const entries = value?.content.filter((child: Node) => child.type === 'ident').map((child: Node) => child.toString().trim())

  names.set(property?.toString(), entries ?? [])
})
// console.debug(names)

const tintDescriptions = new Map([['gray', 'Like secondary, like disabled']])

const tokens = new Map<string, Map<string, string>>()

ast.traverseByType('declaration', (node: Node) => {
  const name = node.first('property')?.toString()

  if (!name?.endsWith('-tokens')) return

  const outer = node.first('value')?.first('parentheses')

  if (!outer) return

  const map = new Map<string, string>()

  for (let i = 0; i < outer.content.length; i++) {
    const keyNode = outer.content[i] as Node

    if (!['ident', 'string'].includes(keyNode.type)) continue

    const colon = outer.content[i + 1] as Node

    if (colon?.type !== 'operator' || colon.toString() !== ':') continue

    const key = keyNode.toString().replace(/^['"]|['"]$/g, '')

    let j = i + 2
    let value = ''

    while (outer.content[j] && outer.content[j].type !== 's' && !(outer.content[j].type === 'operator' && outer.content[j].toString() === ',')) {
      value += outer.content[j].toString()
      j++
    }

    map.set(key, value.trim())

    i = j
  }

  tokens.set(name, map)
})
// console.debug(tokens)

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
  members?: { name: string; kind: string; readonly?: boolean; description?: string; return?: { type: { text: string } }; type?: { text: string } }[]
  events?: {
    name: string
    description?: string
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

interface VsHtmlReferenceAttr {
  name: string
  url: string
}

interface VsHtmlDataTag {
  name: string
  description?: string
  attributes?: VsHtmlDataAttr[]
  references?: VsHtmlReferenceAttr[]
}

// https://github.com/microsoft/vscode-html-languageservice/blob/main/docs/customData.schema.json
const htmlData: VsHtmlDataV1 = {
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
    },
    {
      name: 'foreground',
      description: 'Sets foreground color',
      valueSet: 'foregroundSet',
    },
    {
      name: 'frame:width',
      description: 'Sets inline-size',
      valueSet: 'frameWidth',
    },
    {
      name: 'frame:max-width',
      description: 'Sets max-inline-size',
      valueSet: 'frameMaxWidth',
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
      values:
        names.get('$tint-names')?.map((item) => ({
          name: item,
          description: tintDescriptions.has(item) ? tintDescriptions.get(item) : `System \`${item}\` color`,
        })) ?? [],
    },
    {
      name: 'foregroundSet',
      values: Array.from(tokens.get('$foreground-tokens')?.entries() ?? []).map((item) => ({
        name: item[0],
        description: `Applies the system ${0 <= item[0].indexOf('.') ? `${item[0].split('.').pop()} ` : ''}${item[0].split('.').shift()} color (\`${item[1]}\`)`,
      })),
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

const customElements: CustomElementDataV2 = {
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
            name: `HTML${cls.getBaseClass()?.getName()?.replaceAll('Base', '')?.replaceAll('Associated', '')?.replaceAll('NavigationView', '') ?? ''}Element`,
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

    const getters = cls.getGetAccessors().filter((m) => {
        return (
          !m.isStatic() &&
          !m.hasModifier?.('private') &&
          !m.hasModifier?.('protected') &&
          !m.hasModifier?.(SyntaxKind.PrivateKeyword) &&
          !m.hasModifier?.(SyntaxKind.ProtectedKeyword) &&
          !m.getName().startsWith('#') &&
          m.getName() !== 'observedAttributes'
        )
      }),
      setters = new Set(cls.getSetAccessors().map((s) => s.getName())),
      methods = cls.getInstanceMethods().filter((m) => !m.isStatic() && !m.getName().startsWith('#')),
      arrowMethods = cls.getInstanceProperties().filter((p): p is PropertyDeclaration => {
        if (!TSMNode.isPropertyDeclaration(p)) return false

        const initializer = p.getInitializer()
        if (!initializer) return false

        if (p.isStatic() || p.getName().startsWith('#')) return false

        return TSMNode.isArrowFunction(initializer) || TSMNode.isFunctionExpression(initializer)
      })

    const htmlDataTag: VsHtmlDataTag = {
        name: is,
      },
      htmlDataTagDescMap: Map<string, string[]> = new Map()

    for (const m of getters) {
      const readonly = !setters.has(m.getName())
      const leading = m
        .getLeadingCommentRanges()
        .map((c) => c.getText().trim())
        .at(0)

      const propTypeText = m?.getType().getText(m, TypeFormatFlags.NoTruncation)

      let b = propTypeText,
        d = ''

      if (leading) {
        const { description, tags } = doctrine.parse(leading, { unwrap: true, recoverable: true })

        b += ` ${description}`

        d = description
      }
      ;(module.declarations[0].members ??= []).push({
        kind: 'field',
        name: m.getName(),
        readonly,
        description: d,
        type: {
          text: b, //`${types.map((item) => item).join(' | ')}`,
        },
      })
      ;(htmlDataTagDescMap.get('props') ?? htmlDataTagDescMap.set('props', []).get('props'))?.push(`- ${!readonly ? '' : `readonly `}**${m.getName()}**${b ? ` — ${b}` : ''}`)
    }

    for (const m of [...methods, ...arrowMethods]) {
      if (['attributeChangedCallback', 'disconnectedCallback', 'connectedCallback', 'formAssociatedCallback', 'formDisabledCallback', 'formResetCallback'].includes(m.getName())) continue

      const leading = m
        .getLeadingCommentRanges()
        .map((c) => c.getText().trim())
        .at(0)

      const callable = TSMNode.isPropertyDeclaration(m)
        ? (m.getInitializer() as ArrowFunction | FunctionExpression) // arrow/fn expr
        : m // MethodDeclaration

      const returnTypeText = callable.getReturnType().getText(callable, TypeFormatFlags.NoTruncation)

      let b = returnTypeText,
        d = ''

      if (leading) {
        const { description, tags } = doctrine.parse(leading, { unwrap: true, recoverable: true })

        b += ` ${description}`

        d = description
      }

      ;(module.declarations[0].members ??= []).push({
        kind: 'method',
        name: m.getName(),
        description: d,
        return: {
          type: {
            text: b,
          },
        },
      })
    }

    const leading = cls
      .getLeadingCommentRanges()
      .map((c) => c.getText().trim())
      ?.at(0)

    if (leading) {
      const { description, tags } = doctrine.parse(leading, { unwrap: true, recoverable: true })

      if (description) htmlDataTagDescMap.set('desc', [description])

      htmlDataTag.references = [
        {
          name: 'Documentation',
          url: `https://swiftwc.github.io/ui/web-components/${is}`,
        },
      ]
      module.declarations[0].description = description

      for (const tag of tags ?? []) {
        switch (tag.title) {
          case 'summary':
            htmlDataTag.description = tag.description ?? undefined
            module.declarations[0].description = tag.description ?? ''

            // TODO: override name with @element!
            continue

          case 'example': {
            const [a, b] = extractAb(tag.description ?? '')

            ;(htmlDataTagDescMap.get('examples') ?? htmlDataTagDescMap.set('examples', []).get('examples'))?.push(
              `**${b ?? 'Example'}:**`,
              `\`\`\`html\n${await prettier.format(a ?? '', { parser: 'html', htmlWhitespaceSensitivity: 'ignore' })}\n\`\`\``
            )

            continue
          }
          case 'event':
          case 'fires': {
            const [a, b] = extractAb(tag.description ?? '')

            ;(module.declarations[0].events ??= []).push({
              name: a ?? '',
              description: b,
              type: {
                text: 'Event',
              },
            })
            ;(htmlDataTagDescMap.get('events') ?? htmlDataTagDescMap.set('events', []).get('events'))?.push(`- **${a}**${b ? ` — ${b}` : ''}`)

            continue
          }
          case 'slot': {
            const [a, b] = extractAb(tag.description ?? '')

            ;(module.declarations[0].slots ??= []).push({
              name: a ?? '',
              description: b ?? undefined,
            })
            ;(htmlDataTagDescMap.get('slots') ?? htmlDataTagDescMap.set('slots', []).get('slots'))?.push(`- ${a ? `**${a}**` : `_default_`}${b ? ` — ${b}` : ''}`)

            continue
          }
          case 'attr': {
            if (!tag.description) continue

            const attr: VsHtmlDataAttr = {
              name: '',
            }

            const [a, b] = extractAb(tag.description)
            if (!a) continue

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
              ;(htmlDataTag.attributes ??= []).push(attr)
            } else {
              ;(module.declarations[0].attributes ??= []).push({
                name: a.trim(),
              })

              attr.name = a.trim()
              ;(htmlDataTag.attributes ??= []).push(attr)
            }

            continue
          }
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

          attr.description = description //`Description: ${description}`

          const { types, description: desc } = extractTypes(tags)

          if (0 < types.length) {
            attr.description = `Value Type: “${types.join('” | “')}”${desc ? ` ${desc}` : ''}${attr.description ? `\nDescription: ${attr.description}` : ''}`
            attr.values ??= types.map((name) => ({ name }))
          }
        }

        ;(htmlDataTag.attributes ??= []).push(attr)
        //
        ;(module.declarations[0].attributes ??= []).push({ name: attr.name })
      }
    }

    if (htmlDataTagDescMap.has('desc')) htmlDataTagDescMap.get('desc')?.splice(1, 0, '---')

    // if (htmlDataTagDescMap.has('slots')) htmlDataTagDescMap.get('slots')?.splice(0, 0, '- _default_ — The default slot.')
    if (htmlDataTagDescMap.has('slots')) htmlDataTagDescMap.get('slots')?.splice(0, 0, '### **Slots:**')

    if (htmlDataTagDescMap.has('events')) htmlDataTagDescMap.get('events')?.splice(0, 0, '### **Events:**')

    if (htmlDataTagDescMap.has('examples')) htmlDataTagDescMap.get('examples')?.splice(0, 0, '### **Examples:**')

    if (htmlDataTagDescMap.has('props')) htmlDataTagDescMap.get('props')?.splice(0, 0, '### **Properties:**')

    const order = ['desc', 'slots', 'props', 'methods', 'events', 'examples']

    htmlDataTag.description = [...htmlDataTagDescMap.entries()]
      .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
      .map(([, values]) => values.join('\n'))
      .join('\n\n')
    ;(htmlData.tags ??= []).push(htmlDataTag)

    customElements.modules.push(module)
  }
}

writeFileSync(resolve(__dirname, '../web-components.html-data/en.json'), JSON.stringify(htmlData, null, 2))

writeFileSync(resolve(__dirname, '../custom-elements/en.json'), JSON.stringify(customElements, null, 2))
