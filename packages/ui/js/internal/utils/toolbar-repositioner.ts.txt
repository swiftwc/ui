export default function (el: HTMLElement, evt: MediaQueryListEvent) {
  if (evt.matches) {
    const newSlot = el.getAttribute('preferred-fine-modal-placement') ?? 'bottom-bar-trailing'

    if (el.slot !== newSlot) el.dataset.previousSlot = el.slot // save for later restoration if diff

    el.slot = el.getAttribute('preferred-fine-modal-placement') ?? 'bottom-bar-trailing'
  } else if (el.dataset.previousSlot) {
    el.slot = el.dataset.previousSlot ?? ''

    delete el.dataset.previousSlot
  }
}
