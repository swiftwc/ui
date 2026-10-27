import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { en } from './locales'

const fresh = async () => {
  vi.resetModules()
  return (await import('./index')).I18n
}

let I18n: Awaited<ReturnType<typeof fresh>>
const key = Object.keys(en())[0] as keyof ReturnType<typeof en>
const tick = () => new Promise((r) => setTimeout(r))

beforeEach(async () => {
  document.documentElement.lang = 'en'
  I18n = await fresh()
})

afterEach(() => {
  I18n.tag = 'en' // disconnects this instance's observer
  document.documentElement.lang = 'en'
})

describe('I18n config', () => {
  test('lazily reads html[lang] on first access', () => {
    document.documentElement.lang = 'el'
    expect(I18n.locale.language).toBe('el')
  })

  test('decimal separator', () => {
    I18n.tag = 'en'
    expect(I18n.decimalSeparator).toBe('.')
    I18n.tag = 'el'
    expect(I18n.decimalSeparator).toBe(',')
  })

  test('date order and separator', () => {
    I18n.setOwnConfig()
    I18n.tag = 'en-US'
    expect(I18n.dateOrder).toEqual(['month', 'day', 'year'])
    expect(I18n.dateSeparator).toBe('/')

    I18n.tag = 'de'
    expect(I18n.dateOrder).toEqual(['day', 'month', 'year'])
    expect(I18n.dateSeparator).toBe('.')
  })

  test('options are applied to the locale', () => {
    I18n.setOwnConfig({ calendar: 'gregory' })
    expect(I18n.locale.calendar).toBe('gregory')
  })

  test('invalid or empty lang falls back to en', () => {
    for (const lang of ['not a tag!!', '']) {
      document.documentElement.lang = lang
      I18n.setOwnConfig()
      expect(I18n.locale.language).toBe('en')
      expect(I18n.decimalSeparator).toBe('.')
    }
  })
})

describe('I18n events', () => {
  test('localechange fires on html[lang] change', async () => {
    I18n.setOwnConfig()
    const { promise, resolve } = Promise.withResolvers<CustomEvent>()
    I18n.on.addEventListener('localechange', (e) => resolve(e as CustomEvent), { once: true })

    document.documentElement.lang = 'el'

    expect((await promise).detail).toEqual({ lang: 'el' })
    expect(I18n.locale.language).toBe('el')
  })

  test('setting tag stops observing html[lang]', async () => {
    I18n.setOwnConfig()
    I18n.tag = 'de'
    const spy = vi.fn()
    I18n.on.addEventListener('localechange', spy)

    document.documentElement.lang = 'el'
    await tick()

    expect(spy).not.toHaveBeenCalled()
    expect(I18n.locale.language).toBe('de')
  })

  test('setOwnConfig twice does not double-fire', async () => {
    I18n.setOwnConfig()
    I18n.setOwnConfig()
    const spy = vi.fn()
    I18n.on.addEventListener('localechange', spy)

    document.documentElement.lang = 'el'
    await tick()

    expect(spy).toHaveBeenCalledOnce()
  })
})

describe('I18n.t', () => {
  test('returns en by default', () => {
    expect(I18n.t(key)).toEqual(en()[key])
  })

  test('uses registered language, matching full tag then base language', () => {
    I18n.register('xx', () => ({ ...en(), [key]: 'XX' }) as never)

    I18n.tag = 'xx'
    expect(I18n.t(key)).toBe('XX')

    I18n.tag = 'xx-YY'
    expect(I18n.t(key)).toBe('XX')
  })

  test('falls back to en for missing keys', () => {
    I18n.register('xx', () => ({}) as never)
    I18n.tag = 'xx'
    expect(I18n.t(key)).toEqual(en()[key])
  })

  test('unregistered language falls back to en', () => {
    I18n.tag = 'fr'
    expect(I18n.t(key)).toEqual(en()[key])
  })

  test('factory result is cached, register busts the cache', () => {
    const factory = vi.fn(() => ({ ...en(), [key]: 'v1' }) as never)
    I18n.register('xx', factory)
    I18n.tag = 'xx'

    I18n.t(key)
    I18n.t(key)
    expect(factory).toHaveBeenCalledOnce()

    I18n.register('xx', () => ({ ...en(), [key]: 'v2' }) as never)
    expect(I18n.t(key)).toBe('v2')
  })
})
