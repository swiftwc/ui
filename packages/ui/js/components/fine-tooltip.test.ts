import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { Snapshot } from '../client'

beforeEach(() => document.body.replaceChildren())

describe('fine-tooltip', () => {
  let el: HTMLElement
  let btn: HTMLButtonElement

  beforeEach(async () => {
    document.body.insertAdjacentHTML('beforeend', '<navigation-stack><scroll-view><button type="button" help="Save">Save</button></scroll-view></navigation-stack>')
    el = document.body.lastElementChild as HTMLElement
    btn = el.querySelector<HTMLButtonElement>('button')!

    await Snapshot.waitReady
  })
  afterEach(() => document.body.replaceChildren())

  test('.inert', async () => {
    btn.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }))

    await expect.poll(() => document.querySelector('fine-tooltip')?.matches(':popover-open')).toBe(true)

    expect(document.querySelector('fine-tooltip')?.inert).toBe(true)
  })

  test('.manual', async () => {
    btn.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }))

    await expect.poll(() => document.querySelector('fine-tooltip')?.matches(':popover-open')).toBe(true)

    expect(document.querySelector('fine-tooltip')?.popover).toBe('manual')
  })

  test('shows on hover with the help text', async () => {
    btn.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }))

    await expect.poll(() => document.querySelector('fine-tooltip')?.matches(':popover-open')).toBe(true)
    expect(document.querySelector('fine-tooltip > label-view')?.getAttribute('title')).toBe('Save')
  })

  test('updates when [help] changes', async () => {
    btn.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }))

    await expect.poll(() => document.querySelector('fine-tooltip')).not.toBeNull()

    btn.setAttribute('help', 'Saved')

    await expect.poll(() => document.querySelector('fine-tooltip > label-view')?.getAttribute('title')).toBe('Saved')
  })

  test('removes on unhover', async () => {
    btn.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }))

    await expect.poll(() => document.querySelector('fine-tooltip')).not.toBeNull()

    btn.dispatchEvent(new PointerEvent('pointerout', { bubbles: true }))

    await expect.poll(() => document.querySelector('fine-tooltip')).toBeNull()
  })

  test('removes when the trigger is removed', async () => {
    btn.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }))

    await expect.poll(() => document.querySelector('fine-tooltip')).not.toBeNull()

    btn.remove()

    await expect.poll(() => document.querySelector('fine-tooltip')).toBeNull()
  })
})
