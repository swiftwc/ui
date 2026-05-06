/**
 * A remove/set property utility that checks before doing DOM manipulations.
 * It enforces the important flag, the built-in functionality is to leave it as-is if there was an important flat and the setProperty does not have one
 * In case of undefined it does a removeProperty, the built-in functionality is to add a string representation ("undefined")
 *
 * Notes:
 * By default setProperty does NOT enforce important. It always triggers a DOM manipulation.
 * By default getPropertyValue returns a trimmed string but fails to inform of the presence in the style attribute.
 *
 * Examples:
 * [style]                            prop('--prop', '1rem', el) style="--prop: 1rem;"
 * [style]                            prop('--prop', null | '' | undefined, el) style
 * [style]                            prop('--prop', ' ', el) style="--prop: ;"
 * [style]                            prop('--prop', '  ', el) style="--prop:  ;"
 * style="--prop: 1rem;"              prop('--prop', '1rem', el, 'important') style="--prop: 1rem !important;"
 * style="--prop: 1rem !important;"   prop('--prop', '1rem', el) style="--prop: 1rem;"
 */
export default function (property: string, value?: string | null, el?: HTMLElement | null, priority?: 'important') {
  if (!el) return

  if (!value) {
    if (-1 !== Array.from(el.style).indexOf(property)) el.style.removeProperty(property) // remove key entirely

    return
  }

  const currentValue = el.style.getPropertyValue(property), // "" always trimmed
    currentPriority = el.style.getPropertyPriority(property) // "" always lowercase

  if (currentValue !== value.trim() || currentPriority !== (priority ?? '').toLowerCase()) el.style.setProperty(property, value, priority) // enforce priority
}
