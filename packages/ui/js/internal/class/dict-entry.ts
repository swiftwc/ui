export type DictEntry = {
  value: string
  title?: string
  subtitle?: string
  systemImage?: string
  src?: string
  children: DictEntry[]
}

export type Dictionary = DictEntry[]

type DictEntryInput = Omit<Partial<DictEntry>, 'children'> & { children?: DictEntryInput[] }

const attr = (el: Element, name: string) => el.getAttribute(name) ?? undefined

export const DictEntry = {
  /** Normalizes a DOM node or untrusted plain object into a complete DictEntry */
  from(node: Element | DictEntryInput): DictEntry {
    return node instanceof Element ? DictEntry.fromElement(node) : DictEntry.fromPlain(node)
  },

  fromPlain(n: DictEntryInput): DictEntry {
    return { ...n, value: n.value ?? '', children: (n.children ?? []).map(DictEntry.fromPlain) }
  },

  fromElement(el: Element): DictEntry {
    if (el instanceof HTMLOptionElement) {
      const label = attr(el, 'label'),
        raw = attr(el, 'value') ?? el.textContent?.trim()

      return {
        value: raw || label || '', // was extractTag
        title: label ?? attr(el, 'value') ?? (el.textContent?.trim() || undefined), // was extractLabel
        subtitle: attr(el, 'data-subtitle'),
        systemImage: attr(el, 'data-system-image'),
        children: [],
      }
    }

    return {
      value: '',
      title: attr(el, 'DATALIST' === el.tagName ? 'data-label' : 'label'),
      subtitle: attr(el, 'data-subtitle'),
      systemImage: attr(el, 'data-system-image'),
      children: Array.from(el.children, DictEntry.fromElement),
    }
  },

  isLeaf: (n: DictEntry) => 0 === n.children.length,
  hasOnlyLeaves: (n: DictEntry) => n.children.every(DictEntry.isLeaf), // was allLeaves
  leafValues: (n: DictEntry): string[] => (n.children.length ? n.children.flatMap(DictEntry.leafValues) : [n.value]), // was collectLeafValues
}

export const Dictionary = {
  parse(json: string | null): Dictionary {
    try {
      const raw = JSON.parse(json ?? '[]')
      return Array.isArray(raw) ? raw.map(DictEntry.fromPlain) : []
    } catch {
      console.error('invalid-dictionary')
      return []
    }
  },

  fromElements: (els: Iterable<Element>): Dictionary => Array.from(els, DictEntry.fromElement),

  /** path-id ("0.2.1") → entry */
  index(nodes: Dictionary, parent = '', map = new Map<string, DictEntry>()) {
    nodes.forEach((n, i) => {
      const id = parent ? `${parent}.${i}` : `${i}`
      map.set(id, n)
      Dictionary.index(n.children, id, map)
    })
    return map
  },

  flatten(tree: Dictionary) {
    const labels: Record<string, string | undefined> = {},
      icons: Record<string, string | undefined> = {}
    const walk = (list: Dictionary) => {
      for (const { value, title, systemImage, children } of list) {
        labels[value] = title
        icons[value] = systemImage
        walk(children)
      }
    }
    walk(tree)
    return { labels, icons }
  },
}
