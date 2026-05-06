export default function <T extends Element>(selector?: string, element?: Element): T[] {
  const siblings: T[] = []

  let child = element?.parentElement?.firstElementChild

  while (child) {
    if (child !== element && (!selector || child.matches(selector))) siblings.push(child as T)

    child = child.nextElementSibling
  }

  return siblings
}
