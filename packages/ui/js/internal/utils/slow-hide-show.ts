import frame from './frame'

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

  frame().then(() => el?.setAttribute('slow', to)) //self.requestAnimationFrame(() => el?.setAttribute('slow', to))
}
