import { alert, confirmationDialog, lifecycleObserver, NavigationPath, queryInsertPosition, startViewTransition } from '@swiftwc/ui/client'

document.addEventListener('commit', async (evt) => {
  console.log('commit!!!', evt.detail, evt.target)

  // alert(event.detail)
})
document.addEventListener('selection', async (evt) => {
  console.log('selection!!!', evt.detail, evt.target)

  if (evt.detail.selection) console.log(evt.detail.selection)
})

const toggleHandler = async (evt: ToggleEvent) => {
  console.debug(`⚡️ ${evt?.type}`)

  if (!(evt.target instanceof HTMLElement)) return

  if ('closed' !== evt.newState) return

  if (!evt.target?.querySelector('[aria-selected=true]:not(summary)')) return

  const path = new NavigationPath(evt.target)?.hydrate()

  const from1 = [...path.children()].at(0)

  if (from1?.body)
    await startViewTransition(from1.body, 'backwards', async () => {
      modifyDOMbackwards(from1)
    })
}

const addBindings = () => {
  for (const el of document.querySelectorAll('details.rootonclose')) {
    el.removeEventListener('toggle', toggleHandler as unknown as EventListener)
    el.addEventListener('toggle', toggleHandler as unknown as EventListener)
  }
}

document.body.addEventListener('submit', async (evt) => {
  console.debug(`⚡️ ${evt?.type}`)

  if (!(evt.target instanceof HTMLElement)) return

  const form = evt.target.closest('[is=form-view]:not([is="tab-bar"] [is=form-view],[is="sidebar-view"] [is=form-view])')

  if (!form) return

  evt.preventDefault()

  const navDest = evt.submitter?.closest('button[data-nav-destination]')
  if (navDest) {
    const template = queryTemplate(navDest.dataset.navDestination) //?? document.getElementById(navDest.getAttribute('navigation-destination'))

    const path = new NavigationPath(evt.submitter ?? undefined)?.hydrate()

    if (evt.submitter?.closest('.inplace')) {
      const parent = [...path.parents()].at(0)?.hydrate()

      if (parent) modifyDOMforwards(undefined, parent, template)
    } else if (evt.submitter)
      await startViewTransition(evt.submitter, 'forwards', async () => {
        modifyDOMforwards(undefined, path, template)
      })
  }

  addBindings()
})

// document.body.addEventListener('pointerenter', async (event) => {
//   const itm = event.target.closest('label-view')
//   if (!itm) return

//   // event.target.style.setProperty('--label--host-grid-template-columns', 'auto minmax(0,1fr)')
//   // getComputedStyle(document.body).getPropertyValue('--face')

//   // document.documentElement.computedStyleMap().get(`--navigation-bar-block-size`)

//   // const style = getComputedStyle(event.target)
//   // console.log(999, style.getPropertyValue('--label-style'), style.getPropertyValue('gap'))

//   // itm.style.setProperty('--label-style', 'automatic')
//   // itm.style.setProperty('--label--host-grid-template-columns', 'auto minmax(0, 1fr)')
//   // itm.style.setProperty('--label--host-grid-template-rows', 'minmax(0, 1fr)')
//   // itm.style.setProperty('--label-gap', '0.3rem')
//   // itm.style.setProperty('--label--host-gap', 'var(--label-gap)')

//   // self.requestAnimationFrame(() => {
//   // itm.style.setProperty('--label-style', 'automatic')
//   const cont = itm.shadowRoot.querySelector('div')
//   console.log(999, cont)
//   queueMicrotask(() => {
//     cont.style.setProperty('grid-template-columns', 'minmax(0, 1fr)')
//     cont.style.setProperty('grid-template-rows', 'minmax(0, 1fr)')
//     cont.style.setProperty('gap', '0.3rem')
//   })
//   // cont.style.removeProperty('grid-template-columns')
//   // cont.style.removeProperty('grid-template-rows')
//   // cont.style.removeProperty('gap')
//   self.requestAnimationFrame(() => {
//     cont.style.setProperty('grid-template-columns', 'minmax(0, 1fr)')
//     cont.style.setProperty('grid-template-rows', 'minmax(0, 1fr)')
//     cont.style.setProperty('gap', '0.3rem')
//   })

//   // cont.dataset.addd = Math.random()
//   itm.style.setProperty('pointer-events', 'fill')

