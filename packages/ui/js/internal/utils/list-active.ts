function onClick(event: PointerEvent) {
  const el = (event.target as HTMLElement).closest<HTMLElement>('button,summary')
  if (!el) return

  el.classList.add('active')

  el.addEventListener('pointerleave', onCancel)
}

function onCancel(event: PointerEvent) {
  const el = (event.target as HTMLElement).closest<HTMLElement>('button,summary')
  if (!el) return

  self.requestAnimationFrame(() => {
    el.removeEventListener('pointerleave', onCancel)

    el.classList.remove('active')
  })
}

const makePointerDownHandler = (target: HTMLElement) => {
    return onClick as EventListener
  },
  makePointerCancelHandler = (target: HTMLElement) => {
    return onCancel as EventListener
  }

export default function (t: HTMLElement) {
  const onListener = makePointerDownHandler(t),
    offListener = makePointerCancelHandler(t)

  return [
    { types: 'pointerdown', listener: onListener, addOptions: { passive: true } },
    { types: 'pointerup pointercancel', listener: offListener, addOptions: { passive: true } },
  ]
}
