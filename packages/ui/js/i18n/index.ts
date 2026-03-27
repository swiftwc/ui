type LocaleInput = Intl.UnicodeBCP47LocaleIdentifier | Intl.Locale

type I18nProps = {
  tag?: LocaleInput
  options?: Intl.LocaleOptions
  locale: Intl.Locale
  decimalSeparator: string
}

export class I18n {
  static #readyCalled = false
  static #tag: LocaleInput = 'en'
  static #options?: Intl.LocaleOptions
  static #locale: Intl.Locale = new Intl.Locale('en')
  static #observer?: MutationObserver
  static #decimalSeparator: string = '.'

  // ----------------------------
  // Lazy init
  // ----------------------------
  static #ensureReady() {
    if (!this.#readyCalled) this.setOwnConfig()
  }

  // ----------------------------
  // Proxy with typed target
  // ----------------------------
  static _props: I18nProps = new Proxy({} as I18nProps, {
    get: (_, prop: keyof I18nProps) => {
      this.#ensureReady()
      switch (prop) {
        case 'tag':
          return this.#tag
        case 'options':
          return this.#options
        case 'locale':
          return this.#locale
        case 'decimalSeparator':
          return this.#decimalSeparator
      }
    },
    set: (_, prop: keyof I18nProps, value) => {
      switch (prop) {
        case 'tag':
          this.#observer?.disconnect()
          this.#observer = undefined
          this.#tag = value
          this.#getOwnConfig()
          break
        case 'options':
          this.#options = value
          this.#getOwnConfig()
          break
      }
      return true
    },
  })

  // ----------------------------
  // Accessors
  // ----------------------------
  static get tag() {
    return this._props.tag
  }
  static set tag(val) {
    this._props.tag = val
  }

  static get options() {
    return this._props.options
  }
  static set options(val) {
    this._props.options = val
  }

  static get locale() {
    return this._props.locale
  }

  static get decimalSeparator() {
    return this._props.decimalSeparator
  }

  // ----------------------------
  // Core logic
  // ----------------------------
  static setOwnConfig(options?: Intl.LocaleOptions) {
    if (!this.#readyCalled) this.#readyCalled = true

    this.#tag = document.documentElement.lang
    this.#options = options

    this.#observer?.disconnect()
    this.#observer = new MutationObserver(this.#handleMutation.bind(this))
    this.#observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    })

    this.#getOwnConfig()
  }

  static #handleMutation() {
    if (!this.#observer) return
    this.#tag = document.documentElement.lang
    this.#getOwnConfig()
  }

  static #getOwnConfig() {
    try {
      this.#locale = new Intl.Locale(this.#tag ?? 'en', this.#options)
    } catch {
      this.#locale = new Intl.Locale('en')
    }

    try {
      const nf = new Intl.NumberFormat(this.#locale)
      const parts = nf.formatToParts(1.1)
      this.#decimalSeparator = parts.find((p) => p.type === 'decimal')?.value ?? '.'
    } catch {
      this.#decimalSeparator = '.'
    }
  }
}
