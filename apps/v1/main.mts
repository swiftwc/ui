import { alert, confirmationDialog, lifecycleObserver, NavigationPath, queryInsertPosition, startViewTransition } from '../../packages/ui/js/client'

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

document.body.addEventListener('submit', async (evt: SubmitEvent) => {
  console.debug(`⚡️ ${evt?.type}`)

  if (!(evt.target instanceof HTMLElement)) return

  const form = evt.target.closest('[is=form-view]:not([is="tab-bar"] [is=form-view],[is="sidebar-view"] [is=form-view])')

  if (!form) return

  evt.preventDefault()

  const navDest = evt.submitter?.closest<HTMLElement>('button[data-nav-destination]')
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

  const navDest = evt.target.closest<HTMLElement>('button[type="button"][data-nav-destination],summary[data-nav-destination]')

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

      parent.component.inert = false
    }
  } else if (navDest) {
    const template = queryTemplate(navDest.dataset.navDestination) //?? document.getElementById(navDest.getAttribute('navigation-destination'))

    const path = new NavigationPath(evt.target)?.hydrate()

    if (evt.target.closest('.inplace')) {
      const parent = [...path.parents()].at(0)?.hydrate()

      modifyDOMforwards(undefined, parent, template)
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
        if (btn?.getAttribute('list')) el.setAttribute('list-style', btn.getAttribute('list')!)
        else el.removeAttribute('list-style')
      for (const el of btn?.closest('v-stack')?.querySelectorAll('[is=form-view]') ?? [])
        if (btn?.getAttribute('list')) el.setAttribute('form-style', btn.getAttribute('list')!)
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

    if (evt.target.closest('.fww')) {
      const path = new NavigationPath(evt.target)?.hydrate()

      const root = [path, ...path.parents()]
        .map((item) => item.component)
        .filter(Boolean)
        .at(-1)

      // const sv = closestBody(event.target),
      //   root = getRootViewController(sv),
      //   view = getComputedView(sv)
      // { page, host } = getComputedView(sv) //{ scene, frame } = queryFrameToolbars(sv),
      // position = queryInsertPosition(host)

      if (path.body)
        await startViewTransition(path.body, 'forwards', async () => {
          const svCount = root?.querySelectorAll('scroll-view').length

          modifyDOMforwards(
            evt.target?.closest('button'),
            path,
            `
                  <body-view>
                    <scroll-view>
                      <v-stack padding placement="leading fill">
                        <button type="button" class="bw">🔙</button>
                        <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                      </v-stack>
                    </scroll-view>
                    <body-view>
                      <scroll-view>
                        <v-stack padding placement="leading fill">
                          <button type="button" class="bw">🔙</button>
                          <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                        </v-stack>
                      </scroll-view>
                      <body-view>
                        <scroll-view>
                          <v-stack padding placement="leading fill">
                            <button type="button" class="bw">🔙</button>
                            <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                          </v-stack>
                        </scroll-view>
                        <body-view>
                          <scroll-view>
                            <v-stack padding placement="leading fill">
                              <button type="button" class="bw">🔙</button>
                              <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                            </v-stack>
                          </scroll-view>
                          <body-view>
                            <scroll-view>
                              <v-stack padding placement="leading fill">
                                <button type="button" class="bw">🔙</button>
                                <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                              </v-stack>
                            </scroll-view>
                            ${
                              evt.target.closest('.dlg')
                                ? `<dialog is="sheet-view">
                              <scroll-view>
                                <v-stack padding placement="leading fill">
                                  <button type="button" class="bw">🔙</button>
                                    <button type="button" class="bww">🔚</button>
                                    <button type="button" class="bww2">🔚 of modal</button>
                                  <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                                </v-stack>
                              </scroll-view>
                              <body-view>
                                <scroll-view>
                                  <v-stack padding placement="leading fill">
                                    <button type="button" class="bw">🔙</button>
                                    <button type="button" class="bww">🔚</button>
                                    <button type="button" class="bww2">🔚 of modal</button>
                                    <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                                  </v-stack>
                                </scroll-view>
                                <body-view>
                                  <scroll-view>
                                    <v-stack padding placement="leading fill">
                                      <button type="button" class="bw">🔙</button>
                                      <button type="button" class="bww">🔚</button>
                                      <button type="button" class="bww2">🔚 of modal</button>
                                      <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                                    </v-stack>
                                  </scroll-view>
                                  <body-view>
                                    <scroll-view>
                                      <v-stack padding placement="leading fill">
                                        <button type="button" class="bw">🔙</button>
                                        <button type="button" class="bww">🔚</button>
                                        <button type="button" class="bww2">🔚 of modal</button>
                                        <button type="button" class="fww">deep</button>
                                        <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                                      </v-stack>
                                    </scroll-view>
                                    <dialog is="sheet-view">
                                      <scroll-view>
                                        <v-stack padding placement="leading fill">
                                          <button type="button" class="bw">🔙</button>
                                          <button type="button" class="bww">🔚</button>
                                          <button type="button" class="bww2">🔚 of modal</button>
                                          <button type="button" class="fww">deep</button>
                                          <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                                        </v-stack>
                                      </scroll-view>
                                      <dialog is="sheet-view">
                                        <scroll-view>
                                          <v-stack padding placement="leading fill">
                                            <button type="button" class="bw">🔙</button>
                                            <button type="button" class="bww">🔚</button>
                                            <button type="button" class="bww2">🔚 of modal</button>
                                            <button type="button" class="fww">deep</button>
                                            <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                                          </v-stack>
                                        </scroll-view>
                                        <tool-bar>
                                          <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item>

                                          <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                                          <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view slot="label"><i slot="icon" class="ph ph-smiley"></i></label-view><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item></tool-bar-item-group>
                                          
                                          <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${svCount}</button></tool-bar-item>
                                          
                                          <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${svCount}</button></tool-bar-item></tool-bar-item-group>
                                          
                                          <tool-bar-item slot="bottom-bar-trailing"><input is="search-view" value="ssssss${svCount}"></tool-bar-item>
                                        </tool-bar>
                                      </dialog>
                                      <tool-bar>
                                        <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item>

                                        <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                                        <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view slot="label"><i slot="icon" class="ph ph-smiley"></i></label-view><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item></tool-bar-item-group>
                                        
                                        <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${svCount}</button></tool-bar-item>
                                        
                                        <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${svCount}</button></tool-bar-item></tool-bar-item-group>
                                        
                                        <tool-bar-item slot="bottom-bar-trailing"><input is="search-view" value="ssssss${svCount}"></tool-bar-item>
                                      </tool-bar>
                                    </dialog>
                                    <tool-bar>
                                      <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item>

                                      <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                                      <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view slot="label"><i slot="icon" class="ph ph-smiley"></i></label-view><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item></tool-bar-item-group>
                                      
                                      <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${svCount}</button></tool-bar-item>
                                      
                                      <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${svCount}</button></tool-bar-item></tool-bar-item-group>
                                      
                                      <tool-bar-item slot="bottom-bar-trailing"><input is="search-view" value="ssssss${svCount}"></tool-bar-item>
                                    </tool-bar>
                                  </body-view>
                                  <tool-bar>
                                    <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item>

                                    <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                                    <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view slot="label"><i slot="icon" class="ph ph-smiley"></i></label-view><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item></tool-bar-item-group>
                                    
                                    <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${svCount}</button></tool-bar-item>
                                    
                                    <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${svCount}</button></tool-bar-item></tool-bar-item-group>
                                    
                                    <tool-bar-item slot="bottom-bar-trailing"><input is="search-view" value="ssssss${svCount}"></tool-bar-item>
                                  </tool-bar>
                                </body-view>
                                <tool-bar>
                                  <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item>

                                  <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                                  <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view slot="label"><i slot="icon" class="ph ph-smiley"></i></label-view><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item></tool-bar-item-group>
                                  
                                  <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${svCount}</button></tool-bar-item>
                                  
                                  <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${svCount}</button></tool-bar-item></tool-bar-item-group>
                                  
                                  <tool-bar-item slot="bottom-bar-trailing"><input is="search-view" value="ssssss${svCount}"></tool-bar-item>
                                </tool-bar>
                              </body-view>
                              <tool-bar>
                                <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item>

                                <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                                <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view slot="label"><i slot="icon" class="ph ph-smiley"></i></label-view><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item></tool-bar-item-group>
                                
                                <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${svCount}</button></tool-bar-item>
                                
                                <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${svCount}</button></tool-bar-item></tool-bar-item-group>
                                
                                <tool-bar-item slot="bottom-bar-trailing"><input is="search-view" value="ssssss${svCount}"></tool-bar-item>
                              </tool-bar>
                            </dialog>`
                                : ''
                            }
                            <tool-bar>
                              <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item>

                              <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                              <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view slot="label"><i slot="icon" class="ph ph-smiley"></i></label-view><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item></tool-bar-item-group>
                              
                              <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${svCount}</button></tool-bar-item>
                              
                              <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${svCount}</button></tool-bar-item></tool-bar-item-group>
                              
                              <tool-bar-item slot="bottom-bar-trailing"><input is="search-view" value="ssssss${svCount}"></tool-bar-item>
                            </tool-bar>
                          </body-view>
                          <tool-bar>
                            <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item>

                            <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                            <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view slot="label"><i slot="icon" class="ph ph-smiley"></i></label-view><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item></tool-bar-item-group>
                            
                            <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${svCount}</button></tool-bar-item>
                            
                            <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${svCount}</button></tool-bar-item></tool-bar-item-group>
                            
                            <tool-bar-item slot="bottom-bar-trailing"><input is="search-view" value="ssssss${svCount}"></tool-bar-item>
                          </tool-bar>
                        </body-view>
                        <tool-bar>
                          <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item>

                          <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                          <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view slot="label"><i slot="icon" class="ph ph-smiley"></i></label-view><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item></tool-bar-item-group>
                          
                          <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${svCount}</button></tool-bar-item>
                          
                          <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${svCount}</button></tool-bar-item></tool-bar-item-group>
                          
                          <tool-bar-item slot="bottom-bar-trailing"><input is="search-view" value="ssssss${svCount}"></tool-bar-item>
                        </tool-bar>
                      </body-view>
                      <tool-bar>
                        <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item>

                        <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                        <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view slot="label"><i slot="icon" class="ph ph-smiley"></i></label-view><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item></tool-bar-item-group>
                        
                        <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${svCount}</button></tool-bar-item>
                        
                        <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${svCount}</button></tool-bar-item></tool-bar-item-group>
                        
                        <tool-bar-item slot="bottom-bar-trailing"><input is="search-view" value="ssssss${svCount}"></tool-bar-item>
                      </tool-bar>
                    </body-view>
                    <tool-bar>
                      <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item>

                      <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                      <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view slot="label"><i slot="icon" class="ph ph-smiley"></i></label-view><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item></tool-bar-item-group>
                      
                      <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${svCount}</button></tool-bar-item>
                      
                      <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${svCount}</button></tool-bar-item></tool-bar-item-group>
                      
                      <tool-bar-item slot="bottom-bar-trailing"><input is="search-view" value="ssssss${svCount}"></tool-bar-item>
                    </tool-bar>
                  </body-view>
                  `
          )
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

    const fwBtn = evt.target.closest<HTMLElement>('.fw')

    if (fwBtn) {
      const path = new NavigationPath(evt.target)?.hydrate()

      const controller = [path, ...path.parents()]
        .map((item) => item.component)
        .filter((item) => item?.matches('navigation-stack,navigation-split-view'))
        .at(0)

      // const sv = closestBody(event.target), //event.target.closest('scroll-view') ?? event.target.closest('tool-bar')?.previousElementSibling,
      //   root = getRootViewController(sv), //sv.closest('navigation-stack,navigation-split-view'),
      //   view = getComputedView(sv) //{ scene, frame } = queryFrameToolbars(sv),
      // position = queryInsertPosition(host) //'afterend'

      // scene = sv.parentElement?.matches('dialog[is=sidebar-view]') ? sv.parentElement : sv,
      // frame = scene.parentElement
      // console.log(99, lm, frame, queryFrameToolbars(sv).scene)
      await startViewTransition(evt.target, 'forwards', async () => {
        const tag =
          6 === controller?.querySelectorAll('scroll-view').length
            ? 'dialog'
            : 10 <= (controller?.querySelectorAll('scroll-view').length ?? 0)
              ? 'dialog'
              : 'body-view'

        modifyDOMforwards(
          fwBtn,
          path,
          `
                  <${'dialog' === tag ? `${tag} is="sheet-view"` : tag}>
                    <scroll-view>
                      <v-stack padding placement="leading fill">
                        <navigation-title value="dds"></navigation-title>
                        ${controller.id}section${
                          controller.querySelectorAll('scroll-view').length
                        }<button type="button" class="bw">🔙</button><button type="button" class="fw">→</button><p>...</p><p>...</p><button type="button" class="bww">🔚</button><form method="dialog"><button>close</button></form><p>...</p><input type="text" /><p>...</p>
                        
                        <menu-view tabindex="0"><label-view slot="label"><i slot="icon" class="ph ph-smiley"></i></label-view><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button></menu-view>
                        
                        <p>...</p>
                        
                        
                        <picker-view picker-style="menu" help="click me!">
                        <label-view slot="label"><image-view slot="icon" system-name="dots-three"></image-view><span>rtyty</span></label-view>
                        <option slot="list" value="rty0%"></option>
                        <option slot="list" value="rtyMinimum Tip"></option>
                        <option slot="list" value="rtyStandard"></option>
                        <option slot="list" value="rtyGenerous"></option>
                        <option slot="list" value="rtyVery Generous"></option>
                        </picker-view>
        
                        <picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view><!---->
                        
                        <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                      </v-stack>
                      <label-view slot="top-bar-principal"><span>ghjh${controller.querySelectorAll('scroll-view').length}</span></label-view>
                      <label-view slot="bottom-bar-principal"><span>ghjh${controller.querySelectorAll('scroll-view').length}</span></label-view>
                    </scroll-view>
                    <tool-bar>
                      <tool-bar-item tint="red" slot="top-bar-leading"><button type="button" tabindex="0"><label-view><image-view slot="icon" system-name="smiley"></image-view></label-view></button></tool-bar-item>

                      
                      <tool-bar-item tint="red" slot="top-bar-leading"><picker-view picker-style="menu" current-value-icon="smiley"><option value="0" label="00%" slot="list"></option><option value="10" label="0Minimum Tip" slot="list"></option><option value="20" label="0Standard" slot="list"></option><option value="30" label="0Generous" slot="list"></option><option value="50" label="0Very Generous" slot="list"></option></picker-view></tool-bar-item><!---->

                      <tool-bar-item tint="red" slot="top-bar-leading">
                      <menu-view tabindex="0" tint="red"><label-view slot="label"><i slot="icon" class="ph ph-smiley"></i></label-view><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button>
                      <details is="disclosure-group">
                        <summary><label-view><i slot="icon" class="ph ph-smiley"></i><span>Item 1</span></label-view></summary>
                        <button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i><span>Item 1</span></label-view></button>
                        <button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i><span>Item 1</span></label-view></button>
                        <button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i><span>Item 1</span></label-view></button>
                        <button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i><span>Item 1</span></label-view></button>
                        <button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i><span>Item 1</span></label-view></button>
                        <button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i><span>Item 1</span></label-view></button>
                      </details>
                      <button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button>
                      <menu-view tabindex="0" tint="red"><label-view slot="label"><i slot="icon" class="ph ph-smiley"></i></label-view><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><menu-view tabindex="0" tint="red"><label-view slot="label"><i slot="icon" class="ph ph-smiley"></i></label-view><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button></menu-view><button tabindex="0"><label-view><span>ddd</span></label-view></button></menu-view>
                      <button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button></menu-view>
                      </tool-bar-item>
                      <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0" disabled><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item>

                      <tool-bar-item-group tint="red" slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view slot="label"><i slot="icon" class="ph ph-smiley"></i></label-view><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><i slot="icon" class="ph ph-smiley"></i></label-view></button></tool-bar-item></tool-bar-item-group>
                      <tool-bar-item slot="top-bar-trailing"><input is="search-view" value="ssssss${controller.querySelectorAll('scroll-view').length}"></tool-bar-item>
                      <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0"><label-view><span>a${controller.querySelectorAll('scroll-view').length}</span></label-view></button></tool-bar-item>
                      <tool-bar-item slot="bottom-bar-leading">
                      <menu-view tabindex="0">
                      <label-view slot="label"><i slot="icon" class="ph ph-smiley"></i></label-view>
                      <button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button>
                      <section-view header="Section 1">
                      <button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button>
                      </section-view>
                      <button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button><button tabindex="0"><label-view><span>ddd</span></label-view></button>
                      </menu-view>
                      </tool-bar-item>
                      <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${controller.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                      <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${controller.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                      <tool-bar-item slot="bottom-bar-trailing"><input is="search-view" value="ssssss${controller.querySelectorAll('scroll-view').length}"></tool-bar-item>
                      <!---->
                    </tool-bar>
                  </${tag}>
                  `
        )
      })
      // document.startViewTransition({
      //   async update() {
      //     startViewTransition(event, false)
      //   },
      //   types: ['forwards'],
      // })
    }
  }

  // safari-only polyfill
  // for(const el of [...document.querySelectorAll('scroll-view')]) el.hidden = el.matches(
  //     `navigation-stack:has(> body-view) > scroll-view,
  //      dialog:has(> body-view) > scroll-view,
  //      body-view:has(> body-view) > scroll-view`
  //   );

  // console.log(999, getComputedStyle(event.target.closest('navigation-stack,body-view')).display)

  if (evt.target.id === 'btn2') {
    // alert(99)
    evt.target.closest('body-view')?.remove()
  }

  // alert(event.target.hidden)

  // document.querySelector('ui-label').hidden= !document.querySelector('ui-label').hidden
})

// document.querySelector('.gg').addEventListener('click', event => {
//     console.log(555)
// })

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(() => console.debug('⚡️ registered'))
    .catch(console.error)
}

let deferredPrompt

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome from showing the default prompt
  e.preventDefault()
  deferredPrompt = e

  // Show your custom install UI
  const btn = document.querySelector('#installBtn')
  btn.style.display = 'block'

  btn.addEventListener('click', async () => {
    btn.style.display = 'none'
    deferredPrompt.prompt() // Show native prompt
    const choice = await deferredPrompt.userChoice
    console.log('User choice:', choice.outcome)
    deferredPrompt = null
  })
})

