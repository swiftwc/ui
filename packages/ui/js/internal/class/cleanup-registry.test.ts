import { beforeEach, describe, expect, test, vi } from 'vitest'
import { CleanupRegistry } from './cleanup-registry'

describe('CleanupRegistry', () => {
  let a: HTMLElement
  let b: HTMLElement

  beforeEach(() => {
    a = document.createElement('div')
    b = document.createElement('div')
  })

  test('unregister without token runs every cleanup, default and named', () => {
    const d = vi.fn(),
      x = vi.fn()
    CleanupRegistry.register(a, d)
    CleanupRegistry.register(a, x, 'x')

    CleanupRegistry.unregister(a)

    expect(d).toHaveBeenCalledOnce()
    expect(x).toHaveBeenCalledOnce()
  })

  test('exact token runs only that group', () => {
    const x = vi.fn(),
      y = vi.fn()
    CleanupRegistry.register(a, x, 'x')
    CleanupRegistry.register(a, y, 'y')

    CleanupRegistry.unregister(a, 'x')

    expect(x).toHaveBeenCalledOnce()
    expect(y).not.toHaveBeenCalled()
  })

  test('wildcard matches string prefixes only', () => {
    const m1 = vi.fn(),
      m2 = vi.fn(),
      other = vi.fn(),
      sym = vi.fn()
    CleanupRegistry.register(a, m1, 'menu:open')
    CleanupRegistry.register(a, m2, 'menu:close')
    CleanupRegistry.register(a, other, 'tooltip')
    CleanupRegistry.register(a, sym, Symbol('menu:sym'))

    CleanupRegistry.unregister(a, 'menu:*')

    expect(m1).toHaveBeenCalledOnce()
    expect(m2).toHaveBeenCalledOnce()
    expect(other).not.toHaveBeenCalled()
    expect(sym).not.toHaveBeenCalled()
  })

  test('cleanups never run twice', () => {
    const fn = vi.fn()
    CleanupRegistry.register(a, fn, 'x')

    CleanupRegistry.unregister(a, 'x')
    CleanupRegistry.unregister(a, 'x')
    CleanupRegistry.unregister(a)

    expect(fn).toHaveBeenCalledOnce()
  })

  test('same function under the same token is deduped', () => {
    const fn = vi.fn()
    CleanupRegistry.register(a, fn, 'x')
    CleanupRegistry.register(a, fn, 'x')

    CleanupRegistry.unregister(a, 'x')

    expect(fn).toHaveBeenCalledOnce()
  })

  test('targets are isolated', () => {
    const fa = vi.fn(),
      fb = vi.fn()
    CleanupRegistry.register(a, fa)
    CleanupRegistry.register(b, fb)

    CleanupRegistry.unregister(a)

    expect(fa).toHaveBeenCalledOnce()
    expect(fb).not.toHaveBeenCalled()
  })

  test('unknown target or token is a no-op', () => {
    expect(() => CleanupRegistry.unregister(a)).not.toThrow()
    expect(() => CleanupRegistry.unregister(a, 'nope')).not.toThrow()
    expect(() => CleanupRegistry.unregister(a, 'nope*')).not.toThrow()
  })

  test('symbol tokens work', () => {
    const fn = vi.fn()
    const token = Symbol('t')
    CleanupRegistry.register(a, fn, token)

    CleanupRegistry.unregister(a, token)

    expect(fn).toHaveBeenCalledOnce()
  })

  test('a throwing cleanup propagates (documents current behavior)', () => {
    CleanupRegistry.register(
      a,
      () => {
        throw new Error('boom')
      },
      'x'
    )
    expect(() => CleanupRegistry.unregister(a, 'x')).toThrow('boom')
  })
})
