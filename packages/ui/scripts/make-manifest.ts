import doctrine from 'doctrine'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as prettier from 'prettier'
import * as sass from 'sass'
import { ArrayLiteralExpression, ArrowFunction, FunctionExpression, Project, PropertyDeclaration, SyntaxKind, Node as TSMNode, TypeFormatFlags } from 'ts-morph'
import { kebabCase } from '../js/internal/utils/index.js'

const range = (n: number, fmt = (i: number) => String(i)) => Array.from({ length: n }, (_, i) => fmt(i)),
  leadingComment = (node: { getLeadingCommentRanges(): { getText(): string }[] }) => node.getLeadingCommentRanges().at(0)?.getText().trim(),
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

const scssDir = resolve(import.meta.dirname, '../scss'),
  emitted = new Map<string, unknown>()

// Sass Value -> plain JS
const toJs = (v: sass.Value): unknown => {
    if (v instanceof sass.SassMap) {
      return Object.fromEntries([...v.contents].map(([k, val]) => [String(toJs(k)), toJs(val)]))
    }
    if (v instanceof sass.SassString) return v.text
    if (v instanceof sass.SassNumber) return v.value
    if (v === sass.sassNull) return null
    if (v === sass.sassTrue) return true
    if (v === sass.sassFalse) return false
    if (v instanceof sass.SassColor) return v.toString() // named color literals
    if (v instanceof sass.SassList) return v.asList.toArray().map(toJs)
    return v.toString() // anything else: never recurse
  },
  describe = (decls: Record<string, unknown>) => Object.entries(decls).map(([prop, val]) => `${prop}: ${[val].flat().join(' ')};`)

sass.compileString(
  `
@use 'sass:meta';
@use 'maps';

@each $name, $value in meta.module-variables('maps') {
  $_: emit('#{$name}', $value);
}
`,
  {
    loadPaths: [scssDir],
    functions: {
      'emit($name, $value)': (args) => {
        emitted.set((args[0] as sass.SassString).text, toJs(args[1]))
        return sass.sassNull
      },
    },
  }
)
// console.debug(emitted)

const tintDescriptions = new Map([['gray', 'Like secondary, like disabled']])

