export type DictEntry = {
  value: string
  title?: string
  subtitle?: string
  systemImage?: string
  src?: string
  /**
   * 'group'   → inline disclosure (<optgroup>)
   * 'submenu' → nested menu / pushed page (<datalist>)
   * unset     → inferred: group if it only contains leaves, submenu otherwise
   */
  kind?: 'group' | 'submenu'
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
    const value = n.value ?? ''

    return {
      ...n,
      value,
      title: n.title ?? (value || undefined),
      children: (n.children ?? []).map(DictEntry.fromPlain),
    }
  },

  fromElement(el: Element): DictEntry {
    if (el instanceof HTMLOptionElement) {
      const label = attr(el, 'label'),
        raw = attr(el, 'value') ?? el.textContent?.trim()

      return {
        value: raw || label || '',
        title: (label ?? attr(el, 'value') ?? el.textContent?.trim()) || undefined,
        subtitle: attr(el, 'data-subtitle'),
        systemImage: attr(el, 'data-system-image'),
        src: attr(el, 'data-src'),
        children: [],
      }
    }

    return {
      value: '',
      title: attr(el, 'DATALIST' === el.tagName ? 'data-label' : 'label'),
      subtitle: attr(el, 'data-subtitle'),
      systemImage: attr(el, 'data-system-image'),
      src: attr(el, 'data-src'),
      kind: 'OPTGROUP' === el.tagName ? 'group' : 'submenu',
      children: Array.from(el.children, DictEntry.fromElement),
    }
  },

  /** A selectable option. An empty <optgroup>/<datalist> has a kind, so it is NOT a leaf */
  isLeaf: (n: DictEntry) => !n.kind && 0 === n.children.length,

  hasOnlyLeaves: (n: DictEntry): boolean => n.children.every(DictEntry.isLeaf),

  /** Only meaningful for non-leaves. Explicit kind wins, else infer from children */
  isGroup: (n: DictEntry): boolean => (n.kind ? 'group' === n.kind : DictEntry.hasOnlyLeaves(n)),

  leafValues: (n: DictEntry): string[] => (n.children.length ? n.children.flatMap(DictEntry.leafValues) : DictEntry.isLeaf(n) ? [n.value] : []),
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

  /** Leaves only. Groups from elements have value '' and would clobber the label of `<option value="">` */
  flatten(tree: Dictionary) {
    const labels: Record<string, string | undefined> = {},
      icons: Record<string, string | undefined> = {}

    const walk = (list: Dictionary) => {
      for (const n of list)
        if (DictEntry.isLeaf(n)) {
          labels[n.value] = n.title
          icons[n.value] = n.systemImage
        } else walk(n.children)
    }
    walk(tree)

    return { labels, icons }
  },
}
