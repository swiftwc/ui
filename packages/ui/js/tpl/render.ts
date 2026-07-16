import type { TemplateResult } from './html'

// --- Part types -------------------------------------------------------

interface ChildPart {
  type: 'child'
  anchor: Comment // was: start, end
  nodes: ChildNode[] // tracks what's currently inserted, so we can remove exactly that
  committed: unknown
}

interface AttrPart {
  type: 'attr'
  el: Element
  name: string
  committed: unknown
}

type Part = ChildPart | AttrPart

// --- Template preparation (runs ONCE per unique template literal) -----

const MARKER = '\uD83D\uDD25PART\uD83D\uDD25' // unlikely-collision sentinel

interface PreparedTemplate {
  element: HTMLTemplateElement
  // ordered list describing how to build a Part for each value index
  partDescriptors: Array<{ type: 'child' } | { type: 'attr'; name: string }>
}

const templateCache = new WeakMap<TemplateStringsArray, PreparedTemplate>()

function prepare(strings: TemplateStringsArray): PreparedTemplate {
  let cached = templateCache.get(strings)
  if (cached) return cached

  const partDescriptors: PreparedTemplate['partDescriptors'] = []
  let htmlStr = ''

  strings.forEach((chunk, i) => {
    htmlStr += chunk
    if (i < strings.length - 1) {
      // Is this interpolation inside an attribute value?
      // e.g. `...aria-checked="${...}"` — chunk ends with `attr="` or `attr='` or `attr=`
      const attrMatch = /([a-zA-Z0-9_-]+)=(["']?)$/.exec(chunk)
      if (attrMatch) {
        partDescriptors.push({ type: 'attr', name: attrMatch[1] })
        htmlStr += MARKER // becomes the attribute's value
      } else {
        partDescriptors.push({ type: 'child' })
        // start/end comment pair — gives us a stable region to patch later,
        // and room to grow into list/array rendering without a redesign
        htmlStr += `<!--${MARKER}-->`
      }
    }
  })

  const element = document.createElement('template')
  element.innerHTML = htmlStr
  cached = { element, partDescriptors }
  templateCache.set(strings, cached)
  return cached
}

// --- Instance: one per rendered container ------------------------------

interface Instance {
  strings: TemplateStringsArray
  fragmentRoot: DocumentFragment // kept only for identity checks, not reused
  parts: Part[]
}

const instanceCache = new WeakMap<Element | ShadowRoot, Instance>()

function createInstance(prepared: PreparedTemplate): { fragment: DocumentFragment; parts: Part[] } {
  const fragment = prepared.element.content.cloneNode(true) as DocumentFragment
  const parts: Part[] = []

  // Walk the clone once, in the same order `prepare()` emitted markers,
  // and bind each descriptor to a real node.
  const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT)
  let descriptorIndex = 0
  const descriptors = prepared.partDescriptors

  let node: Node | null
  while ((node = walker.nextNode())) {
    if (descriptorIndex >= descriptors.length) break

    if (node.nodeType === Node.COMMENT_NODE && (node as Comment).data === MARKER) {
      parts.push({ type: 'child', anchor: node as Comment, nodes: [], committed: undefined })
      descriptorIndex++
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element
      for (const attr of Array.from(el.attributes)) {
        if (attr.value === MARKER) {
          const desc = descriptors[descriptorIndex]
          if (desc.type === 'attr') {
            parts.push({ type: 'attr', el, name: desc.name, committed: undefined })
            descriptorIndex++
          }
        }
      }
    }
  }

  return { fragment, parts }
}

// --- Committing values into parts (the only thing that runs per update) -

function isTemplateResult(v: unknown): v is TemplateResult {
  return !!v && typeof v === 'object' && 'strings' in (v as any) && 'values' in (v as any)
}

function toNode(value: unknown): Node {
  if (value instanceof Node) return value
  if (isTemplateResult(value)) {
    const { fragment, parts } = createInstance(prepare(value.strings))
    parts.forEach((part, i) => {
      const v = value.values[i]
      part.type === 'child' ? commitChild(part, v) : commitAttr(part, v)
    })
    return fragment
  }
  return document.createTextNode(String(value))
}

function commitChild(part: ChildPart, value: unknown) {
  if (value === part.committed) return // dirty-check, skip untouched parts

  for (const n of part.nodes) n.remove()
  const nodes: ChildNode[] = []

  for (const item of Array.isArray(value) ? value : [value]) {
    if (item === null || item === undefined || item === false) continue
    const node = toNode(item)
    const inserted = node instanceof DocumentFragment ? Array.from(node.childNodes) : [node as ChildNode]
    part.anchor.before(node)
    nodes.push(...inserted)
  }

  part.nodes = nodes
  part.committed = value
}

function commitAttr(part: AttrPart, value: unknown) {
  if (value === part.committed) return
  if (value === null || value === undefined || value === false) {
    part.el.removeAttribute(part.name)
  } else {
    part.el.setAttribute(part.name, String(value))
  }
  part.committed = value
}

// --- Public render() ----------------------------------------------------

export default function (result: TemplateResult, container: Element | ShadowRoot) {
  const prepared = prepare(result.strings)
  let instance = instanceCache.get(container)

  if (!instance || instance.strings !== result.strings) {
    // first render, OR the template shape changed entirely — full (re)build
    container.textContent = ''
    const { fragment, parts } = createInstance(prepared)
    container.append(fragment)
    instance = { strings: result.strings, fragmentRoot: fragment, parts }
    instanceCache.set(container, instance)
  }

  // same template shape as last time → patch existing DOM nodes only,
  // no innerHTML, no re-clone, no focus/scroll loss
  instance.parts.forEach((part, i) => {
    const value = result.values[i]
    if (part.type === 'child') commitChild(part, value)
    else commitAttr(part, value)
  })
}