//   // itm.style.setProperty('--label--host-gap', 'var(--label-gap)')
//   // })
// })
document.body.addEventListener('click', async (evt) => {
  console.debug(`⚡️ ${evt?.type}`)

  if (!(evt.target instanceof HTMLElement)) return

  const navDest = evt.target.closest('button[type="button"][data-nav-destination],summary[data-nav-destination]')

  if (evt.target.closest('.back')) {
    if (evt.target.closest('.back-confirmation')) {
      const confirm = await confirmationDialog(
        evt.target,
        'Are you sure?',
        'Are you very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very sure?',
        [
          {
            role: 'cancel',
          },
        ]
      )

      if ('0' === confirm) return
    }
    const path = new NavigationPath(evt.target)?.hydrate()

    const parent = [...path.parents()].at(0)?.hydrate()

    if (navDest && parent?.body) parent.component.inert = true

    await startViewTransition(evt.target, 'backwards', async () => {
      modifyDOMbackwards(path)
    })

    if (navDest && parent?.body) {
      await startViewTransition(parent.body, 'forwards', async () => {
        modifyDOMforwards(undefined, parent, queryTemplate(navDest.dataset.navDestination))
      })

      addBindings()

      if (parent.component) parent.component.inert = false
    }
  } else if (navDest) {
    const template = queryTemplate(navDest.dataset.navDestination) //?? document.getElementById(navDest.getAttribute('navigation-destination'))

    const path = new NavigationPath(evt.target)?.hydrate()

    if (evt.target.closest('.inplace')) {
      const parent = [...path.parents()].at(0)?.hydrate()

      if (parent) modifyDOMforwards(undefined, parent, template)
    } else {
      const summary = evt.target.closest('summary:has(button)')

      if (summary) {
        evt.preventDefault()

        if (evt.target.closest('button')) return summary.closest('details')?.toggleAttribute('open')
      }

      await startViewTransition(evt.target, 'forwards', async () => {
        modifyDOMforwards(undefined, path, template)
      })
    }

    addBindings()
  }

  if (evt.target.closest('button')) {
    if (evt.target.closest('.alert')) {
      void alert(
        'Cannot Get Mail Cannot Get Mail Cannot Get Mail Cannot Get Mail Cannot Get Mail Cannot Get Mail',
        'The connection to the server failed. The connection to the server failed. The connection to the server failed. The connection to the server failed. The connection to the server failed. The connection to the server failed. The connection to the server failed.',
        [
          // 'Delete',
          {
            label: 'Delete',
            role: 'destructive',
            // action() {
            //   alert(99)
            // },
          },
        ]
      )
    } else if (evt.target.closest('.alert2')) {
      void alert()
    }
    if (evt.target.closest('.backtocontroller')) {
      const path = new NavigationPath(evt.target)?.hydrate()

      const parent = [...path.parents()].at(-2)?.hydrate()

      if (parent?.body)
        await startViewTransition(parent.body, 'backwards', async () => {
          modifyDOMbackwards(parent)
        })

      return
    }

    if (evt.target.closest('.make-list')) {
      const btn = evt.target.closest('.make-list')
      for (const el of btn?.closest('v-stack')?.querySelectorAll('list-view') ?? [])
        if (btn?.getAttribute('list')) el.setAttribute('list-style', btn.getAttribute('list'))
        else el.removeAttribute('list-style')
      for (const el of btn?.closest('v-stack')?.querySelectorAll('[is=form-view]') ?? [])
        if (btn?.getAttribute('list')) el.setAttribute('form-style', btn.getAttribute('list'))
        else el.removeAttribute('form-style')
    }

    if (evt.target.closest('.bww')) {
      const path = new NavigationPath(evt.target)?.hydrate()

      const parent = [...path.parents()].at(-2)

      // const sv = queryBodyAll(getRootViewController(event.target)).at(1),
      //   // closestBody(
      //   //     queryBodyAll(document).at(1) //[...document.querySelectorAll('scroll-view:not(navigation-stack[hidden] scroll-view,navigation-split-view[hidden] scroll-view)')][1]
      //   //   ),
      //   host = closestHost(sv) //queryFrameToolbars(sv).scene.parentElement

      if (parent?.body)
        await startViewTransition(parent.body, 'backwards', async () => {
          modifyDOMbackwards(parent)
        })
    } else if (evt.target.closest('.bww2')) {
      // const sv = queryBodyAll(event.target.closest('dialog')).at(1), //[...event.target.closest('dialog').querySelectorAll('scroll-view')][1],
      //   host = closestHost(sv) //queryFrameToolbars(sv).scene.parentElement

      const path = new NavigationPath(evt.target)?.hydrate()

      const parent = [...path.parents()]
        .filter((item) => item.component?.matches('dialog>:scope'))
        .at(0)
        ?.hydrate()

      if (parent?.body)
        await startViewTransition(parent.body, 'backwards', async () => {
          modifyDOMbackwards(parent)
        })
    }

    if (evt.target.closest('.bw')) {
      // const sv = closestBody(event.target), //event.target.closest('scroll-view') ?? event.target.closest('tool-bar')?.previousElementSibling,
      //   pr = closestHost(sv) //queryFrameToolbars(sv).scene.parentElement //sv.parentElement

      // const { host } = getComputedView(closestBody(event.target))
      const path = new NavigationPath(evt.target)?.hydrate()

      await startViewTransition(evt.target, 'backwards', async () => {
        modifyDOMbackwards(path)
      })
    }
  }

  // safari-only polyfill
  // for(const el of [...document.querySelectorAll('scroll-view')]) el.hidden = el.matches(
  //     `navigation-stack:has(> content-view) > scroll-view,
  //      dialog:has(> content-view) > scroll-view,
  //      content-view:has(> content-view) > scroll-view`
  //   );

  // console.log(999, getComputedStyle(event.target.closest('navigation-stack,content-view')).display)

  if (evt.target.id === 'btn2') {
    // alert(99)
    evt.target.closest('content-view')?.remove()
  }

  // alert(event.target.hidden)

  // document.querySelector('ui-label').hidden= !document.querySelector('ui-label').hidden
})

