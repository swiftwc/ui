import * as Components from '../components'
import { kebabCase } from '../internal/utils'
import { Snapshot } from '../internal/snapshot'
import { type WebComponentCtor } from '../internal/class'

export const polyfills: Map<string, WebComponentCtor> = new Map()

for (const [k, v] of Object.entries(Components)) {
  const is = kebabCase(k)

  if (
    'polyfillExtends' in v &&
    'string' === typeof (v as any).polyfillExtends
  ) {
    customElements.define(is, v, { extends: v.polyfillExtends })

    if (!(document.createElement(v.polyfillExtends, { is }) instanceof v))
      polyfills.set(is, v)

    continue
  }

  customElements.define(is, v)
}

console.debug(polyfills)

if (0 < polyfills.size) {
  const polyfillTagNamesCache = new Set(
    [...polyfills.values()]
      .map((v) => String(v.polyfillExtends ?? '').toUpperCase())
      .filter(Boolean)
  )

  for (const [is, polyfill] of polyfills)
    for (const el of document.querySelectorAll<HTMLElement>(
      `${polyfill.polyfillExtends}[is="${is}"]`
    ))
      polyfill.polyfill(el, true)

  // observer callback
  const observer = new MutationObserver((mutations) => {
    for (const { addedNodes, removedNodes } of mutations) {
      for (const node of addedNodes) {
        if (!(node instanceof HTMLElement)) continue

        if (!polyfillTagNamesCache.has(node.tagName)) continue

        const is = node?.getAttribute('is') ?? ''

        if (!polyfills.has(is)) continue

        polyfills.get(is)?.polyfill(node, true)
      }

      for (const node of removedNodes) {
        if (!(node instanceof HTMLElement)) continue

        if (!polyfillTagNamesCache.has(node.tagName)) continue

        const is = node?.getAttribute('is') ?? ''

        if (!polyfills.has(is)) continue

        polyfills.get(is)?.polyfill(node, false)
      }
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

const cleanup = (lm?: Element, dir?: 'backwards' | 'forwards') => {
  let arr: string[] = [
    Snapshot.config!['vt-fwd-class-name'],
    'fwdd',
    'fwn',
    'fwnn',
    'bwd',
    'bwdd',
    'bwn',
    'bwnn',
  ]

  if (['backwards', 'forwards'].includes(dir ?? ''))
    for (let i = arr.length - 1; i >= 0; i--)
      if (arr[i].startsWith('backwards' === dir ? 'fw' : 'bw')) arr.splice(i, 1)

  for (const el of [
    ...(lm?.querySelectorAll(arr.map((v) => `.${v}`).join(',')) ?? []),
  ])
    el.classList.remove(...arr)
}

export const updateTheDOMSomehow = async (
  event: Event,
  type = 'forwards',
  updateCallback = async () => {}
) => {
  const from =
    (event.target as HTMLElement).closest<Components.ScrollView>(
      'scroll-view'
    ) ?? undefined

  if ('forwards' === type) {
    // const sis = Router.toolbarItems //sv.parentElement.querySelectorAll(`:scope > navigation-bar > toolbar-item,:scope > bottom-bar > toolbar-item`)
    // pr = Router.frame //sv.parentElement
    // const pt = event.target.closest('navigation-stack,body-view')
    // const inte = event.target.closest(".fwd");
    // const st = sv.scrollTop
    // console.log(333, lm, sv, sis)
    // let to

    // inject or unhide
    // if (pr.tagName === 'NAVIGATION-STACK' && 'more' === pr.getAttribute('is')) {
    //   to = document.querySelector(`#${event.target.getAttribute('tag')}`)
    // to.hidden = false
    // } else {
    await updateCallback()
    //   to = sv.nextElementSibling //pr.lastElementChild //sv.nextElementSibling
    // }

    Snapshot.getSnapshot(from)

    const fromToolbars = Snapshot.toolbarItems

    const to = Snapshot.leaf,
      toFrame = Snapshot.leafContainer,
      toToolbars = Snapshot.leafToolbarItems

    if ('DIALOG' === toFrame?.tagName) {
      ;(toFrame as HTMLDialogElement).showModal()
      console.debug(`⚡️ view-transition-start (${type})`)
      await Promise.allSettled(
        toFrame.getAnimations().map(({ finished }) => finished)
      )
      console.debug(`⚡️ view-transition-end (${type})`)
      return
    }

    // purge
    cleanup(Snapshot.rootLandmark, 'backwards')

    for (const ti of toToolbars ?? []) ti.classList.add('fwnn')

    to?.classList.add('fwdd')

    // prepare principal/leader
    from?.classList.add(Snapshot.config!['vt-fwd-class-name'])
    for (const ti of fromToolbars ?? []) ti.classList.add('fwn') // prepare navbs

    // sv.inert = true

    // if (!document.startViewTransition) {
    //   updateTheDOMSomehow(event, false)
    //   return
    // }
    // With a transition:
    // const transition = document.startViewTransition({
    //   async update() {},
    //   types: ['forwards'],
    // })

    // console.debug(transition)

    // await transition.finished
    // alert(3)

    // return

    console.debug(`⚡️ view-transition-start (${type})`)

    await Promise.allSettled([
      ...(from?.getAnimations().map(({ finished }) => finished) ?? []),
      ...(to?.getAnimations().map(({ finished }) => finished) ?? []),
    ])
    // await Promise.allSettled(
    //   from.getAnimations().map(({ finished }) => finished)
    // )

    console.debug(`⚡️ view-transition-end (${type})`)

    // console.log(9, to.querySelectorAll('.fwd'))

    // sv2.classList.remove("fwdd");

    if (
      0 <
      (
        toFrame?.querySelectorAll(
          `.${Snapshot.config?.['vt-fwd-class-name']},.bwd`
        ) ?? []
      ).length
    )
      return

    cleanup(Snapshot.rootLandmark)
  } else {
    Snapshot.getSnapshot(from)

    const fromToolbars = Snapshot.toolbarItems,
      fromFrame = Snapshot.container //sv.parentElement.querySelectorAll(`:scope > navigation-bar > toolbar-item,:scope > bottom-bar > toolbar-item`)
    // fromFrame = Router.frame //sv.parentElement

    // const pt = event.target.closest('navigation-stack,body-view')

    // const pt = pt0.parentElement.closest('navigation-stack,body-view')

    const to = Snapshot.parent, //pr.parentElement.querySelector(`:scope > scroll-view`) //pr.previousElementSibling
      toFrame = Snapshot.parentContainer,
      toToolbars = Snapshot.parentToolbarItems //sv2.parentElement?.querySelectorAll?.(      `:scope > navigation-bar > toolbar-item,:scope > bottom-bar > toolbar-item`    )

    // const st2 = sv2.scrollTop

    if ('DIALOG' === fromFrame?.tagName) {
      ;(fromFrame as HTMLDialogElement).close()
      console.debug(`⚡️ view-transition-start (${type})`)
      await Promise.allSettled(
        fromFrame.getAnimations().map(({ finished }) => finished)
      )
      console.debug(`⚡️ view-transition-end (${type})`)
      if (fromFrame.matches('[open]')) return
      await updateCallback()
      return
    }

    // purge
    cleanup(Snapshot.rootLandmark, 'forwards')

    // prepare others
    for (const ti of toToolbars ?? []) ti.classList.add('bwnn')
    to?.classList.add('bwdd')

    // sv2.style.visibility = "visible";

    // prepare leader/principal (tracked)
    for (const ti of fromToolbars ?? []) ti.classList.add('bwn')
    from?.classList.add('bwd')
    // pr.inert = true

    console.debug(`⚡️ view-transition-start (${type})`)

    await Promise.allSettled([
      ...(from?.getAnimations().map(({ finished }) => finished) ?? []),
      ...(to?.getAnimations().map(({ finished }) => finished) ?? []),
    ])
    // await Promise.allSettled(
    //   from.getAnimations().map(({ finished }) => finished)
    // )
    // await Promise.allSettled(to.getAnimations().map(({ finished }) => finished))

    console.debug(`⚡️ view-transition-end (${type})`)

    // console.log(999, sv2.closest('.fwd'))
    if (to?.closest(`.bwd,.${Snapshot.config?.['vt-fwd-class-name']}`)) return

    cleanup(Snapshot.rootLandmark)

    // remove or hide
    await updateCallback()
  }
}

void Snapshot.setOwnConfig()

export { Snapshot }
