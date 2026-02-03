const makePointerDownHandler = (target: HTMLElement, targetCallback: (target: HTMLElement) => HTMLElement, checkCallback: (event: PointerEvent) => boolean) => {
    return function (event: PointerEvent) {
      // if (event.pointerType !== 'touch')  return
      if (!checkCallback(event)) return

      targetCallback(target).toggleAttribute('touch-glass', true)
    }
  },
  makePointerCancelHandler = (target: HTMLElement, targetCallback: (target: HTMLElement) => HTMLElement) => {
    return function (event: PointerEvent) {
      targetCallback(target).toggleAttribute('touch-glass', false)
    }
  }

export default function (t: HTMLElement, targetCallback: (target: HTMLElement) => HTMLElement, checkCallback: (event: PointerEvent) => boolean) {
  const onListener = makePointerDownHandler(t, targetCallback, checkCallback),
    offListener = makePointerCancelHandler(t, targetCallback)

  const off = () => {
      t.removeEventListener('pointerdown', onListener)
      t.removeEventListener('pointerup', offListener)
      t.removeEventListener('pointercancel', offListener)
      t.removeEventListener('pointerleave', offListener)
    },
    on = () => {
      t.addEventListener('pointerdown', onListener, { passive: true })
      t.addEventListener('pointerup', offListener, { passive: true })
      t.addEventListener('pointercancel', offListener, { passive: true })
      t.addEventListener('pointerleave', offListener, { passive: true })

      return off
    }

  return {
    on,
    off,
  }
}
