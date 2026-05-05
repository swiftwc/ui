import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import frame from './frame'

describe('frame', () => {
  beforeEach(() => {
    let id = 0
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      setTimeout(() => cb(performance.now()), 0)
      return ++id
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('resolves with a timestamp when no element is provided', async () => {
    const t = await frame()
    expect(typeof t).toBe('number')
    expect(t).toBeGreaterThan(0)
  })

  it('resolves with a timestamp when element is connected', async () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    const t = await frame(el)
    expect(typeof t).toBe('number')
    expect(t).toBeGreaterThan(0)
    el.remove()
  })

  it('resolves with undefined when element is disconnected', async () => {
    const el = document.createElement('div') // not appended
    const t = await frame(el)
    expect(t).toBeUndefined()
  })

  it('is falsy when disconnected — early return pattern works', async () => {
    const el = document.createElement('div')
    const t = await frame(el)
    expect(t).toBeFalsy()
  })

  it('is truthy when connected — early return pattern works', async () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    const t = await frame(el)
    expect(t).toBeTruthy()
    el.remove()
  })

  it('.then callback does not fire when disconnected', async () => {
    const el = document.createElement('div')
    const cb = vi.fn()
    await frame(el).then((t) => {
      if (t) cb()
    })
    expect(cb).not.toHaveBeenCalled()
  })

  it('.then callback fires when connected', async () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    const cb = vi.fn()
    await frame(el).then((t) => {
      if (t) cb()
    })
    expect(cb).toHaveBeenCalledOnce()
    el.remove()
  })

  it('always calls rAF exactly once', async () => {
    const spy = vi.spyOn(self, 'requestAnimationFrame')
    const el = document.createElement('div')
    await frame(el)
    expect(spy).toHaveBeenCalledOnce()
    spy.mockRestore()
  })
})
