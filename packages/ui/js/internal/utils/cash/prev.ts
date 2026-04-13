export default function <T extends Element>(selector?: string, element?: Element): T | undefined {
  let prev = element?.previousElementSibling

  while (prev) {
    if (!selector || prev.matches(selector)) return prev as T

    prev = prev.previousElementSibling
  }

  return undefined
}
