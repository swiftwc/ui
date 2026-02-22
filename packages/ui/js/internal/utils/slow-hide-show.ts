export default function (to: 'show' | 'hide', el?: HTMLElement) {
  const transcleanup = (event: TransitionEvent) => {
    if ('opacity' !== event.propertyName) return

    el?.removeAttribute('slow')
  }

  for (const eventType of ['transitionend', 'transitioncancel'] as const)
    el?.addEventListener(eventType, transcleanup, {
      once: true,
    })

  el?.setAttribute('slow', '')

  requestAnimationFrame(() => el?.setAttribute('slow', to))
}