window.addEventListener('appinstalled', () => {
  console.debug('⚡️ installed')
})

// Build once at module load (or lazily on first call + cache)
const templateIndex = new Map<string, HTMLTemplateElement>()

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

export function queryTemplate(navPath?: string) {
  if (!navPath) return document.getElementById('')

  return templateIndex.get(navPath) ?? document.getElementById(navPath)

  // return (
  //   Array.from(document.querySelectorAll('template')).find((t) => t.innerHTML.includes(`data-nav-path="${navPath}"`)) ?? document.getElementById(navPath ?? '')
  // )
}

export function modifyDOMbackwards(host: NavigationPath) {
  const child = [...host.children()].at(0) // const host2 = queryHost(queryBody(host))

  if (['NAVIGATION-STACK', 'NAVIGATION-SPLIT-VIEW'].includes(host.component.tagName)) {
    host.component.hidden = true

    child?.component?.remove()
  } else {
    host.component?.remove()
  }
}

const scratchTpl = document.createElement('template')

export function modifyDOMforwards(trigger: HTMLElement | undefined, path: NavigationPath, htmlorTpl: HTMLTemplateElement | string, overwrite: boolean = true) {
  if (!(path instanceof NavigationPath)) throw new Error('invalid view')

  if (trigger?.hasAttribute('data-tag')) {
    const tag = document.querySelector<HTMLElement>(`#${trigger.dataset.tag}`)
    if (tag) tag.hidden = false
    return
  }

  const position = queryInsertPosition(path.component) //'afterend'
  const lookFor = 'beforebegin' === position ? 'previousElementSibling' : 'nextElementSibling'

  if (overwrite && ['BODY-VIEW', 'DIALOG'].includes(path.page[lookFor]?.tagName)) path.page[lookFor].remove()

  // if (!['BODY-VIEW', 'DIALOG'].includes(page[lookFor]?.tagName)) {
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

export const navHandler = async (evt: Event) => {
  console.debug(`⚡️ ${evt?.type}`)

  for (const el of document.querySelectorAll<HTMLElement>('[data-nav-destination]')) {
    if (el.hasAttribute('selected-when'))
      el.ariaSelected = `${el
        .getAttribute('selected-when')
        ?.split(' ')
        .map((item) => Boolean(document.querySelector(`[data-nav-path="${CSS.escape(item)}"]`)))
        .some(Boolean)}`
    else el.ariaSelected = `${Boolean(document.querySelector(`[data-nav-path="${CSS.escape(el.dataset.navDestination ?? '')}"]`))}`
  }

  for (const el of document.querySelectorAll<HTMLButtonElement>('button[data-tag]'))
    el.ariaSelected = `${Boolean(document.querySelector(`[id="${CSS.escape(el.dataset.tag ?? '')}"]:not([hidden])`))}`
}

lifecycleObserver.addEventListener('tabshow', navHandler)
lifecycleObserver.addEventListener('tabhide', navHandler)
lifecycleObserver.addEventListener('pageshow', navHandler)
lifecycleObserver.addEventListener('pagehide', navHandler)

document.addEventListener('tabroot', navHandler)
