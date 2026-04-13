export default function <T extends Element>(selector?: string, element?: Element): T | undefined {
  let next = element?.nextElementSibling

  while (next) {
    if (!selector || next.matches(selector)) return next as T

    next = next.nextElementSibling
  }

  return undefined
}
