export default function <T extends Element>(selector?: string, element?: Element): T[] {
  const siblings: T[] = []

  let prev = element?.previousElementSibling

  while (prev) {
    if (!selector || prev.matches(selector)) siblings.push(prev as T)

    prev = prev.previousElementSibling
  }

  return siblings
}
