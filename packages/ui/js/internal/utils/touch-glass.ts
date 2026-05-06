const makePointerDownHandler = (target: HTMLElement, targetCallback: (target: HTMLElement) => HTMLElement, checkCallback: (evt: PointerEvent) => boolean) => {
    return function (evt: PointerEvent) {
      // if (event.pointerType !== 'touch')  return
      if (!checkCallback(evt)) return

      targetCallback(target).toggleAttribute('touch-glass', true)
    } as EventListener
  },
  makePointerCancelHandler = (target: HTMLElement, targetCallback: (target: HTMLElement) => HTMLElement) => {
    return function (evt: PointerEvent) {
      targetCallback(target).toggleAttribute('touch-glass', false)
    } as EventListener
  }

export default function (t: HTMLElement, targetCallback: (target: HTMLElement) => HTMLElement, checkCallback: (evt: PointerEvent) => boolean) {
  const onListener = makePointerDownHandler(t, targetCallback, checkCallback),
    offListener = makePointerCancelHandler(t, targetCallback)

  return [
    { types: 'pointerdown', listener: onListener, addOptions: { passive: true } },
    { types: 'pointerup pointercancel pointerleave', listener: offListener, addOptions: { passive: true } },
  ]
}