// document.querySelector('.gg').addEventListener('click', event => {
//     console.log(555)
// })

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('sw.mjs')
    .then(() => console.debug('⚡️ registered'))
    .catch(console.error)
}

let deferredPrompt = null

window.addEventListener('beforeinstallprompt', (evt) => {
  // Prevent Chrome from showing the default prompt
  evt.preventDefault()

  // stash
  deferredPrompt = evt

  // Show your custom install UI
  const btn = document.querySelector('#installBtn')
  if (!btn) return

  btn.style.display = 'block'

  btn.addEventListener('click', async () => {
    btn.style.display = 'none'
    deferredPrompt?.prompt() // Show native prompt
    const choice = await deferredPrompt?.userChoice
    console.log('User choice:', choice?.outcome)
    deferredPrompt = null
  })
})

window.addEventListener('appinstalled', () => {
  console.debug('⚡️ installed')
})

// Build once at module load (or lazily on first call + cache)
const templateIndex = new Map()

function buildTemplateIndex() {
  for (const tpl of document.querySelectorAll('template')) {
    // data-nav-path lives on an element *inside* the template content,
    // not on the <template> itself
    const marked = tpl.content.querySelectorAll('[data-nav-path]')
    for (const el of marked) {
      const path = el.getAttribute('data-nav-path')
      if (path) templateIndex.set(path, tpl)
    }
  }
}

buildTemplateIndex()

export function queryTemplate(navPath) {
  if (!navPath) return document.getElementById('')

  return templateIndex.get(navPath) ?? document.getElementById(navPath)

  // return (
  //   Array.from(document.querySelectorAll('template')).find((t) => t.innerHTML.includes(`data-nav-path="${navPath}"`)) ?? document.getElementById(navPath ?? '')
  // )
}

export function modifyDOMbackwards(host) {
  const child = [...host.children()].at(0) // const host2 = queryHost(queryBody(host))

  if (host.component && ['NAVIGATION-STACK', 'NAVIGATION-SPLIT-VIEW'].includes(host.component.tagName)) {
    host.component.hidden = true

    child?.component?.remove()
  } else {
    host.component?.remove()
  }
}

const scratchTpl = document.createElement('template')

export function modifyDOMforwards(trigger, path, htmlorTpl, overwrite = true) {
  if (!(path instanceof NavigationPath)) throw new Error('invalid view')

  if (trigger?.hasAttribute('data-tag')) {
    const tag = document.querySelector(`#${trigger.dataset.tag}`)
    if (tag) tag.hidden = false
    return
  }

  const position = queryInsertPosition(path.component) //'afterend'
  const lookFor = 'beforebegin' === position ? 'previousElementSibling' : 'nextElementSibling'

  if (overwrite && ['CONTENT-VIEW', 'DIALOG'].includes(path.page?.[lookFor]?.tagName ?? '')) path.page?.[lookFor]?.remove()

  // if (!['CONTENT-VIEW', 'DIALOG'].includes(page[lookFor]?.tagName)) {
  let node

  if (htmlorTpl instanceof HTMLTemplateElement) {
    node = htmlorTpl.content.cloneNode(true).firstElementChild
  } else {
    scratchTpl.innerHTML = htmlorTpl // reused element, still parses the string once
    node = scratchTpl.content.firstElementChild
    scratchTpl.innerHTML = '' // release refs so cloned subtree isn't shared
  }

  path.page?.insertAdjacentElement(position, node)
  // if ('DIALOG' === scene[lookFor]?.tagName) scene[lookFor].showModal()
  // console.log(99, node.tagName, scene[lookFor]?.tagName)
  // lm.insertAdjacentHTML(position, ``)
  // if ('DIALOG' === lm[lookFor]?.tagName) lm[lookFor].showModal()
  // }
}

export const navHandler = async (evt) => {
  console.debug(`⚡️ ${evt?.type}`)

  for (const el of document.querySelectorAll('[data-nav-destination]')) {
    if (el.hasAttribute('selected-when'))
      el.ariaSelected = `${el
        .getAttribute('selected-when')
        ?.split(' ')
        .map((item) => Boolean(document.querySelector(`[data-nav-path="${CSS.escape(item)}"]`)))
        .some(Boolean)}`
    else el.ariaSelected = `${Boolean(document.querySelector(`[data-nav-path="${CSS.escape(el.dataset.navDestination ?? '')}"]`))}`
  }

  for (const el of document.querySelectorAll('button[data-tag]'))
    el.ariaSelected = `${Boolean(document.querySelector(`[id="${CSS.escape(el.dataset.tag ?? '')}"]:not([hidden])`))}`
}

lifecycleObserver.addEventListener('tabshow', navHandler)
lifecycleObserver.addEventListener('tabhide', navHandler)
lifecycleObserver.addEventListener('pageshow', navHandler)
lifecycleObserver.addEventListener('pagehide', navHandler)

document.addEventListener('tabroot', navHandler)
