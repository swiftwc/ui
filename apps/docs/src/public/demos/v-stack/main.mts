import type { PickerSelectionEvent } from '@swiftwc/ui/events'

document.addEventListener('input', ({ target }: Event) => {
  if (!(target instanceof HTMLInputElement)) return

  update('spacing', target.value)
})

document.addEventListener('selection', (evt: PickerSelectionEvent) => {
  if (!(evt.target instanceof HTMLElement)) return

  update(
    evt.target.closest('labeled-content')?.getAttribute('label')?.toLowerCase() ??
      evt.target.closest('labeled-content')?.querySelector(':scope>label-view')?.getAttribute('title')?.toLowerCase() ??
      '',
    evt.detail.selection
  )
})

const update = (attr: string, value: string) => {
  const demo = document.querySelector('#demo'),
    span = document.querySelector(`#${attr}`)

  if (value?.includes('Off') || value?.startsWith('-')) {
    demo?.removeAttribute(attr)

    if (span) span.textContent = ``

    return
  }

  demo?.setAttribute(attr, value)

  if (span) span.textContent = ` ${attr}="${value}"`
}

const url = new URL(window.location.href)

switch (url.searchParams.get('case')) {
  case 'w':
    for (const el of document.querySelectorAll('#demo label-view[font]'))
      el.classList.add(
        `w-max`,
        `before:absolute`,
        `before:top-[-2px]`,
        `before:left-0`,
        `before:right-0`,
        `before:h-[2px]`,
        `before:bg-blue-500`,
        `after:content-['']`,
        `after:absolute`,
        `after:bottom-[-2px]`,
        `after:left-0`,
        `after:right-0`,
        `after:h-[2px]`,
        `after:bg-blue-500`
      )
    break
  case 'h':
    document
      .querySelector('#demo label-view[font=title3]')
      ?.classList.add(
        `h-50`,
        `before:content-['']`,
        `before:absolute`,
        `before:left-[-2px]`,
        `before:top-0`,
        `before:bottom-0`,
        `before:w-[2px]`,
        `before:bg-blue-500`,
        `after:content-['']`,
        `after:absolute`,
        `after:right-[-2px]`,
        `after:top-0`,
        `after:bottom-0`,
        `after:w-[2px]`,
        `after:bg-blue-500`
      )
    break
}
