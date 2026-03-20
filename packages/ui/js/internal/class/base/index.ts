interface ElementState {
  connected: boolean
  pending: Map<string, string | null>
  applied: Map<string, string | null>
  scheduled: boolean
}

const state = new WeakMap<HTMLElement, ElementState>()

const s = (el: HTMLElement) => {
  let st = state.get(el)
  if (!st) {
    st = { connected: false, pending: new Map(), applied: new Map(), scheduled: false }
    state.set(el, st)
  }
  return st
}

export abstract class Base extends HTMLElement {
  // ── browser lifecycle (do not override) ───────────────────

  connectedCallback() {
    const st = s(this)

    st.connected = true

    this.didInsertElement() // subclass sets up first

    this.#flush() // attrs apply after
  }

  disconnectedCallback() {
    const st = s(this)

    st.connected = false

    st.scheduled = false

    this.willDestroyElement() // ← fires first, state still readable

    st.pending = new Map()

    st.applied = new Map() // ← stale across reconnect otherwise
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return

    const st = s(this)

    st.pending.set(name, newVal) // last write wins, Map dedupes naturally

    if (!st.connected) return

    this.#schedule()
  }

  // ── microtask batch ───────────────────────────────────────

  #schedule() {
    const st = s(this)

    if (st.scheduled) return

    st.scheduled = true

    queueMicrotask(() => {
      const st = s(this)

      st.scheduled = false

      if (!st.connected) return

      this.#flush()
    })
  }

  #flush() {
    const st = s(this)

    for (const [name, value] of st.pending) {
      const prev = st.applied.get(name) ?? null

      if (prev !== value) {
        st.applied.set(name, value)
        this.didReceiveAttrs(name, value)
      }
    }

    st.pending.clear()
  }

  // ── safe hooks (override in subclasses) ───────────────────

  protected didInsertElement() {}
  protected willDestroyElement() {}
  protected didReceiveAttrs(name: string, newValue: string | null) {}
}