const project = new Project({
  tsConfigFilePath: resolve(import.meta.dirname, '../tsconfig.json'),
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

//#region htmlData
// https://github.com/microsoft/vscode-html-languageservice/blob/main/docs/customData.schema.json
const names = (key: string) => {
    const v = emitted.get(key)
    if (v === undefined) throw new Error(`_maps.scss has no variable $${key}`)
    return asList(v)
  },
  asList = (v: unknown) => [v].flat() as string[],
  camel = (s: string) => s.replace(/-(\w)/g, (_, c) => c.toUpperCase()),
  declMaps = ['inline-map', 'block-map', 'inline-placement-map', 'block-placement-map'],
  declValueSets = declMaps.map((key) => ({
    name: camel(key.replace(/-map$/, '')) + 'Set',
    values: Object.entries(emitted.get(key) as Record<string, Record<string, unknown>>).map(([name, decls]) => ({
      name,
      description: `Applies \`${describe(decls).join(' ')}\` rules`,
    })),
  })),
  nameValueSets = [...emitted.keys()]
    .filter((k) => k.endsWith('-list') && k !== 'tint-list') // tint has custom descriptions
    .map((k) => ({
      name: camel(k.replace(/-list$/, '')), // 'picker-styles-list' -> 'pickerStyles'
      values: names(k).map((name) => ({ name })),
    })),
  htmlData: VsHtmlDataV1 = {
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
        valueSet: 'FrameInlineLength',
      },
      {
        name: 'frame:max-width',
        description: 'Sets max-inline-size',
        valueSet: 'FrameInlineLength',
      },
      {
        name: 'background-style',
        description: 'Overrides the context-aware styles for background colors',
        valueSet: 'BackgroundStyle',
      },
    ],
    valueSets: [
      {
        name: 'Font',
        values: Object.keys(emitted.get('label-fonts-map') as Record<string, unknown>).map((name) => ({
          name,
          description: `The font used ${(() => {
            switch (name) {
              case 'extra-large-title2':
                return 'second level extra large titles'
              case 'extra-large-title':
                return 'extra large titles'
              case 'large-title':
                return 'large titles'
              case 'title':
                return 'first level hierarchical headings'
              case 'title2':
                return 'second level hierarchical headings'
              case 'title3':
                return 'third level hierarchical headings'
              case 'headline':
                return 'headings'
              case 'subheadline':
                return 'subheadings'
              case 'body':
                return 'body text'
              case 'callout':
                return 'for callouts'
              case 'caption':
                return 'for standard captions'
              case 'footnote':
                return 'in footnotes'
              default:
                return `the ${name} size`
            }
          })()}`,
        })),
      },
      {
        name: 'Spacing',
        values: Array.from({ length: 51 }, (_, i) => ({ name: String(i), description: `${i / 10}rem` })),
      },
      {
        name: 'Tint',
        values: names('tint-list').map((name) => ({ name, description: tintDescriptions.has(name) ? tintDescriptions.get(name) : `System \`${name}\` color` })),
      },
      {
        name: 'Foreground',
        values: Object.entries(emitted.get('foreground-tokens') as Record<string, string>).map(([name, description]) => ({
          name,
          description: `Applies the system ${0 <= name.indexOf('.') ? `${name.split('.').pop()} ` : ''}${name.split('.').shift()} color (\`${description}\`)`,
        })),
      },
      ...declValueSets,
      ...nameValueSets,
      {
        name: 'ControlSize',
        values: Object.entries(emitted.get('button-sizes-map') as Record<string, Record<string, unknown>>).map(([name, decls]) => ({
          name,
          description: `A control version that is ${(() => {
            switch (name) {
              case 'mini':
                return 'minimally sized'
              case 'small':
                return 'proportionally smaller size for space-constrained views'
              case 'large':
                return 'prominently sized'
              case 'extra-large':
                return 'substantially sized. The largest control size'
              default:
                return `the ${name} size`
            }
          })()}`,
        })),
      },
      {
        name: 'Template',
        values: (emitted.get('stack-templates-list-vals') as unknown[])
          .map((t) => asList(t).join(' '))
          .map((item) => ({
            name: item.replace('minmax(0, 1fr)', 'spacer').replace(/repeat\(([^)]*)\)/g, (_, inner) => `repeat(${inner.replace(/\s+/g, '')})`),
            description: `Applies a \`${item}\` grid-template to the main-axis`,
          })),
      },
      {
        name: 'FrameInlineLength',
        values: [{ name: 'infinity', description: '100%' }, ...range(101).map((n) => ({ name: n, description: `${n}rem` })), ...range(101, (i) => `${i}cqi`).map((n) => ({ name: n, description: n }))],
      },
      {
        name: 'BackgroundStyle',
        values: [
          {
            name: 'initial',
            description:
              'Reverts any background styles applied to this element, usually by context-aware rules like for example the inset-grouped-list styling applied to all descendants of current view',
          },
        ],
      },
    ],
  }
//#endregion

//#region cssData
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
//#endregion

