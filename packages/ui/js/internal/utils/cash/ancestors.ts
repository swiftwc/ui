export default function <T extends Element>(selector: string, element?: Element) {
  const matches: T[] = []

  let current = element?.closest<T>(selector) ?? undefined

  while (current) {
    matches.push(current)

    current = current.parentElement?.closest<T>(selector) ?? undefined
  }

  return matches
}

// function querySelectorAllUp(el, selector) {
//   const matches = [];
//   let current = el.parentElement;
//   while (current) {
//     if (current.matches(selector)) matches.push(current);
//     current = current.parentElement;
//   }
//   return matches;
// }

// function querySelectorAllUp(el, selector) {
//   const matches = [];
//   let current = el.closest(selector);
//   while (current) {
//     matches.push(current);
//     current = current.parentElement?.closest(selector);
//   }
//   return matches;
// }
