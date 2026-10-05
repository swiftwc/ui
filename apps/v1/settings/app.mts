import '../../../packages/ui/js/client'
import '../main.mts'

// import { modifyDOMforwards, modifyDOMbackwards, queryTemplate } from '../main.mts'
//   import { startViewTransition, NavigationPath } from '../../../packages/ui/js/client'

document.addEventListener('click', async (evt: Event) => {
  if (!(evt.target instanceof HTMLElement)) return

  const menu = evt.target.closest('.custom-picker-menu')
  if (menu) {
    const slotted = menu.querySelector(':scope>[slot=label]')
    if (!slotted) return

    const btn = evt.target.closest<HTMLButtonElement>('button[value]')
    if (!btn) return

    const clone = btn.querySelector<HTMLElement>('[data-role="check"]')?.nextElementSibling?.cloneNode(true) as HTMLElement | undefined
    if (!clone) return
    clone.slot = 'label'
    clone.dataset.selection = btn.value

    slotted.replaceWith(clone)

    for (const el of menu.querySelectorAll<HTMLButtonElement>(':scope>button[value]:not([slot])'))
      el.querySelector('[data-role="check"]')?.classList.toggle('invisible', el.value !== btn.value)
  }
})

const vs = document.getElementById('sidebar_stack')

document.querySelector('#sidebar_stack ~ [is=search-view]')?.addEventListener('input', ({ target }) => {
  if (!(target instanceof HTMLInputElement)) return

  if (!vs) return

  vs.replaceChildren(map.get(0 < target.value.length ? 'content_unavailable' : 'sidebar_list') ?? '')
})

const map: Map<string, HTMLElement | null> = new Map(
  [...document.querySelectorAll<HTMLTemplateElement>('template[id]')].map((tpl) => [
    tpl.id,
    document.importNode(tpl.content, true).firstElementChild as HTMLElement | null,
  ])
)

vs?.replaceChildren(map.get('sidebar_list') ?? '')
