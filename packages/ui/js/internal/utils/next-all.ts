export default function <T extends Element>(selector?: string, element?: Element): T[] {
  const siblings: T[] = []

  let next = element?.nextElementSibling

  while (next) {
    if (!selector || next.matches(selector)) siblings.push(next as T)

    next = next.nextElementSibling
  }

  return siblings
}
