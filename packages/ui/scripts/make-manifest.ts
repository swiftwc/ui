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
      // Replace uppercase letters with - + lowercase
      .replace(/([A-Z])/g, '-$1')
      // Replace spaces and underscores with -
      .replace(/[\s_]+/g, '-')
      // Convert to lowercase
      .toLowerCase()
      // Remove leading/trailing dashes
      .replace(/^-+|-+$/g, ''),
  extractTag = (str: string) => {
    let depth = 0,
      start = -1,
      end = -1

    for (let i = 0; i < str.length; i++) {
      if (str[i] === '{') {
        if (depth === 0) start = i + 1
        depth++
      } else if (str[i] === '}') {
        depth--
        if (depth === 0 && start !== -1) {
          end = i
          break
        }
      }
    }

    const type = start !== -1 && end !== -1 ? str.slice(start, end) : undefined
    const rest = type !== undefined ? str.slice(0, start - 1) + str.slice(end + 1) : str

    const i = rest.lastIndexOf('—')
    const title = (i !== -1 ? rest.slice(0, i) : rest).trim()
    const description = i !== -1 ? rest.slice(i + 1).trim() || undefined : undefined

    return { title, description, type }
  },
  formatProp = (prop: string) => (/^[A-Za-z_$][\w$]*$/.test(prop) ? prop : `'${prop}'`),
  extractTypes = (tags: doctrine.Tag[]): { type: string; description?: string } => {
    const tag = tags?.find(({ title }) => title === 'type')

    return {
      type: tag?.type ? doctrine.type.stringify(tag.type) : '',
      description: tag?.description ?? undefined,
    }
    // for (const tag of tags ?? []) {
    //   if ('type' === tag.title) {
    //     const types: string[] = []
    //     // console.debug(tag?.type?.elements)
    //     if ('UnionType' === tag.type?.type)
    //       for (const el of tag.type?.elements ?? [])
    //         switch (el?.type as string | undefined) {
    //           case 'StringLiteralType':
    //             // @ts-expect-error
    //             types.push(el.value)
    //             break
    //           case 'NameExpression':
    //             // @ts-expect-error
    //             types.push(el.name)
    //             break
    //           case 'NullLiteral':
    //             types.push('null')
    //             break
    //         }
    //     else if ('NameExpression' === tag.type?.type) types.push(tag.type.name)

    //     return { types, description: tag.description ?? undefined }
    //   }
    // }

    // return { types: [], description: undefined }
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
  references?: VsHtmlReferenceAttr[]
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
      valueSet: 'Tint',
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
      valueSet: 'Tint',
    },
    {
      name: 'foreground',
      description: 'Sets foreground color',
      valueSet: 'Foreground',
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
      name: 'Font',
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
      name: 'Spacing',
      values: Array.from({ length: 51 }, (_, i) => ({ name: String(i), description: `${i / 10}rem` })),
    },
    {
      name: 'Tint',
      values:
        names.get('$tint-names')?.map((item) => ({
          name: item,
          description: tintDescriptions.has(item) ? tintDescriptions.get(item) : `System \`${item}\` color`,
        })) ?? [],
    },
    {
      name: 'Foreground',
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
      name: 'Template',
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

const cssData = {
  version: 1.1,
  properties: [
    {
      name: '--accentColor',
      description: {
        kind: 'markdown',
        value: "Sets the accent color used by interactive elements.\n\nRegistered via `@property` with `syntax: '<color>'`, `inherits: true`.",
      },
      references: [{ name: 'Documentation', url: 'https://swiftwc.github.io/ui/tokens/tint' }],
      values: [
        { name: 'blue', description: 'System blue' },
        { name: 'red', description: 'System red' },
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
    const is = kebabCase(`${cls.getName()}`),
      superclass = `HTML${cls.getBaseClass()?.getName()?.replaceAll('Base', '')?.replaceAll('FormAssociated', '')?.replaceAll('NavigationView', '') ?? ''}Element`

    let gdeclartion = is,
      declaration = `<${is}></${is}>`
    switch (superclass) {
      case 'HTMLButtonElement':
        gdeclartion = ''
        declaration = `<button is="${is}"></button>`
        break
      case 'HTMLDialogElement':
        gdeclartion = ''
        declaration = `<dialog is="${is}"></dialog>`
        break
      case 'HTMLDetailsElement':
        gdeclartion = ''
        declaration = `<details is="${is}"></details>`
        break
      case 'HTMLFormElement':
        gdeclartion = ''
        declaration = `<form is="${is}"></form>`
        break
    }

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
            name: superclass,
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

      let d = ''

      if (leading) {
        const { description, tags } = doctrine.parse(leading, { unwrap: true, recoverable: true })

        d = description
      }
      ;(module.declarations[0].members ??= []).push({
        kind: 'field',
        name: m.getName(),
        readonly,
        description: d,
        type: {
          text: propTypeText, //`${types.map((item) => item).join(' | ')}`,
        },
      })
      ;(htmlDataTagDescMap.get('props') ?? htmlDataTagDescMap.set('props', []).get('props'))?.push(`  ${!readonly ? '' : `readonly `}${formatProp(m.getName())}: ${propTypeText}${d ? ` // ${d}` : ''}`)
    }

    for (const m of [...methods, ...arrowMethods]) {
      if (
        ['attributeChangedCallback', 'disconnectedCallback', 'connectedCallback', 'formAssociatedCallback', 'formDisabledCallback', 'formResetCallback', 'formStateRestoreCallback'].includes(
          m.getName()
        )
      )
        continue

      const leading = m
        .getLeadingCommentRanges()
        .map((c) => c.getText().trim())
        .at(0)

      const callable = TSMNode.isPropertyDeclaration(m)
        ? (m.getInitializer() as ArrowFunction | FunctionExpression) // arrow/fn expr
        : m // MethodDeclaration

      const returnTypeText = callable.getReturnType().getText(callable, TypeFormatFlags.NoTruncation)

      let d = ''

      if (leading) {
        const { description, tags } = doctrine.parse(leading, { unwrap: true, recoverable: true })

        // b += ` ${description}`

        d = description
      }

      ;(module.declarations[0].members ??= []).push({
        kind: 'method',
        name: m.getName(),
        description: d,
        return: {
          type: {
            text: returnTypeText,
          },
        },
      })
      ;(htmlDataTagDescMap.get('fns') ?? htmlDataTagDescMap.set('fns', []).get('fns'))?.push(`  ${formatProp(m.getName())}(): ${returnTypeText}${d ? ` // ${d}` : ''}`)
    }

    const leading = cls
      .getLeadingCommentRanges()
      .map((c) => c.getText().trim())
      ?.at(0)

    if (leading) {
      const { description, tags } = doctrine.parse(leading, { unwrap: true, recoverable: true })

      // if (description) htmlDataTagDescMap.set('desc', [description])

      htmlDataTag.references = [
        {
          name: 'Documentation',
          url: `https://swiftwc.github.io/ui/web-components/${is}`,
        },
      ]
      // module.declarations[0].description = description

      for (const tag of tags ?? []) {
        switch (tag.title) {
          case 'summary':
            module.declarations[0].description = tag.description ?? ''

            if (tag.description) htmlDataTagDescMap.set('desc', [tag.description]) //htmlDataTag.description = tag.description ?? undefined

            module.declarations[0].description = tag.description ?? ''

            // TODO: override name with @element!
            continue

          case 'example': {
            const { title: a, description: b } = extractTag(tag.description ?? '')

            ;(htmlDataTagDescMap.get('examples') ?? htmlDataTagDescMap.set('examples', []).get('examples'))?.push(
              `**${b ?? 'Example'}:**`,
              `\`\`\`html\n${await prettier.format(a ?? '', { parser: 'html', htmlWhitespaceSensitivity: 'ignore' })}\n\`\`\``
            )

            continue
          }
          case 'event':
          case 'fires': {
            const { title: a, description: b, type: c } = extractTag(tag.description ?? '')

            ;(module.declarations[0].events ??= []).push({
              name: a ?? '',
              description: b,
              type: {
                text: 'Event',
              },
            })

            if (a) {
              ;(htmlDataTagDescMap.get('events') ?? htmlDataTagDescMap.set('events', []).get('events'))?.push(`    ${formatProp(a)}: CustomEvent${c ? `<${c}>` : ``}${b ? ` // ${b}` : ''}`)
            }

            continue
          }
          case 'slot': {
            const { title: a, description: b } = extractTag(tag.description ?? '')

            ;(module.declarations[0].slots ??= []).push({
              name: a ?? '',
              description: b ?? undefined,
            })

            const slotName = a || 'default'
            ;(htmlDataTagDescMap.get('slots') ?? htmlDataTagDescMap.set('slots', []).get('slots'))?.push(`    ${formatProp(slotName)}: HTMLElement[]${b ? ` // ${b}` : ''}`)

            continue
          }
          case 'cssprop': {
            const { title: a, description: b } = extractTag(tag.description ?? '')

            if (a) (htmlDataTagDescMap.get('cssprops') ?? htmlDataTagDescMap.set('cssprops', []).get('cssprops'))?.push(`    ${formatProp(a)}?: string${b ? ` // ${b}` : ''}`)

            continue
          }
          case 'csspart': {
            const { title: a, description: b } = extractTag(tag.description ?? '')

            if (a) (htmlDataTagDescMap.get('parts') ?? htmlDataTagDescMap.set('parts', []).get('parts'))?.push(`    ${formatProp(a)}: never${b ? ` // ${b}` : ''}`)

            continue
          }
          case 'attr': {
            if (!tag.description) continue

            const attr: VsHtmlDataAttr = {
              name: '',
            }

            const { title: a, description: b, type: c } = extractTag(tag.description)
            if (!a) continue

            if (b) attr.description = `\nDescription: ${b}`

            if (c) {
              const lastIndex = a.slice(a.lastIndexOf('}') + 1)
              ;(module.declarations[0].attributes ??= []).push({
                name: lastIndex.trim(),
              })

              attr.name = lastIndex.trim()

              const types: string | string[] = ['boolean'].includes(c) ? 'boolean' : c.split('|').map((item) => item.trim().replace(/['"`]/g, ''))
              if (c.startsWith('@')) {
                attr.valueSet = c.slice(1)
                ;(htmlDataTagDescMap.get('attrs') ?? htmlDataTagDescMap.set('attrs', []).get('attrs'))?.push(`    ${formatProp(attr.name)}?: ${c.slice(1)}${b ? ` // ${b}` : ''}`)
              } else if (types) {
                attr.description = `Value Type: ${Array.isArray(types) ? `“${types.join('” | “')}”` : types}${attr.description ? `\n${attr.description}` : ''}`
                attr.values ??= Array.isArray(types) ? types.map((item) => ({ name: item })) : undefined
                ;(htmlDataTagDescMap.get('attrs') ?? htmlDataTagDescMap.set('attrs', []).get('attrs'))?.push(
                  `    ${formatProp(attr.name)}?: ${Array.isArray(types) ? `"${types.join('" | "')}"` : types}${b ? ` // ${b}` : ''}`
                )
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

        switch (attr.name) {
          case 'disabled': {
            attr.references = [
              {
                name: 'MDN — disabled',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled',
              },
            ]
            break
          }
        }

        const leading = prop
          .getLeadingCommentRanges()
          .map((c) => c.getText().trim())
          ?.at(0)

        let d = '',
          t = 'string'

        if (leading) {
          const { description, tags } = doctrine.parse(leading, { unwrap: true, recoverable: true })

          attr.description = description //`Description: ${description}`

          d = description

          const { type, description: desc } = extractTypes(tags)

          if (0 < type.length) {
            const match = type.match(/\(([^()]*\|[^()]*)\)/),
              parts = match?.[1].split('|').map((s) => s.trim().replaceAll('"', '')) ?? []

            attr.description = `Value Type: ${0 < parts.length ? `“${parts.join('” | “')}”` : type}${desc ? ` ${desc}` : ''}${attr.description ? `\nDescription: ${attr.description}` : ''}`
            if (0 < parts.length) attr.values ??= parts.map((name) => ({ name })) //types.map((name) => ({ name }))

            t = 0 < parts.length ? `"${parts.join('" | "')}"` : type
          }
        }

        ;(htmlDataTagDescMap.get('attrs') ?? htmlDataTagDescMap.set('attrs', []).get('attrs'))?.push(`    ${formatProp(attr.name)}?: ${t}${d ? ` // ${d}` : ''}`)
        ;(htmlDataTag.attributes ??= []).push(attr)
        //
        ;(module.declarations[0].attributes ??= []).push({ name: attr.name })
      }
    }

    if (htmlDataTagDescMap.has('desc')) htmlDataTagDescMap.get('desc')?.splice(1, 0, '---')

    htmlDataTagDescMap.set('element', [`  Declaration: '${declaration}'`])

    if (htmlDataTagDescMap.has('slots')) (htmlDataTagDescMap.get('slots')?.splice(0, 0, '  Slots: {'), htmlDataTagDescMap.get('slots')?.push('  }'))

    if (htmlDataTagDescMap.has('events')) (htmlDataTagDescMap.get('events')?.splice(0, 0, '  Events: {'), htmlDataTagDescMap.get('events')?.push('  }'))

    if (htmlDataTagDescMap.has('attrs')) (htmlDataTagDescMap.get('attrs')?.splice(0, 0, '  Attributes: {'), htmlDataTagDescMap.get('attrs')?.push('  }'))

    if (htmlDataTagDescMap.has('cssprops')) (htmlDataTagDescMap.get('cssprops')?.splice(0, 0, '  CSSProperties: {'), htmlDataTagDescMap.get('cssprops')?.push('  }'))

    if (htmlDataTagDescMap.has('parts')) (htmlDataTagDescMap.get('parts')?.splice(0, 0, '  Parts: {'), htmlDataTagDescMap.get('parts')?.push('  }'))

    if (htmlDataTagDescMap.has('examples')) htmlDataTagDescMap.get('examples')?.splice(0, 0, '### **Examples:**')

    htmlDataTagDescMap.set('interface1', [`interface ${cls.getName()}Signature {`])
    htmlDataTagDescMap.set('interface2', [`}`])
    htmlDataTagDescMap.set('class1', [`class ${cls.getName()} extends ${superclass}<${cls.getName()}Signature> {`])
    htmlDataTagDescMap.set('class2', [`}`])
    if (gdeclartion)
      htmlDataTagDescMap.set('decl', [
        `declare global {
  interface HTMLElementTagNameMap {
    ${formatProp(is)}: ${cls.getName()}
  }
}`,
      ])

    if (cls.getBaseClass()?.getName()?.startsWith('FormAssociated')) htmlDataTagDescMap.set('static', [`  static formAssociated = true;`])

    const order = ['interface1', 'element', 'attrs', 'slots', 'events', 'cssprops', 'parts', 'interface2', 'class1', 'static', 'props', 'fns', 'class2', 'decl']

    htmlDataTag.description = `${htmlDataTagDescMap.get('desc')?.join('\n')}\n\n\`\`\`ts\n${await prettier.format(
      [...htmlDataTagDescMap.entries()]
        .filter((item) => {
          return ['slots', 'interface1', 'element', 'interface2', 'static', 'events', 'decl', 'class1', 'class2', 'props', 'fns', 'attrs', 'cssprops', 'parts'].includes(item[0])
        })
        .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
        .map(([, values]) => values.join('\n'))
        .join('\n\n'),
      { parser: 'typescript', singleQuote: true, semi: false }
    )}\n\`\`\`${htmlDataTagDescMap.has('examples') ? `\n\n${htmlDataTagDescMap.get('examples')?.join('\n')}` : ''}\n`
    ;(htmlData.tags ??= []).push(htmlDataTag)

    customElements.modules.push(module)
  }
}

writeFileSync(resolve(__dirname, '../web-components.html-data/en.json'), JSON.stringify(htmlData, null, 2))

writeFileSync(resolve(__dirname, '../web-components.css-data/en.json'), JSON.stringify(cssData, null, 2))

writeFileSync(resolve(__dirname, '../custom-elements/en.json'), JSON.stringify(customElements, null, 2))
