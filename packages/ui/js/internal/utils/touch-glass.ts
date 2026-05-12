const makePointerdownHandler = (target: HTMLElement, targetCallback: (target: HTMLElement) => HTMLElement, checkCallback: (evt: PointerEvent) => boolean) => {
    return function (evt: PointerEvent) {
      // if (event.pointerType !== 'touch')  return
      if (!checkCallback(evt)) return

      targetCallback(target).toggleAttribute('touch-glass', true)
    } as EventListener
  },
  makePointercancelHandler = (target: HTMLElement, targetCallback: (target: HTMLElement) => HTMLElement) => {
    return function (evt: PointerEvent) {
      targetCallback(target).toggleAttribute('touch-glass', false)
    } as EventListener
  }

export default function (t: HTMLElement, targetCallback: (target: HTMLElement) => HTMLElement, checkCallback: (evt: PointerEvent) => boolean) {
  const downListener = makePointerdownHandler(t, targetCallback, checkCallback),
    cancelListener = makePointercancelHandler(t, targetCallback)

  return [
    { types: 'pointerdown', listener: downListener, addOptions: { passive: true } },
    { types: 'pointerup pointercancel pointerleave', listener: cancelListener, addOptions: { passive: true } },
  ]
}