//#region customElements
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

    const htmlDataTagDescMap: Map<string, string[]> = new Map()

    switch (superclass) {
      case 'HTMLButtonElement':
        htmlDataTagDescMap.set('htmlbtns', [`    is: ${formatProp(is)} // <button is="${is}"></button>`])
        break
      case 'HTMLDialogElement':
        htmlDataTagDescMap.set('htmldlgs', [`    is: ${formatProp(is)} // <dialog is="${is}"></dialog>`])
        break
      case 'HTMLDetailsElement':
        htmlDataTagDescMap.set('htmldets', [`    is: ${formatProp(is)} // <details is="${is}"></details>`])
        break
      case 'HTMLFormElement':
        htmlDataTagDescMap.set('htmlforms', [`    is: ${formatProp(is)} // <form is="${is}"></form>`])
        break
      default:
        htmlDataTagDescMap.set('htmltagnames', [`    ${formatProp(is)}: ${cls.getName()} // <${is}></${is}>`])

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
    }

    const [decl] = module.declarations,
      lifecycle = new Set(['attributeChangedCallback', 'connectedCallback', 'disconnectedCallback', 'formAssociatedCallback', 'formDisabledCallback', 'formResetCallback', 'formStateRestoreCallback'])

    for (const m of getters) {
      const readonly = !setters.has(m.getName())
      const leading = leadingComment(m)

      const propTypeText = m?.getType().getText(m, TypeFormatFlags.NoTruncation)

      let d = ''

      if (leading) {
        const { description, tags } = doctrine.parse(leading, { unwrap: true, recoverable: true })

        d = description
      }
      ;(decl.members ??= []).push({
        kind: 'field',
        name: m.getName(),
        readonly,
        description: d,
        type: {
          text: propTypeText, //`${types.map((item) => item).join(' | ')}`,
        },
      })

      htmlDataTagDescMap.getOrInsertComputed('props', () => []).push(`  ${!readonly ? '' : `readonly `}${formatProp(m.getName())}: ${propTypeText}${d ? ` // ${d}` : ''}`)
    }

    for (const m of [...methods, ...arrowMethods]) {
      if (lifecycle.has(m.getName())) continue

      const leading = leadingComment(m)

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

      ;(decl.members ??= []).push({
        kind: 'method',
        name: m.getName(),
        description: d,
        return: {
          type: {
            text: returnTypeText,
          },
        },
      })

      htmlDataTagDescMap.getOrInsertComputed('fns', () => []).push(`  ${formatProp(m.getName())}(): ${returnTypeText}${d ? ` // ${d}` : ''}`)
    }

    const leading = leadingComment(cls)

    if (leading) {
      const { description, tags } = doctrine.parse(leading, { unwrap: true, recoverable: true })

      // if (description) htmlDataTagDescMap.set('desc', [description])

      htmlDataTag.references = [
        {
          name: 'Documentation',
          url: `https://swiftwc.github.io/ui/web-components/${is}`,
        },
      ]
      // decl.description = description

      for (const tag of tags ?? []) {
        switch (tag.title) {
          case 'summary':
            decl.description = tag.description ?? ''

            if (tag.description) htmlDataTagDescMap.set('desc', [tag.description]) //htmlDataTag.description = tag.description ?? undefined

            decl.description = tag.description ?? ''

            // TODO: override name with @element!
            continue

          case 'example': {
            const { title: a, description: b } = extractTag(tag.description ?? '')

            htmlDataTagDescMap
              .getOrInsertComputed('examples', () => [])
              .push(`**${b ?? 'Example'}:**`, `\`\`\`html\n${await prettier.format(a ?? '', { parser: 'html', htmlWhitespaceSensitivity: 'ignore' })}\n\`\`\``)

            continue
          }
          case 'event':
          case 'fires': {
            const { title: a, description: b, type: c } = extractTag(tag.description ?? '')

            ;(decl.events ??= []).push({
              name: a ?? '',
              description: b,
              type: {
                text: 'Event',
              },
            })

            if (a) htmlDataTagDescMap.getOrInsertComputed('events', () => []).push(`    ${formatProp(a)}: CustomEvent${c ? `<${c}>` : ``}${b ? ` // ${b}` : ''}`)

            continue
          }
          case 'slot': {
            const { title: a, description: b, type: c } = extractTag(tag.description ?? '')

            ;(decl.slots ??= []).push({
              name: a ?? '',
              description: b ?? undefined,
            })

            const slotName = a || 'default'

            htmlDataTagDescMap.getOrInsertComputed('slots', () => []).push(`    ${formatProp(slotName)}: ${c ?? 'HTMLElement[]'}${b ? ` // ${b}` : ''}`)

            continue
          }
          case 'cssprop': {
            const { title: a, description: b, type: c } = extractTag(tag.description ?? '')

            if (a) htmlDataTagDescMap.getOrInsertComputed('cssprops', () => []).push(`    ${formatProp(a)}?: ${c ?? 'string'}${b ? ` // ${b}` : ''}`)

            continue
          }
          case 'csspart': {
            const { title: a, description: b } = extractTag(tag.description ?? '')

            if (a) htmlDataTagDescMap.getOrInsertComputed('parts', () => []).push(`    ${formatProp(a)}: never${b ? ` // ${b}` : ''}`)

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
              ;(decl.attributes ??= []).push({
                name: lastIndex.trim(),
              })

              attr.name = lastIndex.trim()

              const types: string | string[] = ['boolean'].includes(c) ? 'boolean' : c.split('|').map((item) => item.trim().replace(/['"`]/g, ''))
              if (c.startsWith('@')) {
                attr.valueSet = c.slice(1)
                htmlDataTagDescMap.getOrInsertComputed('attrs', () => []).push(`    ${formatProp(attr.name)}?: ${c.slice(1)}${b ? ` // ${b}` : ''}`)
              } else if (types) {
                attr.description = `Value Type: ${Array.isArray(types) ? `“${types.join('” | “')}”` : types}${attr.description ? `\n${attr.description}` : ''}`
                attr.values ??= Array.isArray(types) ? types.map((item) => ({ name: item })) : undefined

                htmlDataTagDescMap.getOrInsertComputed('attrs', () => []).push(`    ${formatProp(attr.name)}?: ${Array.isArray(types) ? `"${types.join('" | "')}"` : types}${b ? ` // ${b}` : ''}`)
              }
              ;(htmlDataTag.attributes ??= []).push(attr)
            } else {
              ;(decl.attributes ??= []).push({
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

        const leading = leadingComment(prop)

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

        htmlDataTagDescMap.getOrInsertComputed('attrs', () => []).push(`    ${formatProp(attr.name)}?: ${t}${d ? ` // ${d}` : ''}`)
        ;(htmlDataTag.attributes ??= []).push(attr)
        //
        ;(decl.attributes ??= []).push({ name: attr.name })
      }
    }

    if (htmlDataTagDescMap.has('desc')) htmlDataTagDescMap.get('desc')?.splice(1, 0, '---')

    // htmlDataTagDescMap.set('element', [`  Declaration: '${declaration}'`])
    htmlDataTagDescMap.set('decl1', [`declare global {`])
    htmlDataTagDescMap.set('decl2', [`}`])

    if (htmlDataTagDescMap.has('slots')) (htmlDataTagDescMap.get('slots')?.splice(0, 0, '  Slots: {'), htmlDataTagDescMap.get('slots')?.push('  }'))

    if (htmlDataTagDescMap.has('events')) {
      ;(htmlDataTagDescMap.get('events')?.splice(0, 0, 'interface GlobalEventMap<Targets = HTMLElementEventMap | DocumentEventMap | WindowEventMap> {'), htmlDataTagDescMap.get('events')?.push('}'))

      htmlDataTagDescMap.set('htmlevs', [
        `  interface HTMLElementEventMap extends GlobalEventMap {}`,
        `  interface DocumentEventMap extends GlobalEventMap {}`,
        `  interface WindowEventMap extends GlobalEventMap {}`,
      ])
    }

    if (htmlDataTagDescMap.has('attrs')) (htmlDataTagDescMap.get('attrs')?.splice(0, 0, '  Attributes: {'), htmlDataTagDescMap.get('attrs')?.push('  }'))

    if (htmlDataTagDescMap.has('cssprops')) (htmlDataTagDescMap.get('cssprops')?.splice(0, 0, '  CSSProperties: {'), htmlDataTagDescMap.get('cssprops')?.push('  }'))

    if (htmlDataTagDescMap.has('parts')) (htmlDataTagDescMap.get('parts')?.splice(0, 0, '  Parts: {'), htmlDataTagDescMap.get('parts')?.push('  }'))

    if (htmlDataTagDescMap.has('htmltagnames')) (htmlDataTagDescMap.get('htmltagnames')?.splice(0, 0, '  interface HTMLElementTagNameMap {'), htmlDataTagDescMap.get('htmltagnames')?.push('  }'))

    if (htmlDataTagDescMap.has('htmlbtns')) (htmlDataTagDescMap.get('htmlbtns')?.splice(0, 0, '  interface HTMLButtonElement {'), htmlDataTagDescMap.get('htmlbtns')?.push('  }'))
    if (htmlDataTagDescMap.has('htmldlgs')) (htmlDataTagDescMap.get('htmldlgs')?.splice(0, 0, '  interface HTMLDialogElement {'), htmlDataTagDescMap.get('htmldlgs')?.push('  }'))
    if (htmlDataTagDescMap.has('htmldets')) (htmlDataTagDescMap.get('htmldets')?.splice(0, 0, '  interface HTMLDetailsElement {'), htmlDataTagDescMap.get('htmldets')?.push('  }'))
    if (htmlDataTagDescMap.has('htmlforms')) (htmlDataTagDescMap.get('htmlforms')?.splice(0, 0, '  interface HTMLFormElement {'), htmlDataTagDescMap.get('htmlforms')?.push('  }'))

    if (htmlDataTagDescMap.has('examples')) htmlDataTagDescMap.get('examples')?.splice(0, 0, '### **Examples:**')

    htmlDataTagDescMap.set('interface1', [`interface ${cls.getName()}Signature {`])
    htmlDataTagDescMap.set('interface2', [`}`])
    htmlDataTagDescMap.set('class1', [`class ${cls.getName()} extends ${superclass}<${cls.getName()}Signature> {`])
    htmlDataTagDescMap.set('class2', [`}`])

    if (cls.getBaseClass()?.getName()?.startsWith('FormAssociated')) htmlDataTagDescMap.set('static', [`  static formAssociated = true;`])

    const order = [
        'interface1',
        'attrs',
        'slots',
        'cssprops',
        'parts',
        'interface2',
        'class1',
        'static',
        'props',
        'fns',
        'class2',
        'events',
        'decl1',
        'htmltagnames',
        'htmlbtns',
        'htmldlgs',
        'htmldets',
        'htmlforms',
        'htmlevs',
        'decl2',
      ],
      allowed = new Set([
        'slots',
        'interface1',
        'interface2',
        'static',
        'events',
        'htmltagnames',
        'class1',
        'class2',
        'props',
        'fns',
        'attrs',
        'cssprops',
        'parts',
        'decl1',
        'decl2',
        'htmlbtns',
        'htmldlgs',
        'htmldets',
        'htmlforms',
        // 'htmlevs',
      ])

    htmlDataTag.description = `${htmlDataTagDescMap.get('desc')?.join('\n')}\n\n\`\`\`ts\n${await prettier.format(
      htmlDataTagDescMap
        .entries()
        .filter(([k]) => allowed.has(k))
        .toArray()
        .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
        .map(([, values]) => values.join('\n'))
        .join('\n\n'),
      { parser: 'typescript', singleQuote: true, semi: false }
    )}\n\`\`\`${htmlDataTagDescMap.has('examples') ? `\n\n${htmlDataTagDescMap.get('examples')?.join('\n')}` : ''}\n`
    ;(htmlData.tags ??= []).push(htmlDataTag)

    customElements.modules.push(module)
  }
}
//#endregion

//#region writeFileSync
writeFileSync(resolve(import.meta.dirname, '../html-data/en.json'), JSON.stringify(htmlData, null, 2))

writeFileSync(resolve(import.meta.dirname, '../css-data/en.json'), JSON.stringify(cssData, null, 2))

writeFileSync(resolve(import.meta.dirname, '../custom-elements/en.json'), JSON.stringify(customElements, null, 2))
//#endregion
