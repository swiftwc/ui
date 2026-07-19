import { el, en } from './locales'

type LocaleInput = Intl.UnicodeBCP47LocaleIdentifier | Intl.Locale

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends object ? DeepStringify<T[K]> : string
}

type EnTranslations = DeepStringify<ReturnType<typeof en>>

/**
 * @fires localechange - On html[lang] change!
 */
export class I18n {
  static #readyCalled = false
  static #tag: LocaleInput = 'en'
  static #options?: Intl.LocaleOptions
  static #locale: Intl.Locale = new Intl.Locale('en')
  static #observer?: MutationObserver
  static #decimalSeparator: string = '.'
  static #dateSeparator: string = '/'
  static #dateOrder: string[] = ['month', 'day', 'year']
  static #lang: string = 'en'

  /** Registry: language code → factory. Pre-seeded with 'en'. */
  static #factories = new Map<string, () => EnTranslations>([
    ['en', en],
    ['el', el],
  ])
  /** Cache: language code → resolved translation object. */
  static #strings = new Map<string, EnTranslations>()

  static on = new EventTarget()

  // ----------------------------
  // Public registration API
  // ----------------------------

  /**
   * Register a translation factory for a language.
   * Call this before the language is first needed.
   *
   * @example
   * I18n.register('el', () => ({ SearchUnavailableContent: { … } }))
   */
  static register(lang: string, factory: () => EnTranslations) {
    this.#factories.set(lang, factory)
    this.#strings.delete(lang) // bust cache so next t() re-resolves
  }

  // ----------------------------
  // Lazy init
  // ----------------------------
  static #ensureReady() {
    if (!this.#readyCalled) this.setOwnConfig()
  }

  // ----------------------------
  // Accessors
  // ----------------------------
  static get tag() {
    this.#ensureReady()
    return this.#tag
  }
  static set tag(val) {
    this.#observer?.disconnect()
    this.#observer = undefined
    this.#tag = val
    this.#getOwnConfig()
  }

  static get options() {
    this.#ensureReady()
    return this.#options
  }
  static set options(val) {
    this.#options = val
    this.#getOwnConfig()
  }

  static get locale() {
    this.#ensureReady()
    return this.#locale
  }

  static get decimalSeparator() {
    this.#ensureReady()
    return this.#decimalSeparator
  }

  static get dateSeparator() {
    this.#ensureReady()
    return this.#dateSeparator
  }

  static get dateOrder() {
    this.#ensureReady()
    return this.#dateOrder
  }

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

    this.on.dispatchEvent(new CustomEvent('localechange', { detail: { lang: this.#tag } }))
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
      this.#decimalSeparator = parts.find(({ type }) => type === 'decimal')?.value ?? '.'
    } catch {
      this.#decimalSeparator = '.'
    }

    try {
      const df = new Intl.DateTimeFormat(this.#locale)
      const parts = df.formatToParts(new Date(2000, 11, 31))
      this.#dateOrder = parts.filter(({ type }) => type !== 'literal').map(({ type }) => type) ?? ['month', 'day', 'year']
      this.#dateSeparator =
        parts
          .filter(({ type }) => type === 'literal')
          .map(({ value }) => value)
          .at(0) ?? '/'
    } catch {
      this.#dateOrder = ['month', 'day', 'year']
      this.#dateSeparator = '/'
    }

    try {
      this.#lang = this.#resolveLanguage(this.#tag)
    } catch {
      this.#lang = 'en'
    }
  }

  /**
   * Resolve the best available language for a given BCP 47 tag.
   * Tries the full tag, then just the base language, then falls back to 'en'.
   */
  static #resolveLanguage(tag: string | Intl.Locale): string {
    const lang = tag instanceof Intl.Locale ? tag.language : new Intl.Locale(tag || 'en').language

    if (this.#factories.has(String(tag))) return String(tag)
    if (this.#factories.has(lang)) return lang
    return 'en'
  }

  /** Look up a top-level translation key for the current language, falling back to 'en'. */
  static t<K extends keyof EnTranslations>(key: K): EnTranslations[K] {
    this.#ensureReady()

    if (!this.#strings.has(this.#lang)) {
      const factory = this.#factories.get(this.#lang) ?? en
      this.#strings.set(this.#lang, factory())
    }

    const current = this.#strings.get(this.#lang)!

    if (key in current) return current[key]

    // Key missing from current language — fall back to en
    if (!this.#strings.has('en')) this.#strings.set('en', en())
    return this.#strings.get('en')![key]
  }
}
