import frame from './frame'

export default function (to: 'show' | 'hide', el?: HTMLElement) {
  const transcleanup = ({ propertyName }: TransitionEvent) => {
    if ('opacity' !== propertyName) return

    el?.removeAttribute('slow')
  }

  for (const eventType of ['transitionend', 'transitioncancel'] as const)
    el?.addEventListener(eventType, transcleanup, {
      once: true,
    })

  el?.setAttribute('slow', '')

  frame(el).then(() => {
    el?.setAttribute('slow', to)
  }) //self.requestAnimationFrame(() => el?.setAttribute('slow', to))
}
