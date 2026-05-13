const touchList = new WeakMap()

function onDown({ target }: PointerEvent) {
  const el = (target as HTMLElement | null)?.closest<HTMLElement>('button,summary')
  if (!el) return

  touchList.set(
    el,
    setTimeout(() => {
      if (!touchList.has(el)) return

      el.classList.add('active')
    }, 70)
  )

  el.addEventListener('pointerleave', onLeave, { once: true, passive: true })

  el.closest<HTMLElement>('scroll-view')?.addEventListener('scroll', onScroll, { once: true, passive: true })
}

function onOver({ target, buttons }: PointerEvent) {
  const el = (target as HTMLElement | null)?.closest<HTMLElement>('button,summary')
  if (!el) return

  if (0 === buttons) return

  el.classList.add('active')

  el.removeEventListener('pointerover', onOver)

  el.addEventListener('pointerleave', onLeave, { once: true, passive: true })
}

function onLeave({ target }: PointerEvent) {
  const el = (target as HTMLElement | null)?.closest<HTMLElement>('button,summary')
  if (!el) return

  el.addEventListener('pointerover', onOver, { once: true, passive: true })

  // self.requestAnimationFrame(() => {
  el.removeEventListener('pointerleave', onLeave)

  el.closest<HTMLElement>('scroll-view')?.removeEventListener('scroll', onScroll)

  el.classList.remove('active')
  if (touchList.has(el)) clearTimeout(touchList.get(el))
  touchList.delete(el)
  // })
}

function onCancel({ target }: PointerEvent) {
  const el = (target as HTMLElement | null)?.closest<HTMLElement>('button,summary')
  if (!el) return

  // self.requestAnimationFrame(() => {
  el.removeEventListener('pointerleave', onLeave)
  el.removeEventListener('pointerover', onOver)

  el.closest<HTMLElement>('scroll-view')?.removeEventListener('scroll', onScroll)

  el.classList.remove('active')
  if (touchList.has(el)) clearTimeout(touchList.get(el))
  touchList.delete(el)
  // })
}

function onScroll({ target }: Event) {
  for (const el of (target as HTMLElement | null)?.querySelectorAll<HTMLElement>('button,summary') ?? []) {
    el.classList.remove('active')
    if (touchList.has(el)) clearTimeout(touchList.get(el))
    touchList.delete(el)

    el.removeEventListener('pointerleave', onLeave)
    el.removeEventListener('pointerover', onOver)
  }
}

const makePointerdownHandler = (target: HTMLElement) => {
    return onDown as EventListener
  },
  makePointerCancelHandler = (target: HTMLElement) => {
    return onCancel as EventListener
  }

export default function (t: HTMLElement) {
  const downListener = makePointerdownHandler(t),
    offListener = makePointerCancelHandler(t)

  return [
    { types: 'pointerdown', listener: downListener, addOptions: { passive: true } },
    { types: 'pointerup pointercancel', listener: offListener, addOptions: { passive: true } },
  ]
}
