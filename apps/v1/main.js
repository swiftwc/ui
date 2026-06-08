import { alert, confirmationDialog, lifecycleObserver, NavigationPath, startViewTransition } from '../../packages/ui/js/client'

function queryInsertPosition(frame) {
  //?: Components.BodyView | Components.SheetView) {
  if (frame?.tagName === 'NAVIGATION-SPLIT-VIEW')
    return 'beforebegin' // lookFor = 'previousElementSibling'
  else if (
    frame?.parentElement?.tagName === 'NAVIGATION-SPLIT-VIEW' &&
    frame?.parentElement.querySelector(':scope > [is=sidebar-view]') &&
    frame?.tagName === 'BODY-VIEW'
  )
    return 'beforebegin' // lookFor = 'previousElementSibling'

  return 'afterend' // lookFor = 'nextElementSibling'
}

document.addEventListener('commit', async (event) => {
  console.log('commit!!!', event.detail, event.target)

  // alert(event.detail)
})
document.addEventListener('selection', async (event) => {
  console.log('selection!!!', event.detail, event.target)

  if (event.detail.selection) console.log(event.detail.selection)
})

const toggleHandler = async (event) => {
  console.debug(`⚡️ ${event?.type}`)

  if ('closed' !== event.newState) return

  if (!event.target.querySelector('[aria-selected=true]:not(summary)')) return

  const path = new NavigationPath(event.target)?.hydrate()

  const from1 = [...path.children()].at(0)

  await startViewTransition(from1.body, 'backwards', async () => {
    modifyDOMbackwards(from1)
  })
}

const addBindings = () => {
  for (const el of document.querySelectorAll('details.rootonclose')) {
    el.removeEventListener('toggle', toggleHandler)
    el.addEventListener('toggle', toggleHandler)
  }
}

document.body.addEventListener('submit', async (event) => {
  console.debug(`⚡️ ${event?.type}`)

  const form = event.target.closest('[is=form-view]:not([is="tab-bar"] [is=form-view],[is="sidebar-view"] [is=form-view])')

  if (!form) return

  event.preventDefault()

  const navDest = event.submitter.closest('button[navigation-destination]')
  if (navDest) {
    const template = queryTemplate(navDest.getAttribute('navigation-destination')) //?? document.getElementById(navDest.getAttribute('navigation-destination'))

    const path = new NavigationPath(event.submitter)?.hydrate()

    if (event.submitter.closest('.inplace')) {
      const parent = [...path.parents()].at(0)?.hydrate()

      modifyDOMforwards(undefined, parent, template)
    } else {
      await startViewTransition(event.submitter, 'forwards', async () => {
        modifyDOMforwards(undefined, path, template)
      })
    }
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
document.body.addEventListener('click', async (event) => {
  console.debug(`⚡️ ${event?.type}`)

  const navDest = event.target.closest('button[type="button"][navigation-destination],summary[navigation-destination]')

  if (event.target.closest('.back')) {
    if (event.target.closest('.back-confirmation')) {
      const confirm = await confirmationDialog(
        event.target,
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
    const path = new NavigationPath(event.target)?.hydrate()

    const parent = [...path.parents()].at(0)?.hydrate()

    if (navDest && parent.body) parent.component.inert = true

    await startViewTransition(event.target, 'backwards', async () => {
      modifyDOMbackwards(path)
    })

    if (navDest && parent.body) {
      await startViewTransition(parent.body, 'forwards', async () => {
        modifyDOMforwards(undefined, parent, queryTemplate(navDest.getAttribute('navigation-destination')))
      })

      addBindings()

      parent.component.inert = false
    }
  } else if (navDest) {
    const template = queryTemplate(navDest.getAttribute('navigation-destination')) //?? document.getElementById(navDest.getAttribute('navigation-destination'))

    const path = new NavigationPath(event.target)?.hydrate()

    if (event.target.closest('.inplace')) {
      const parent = [...path.parents()].at(0)?.hydrate()

      modifyDOMforwards(undefined, parent, template)
    } else {
      const summary = event.target.closest('summary:has(button)')

      if (summary) {
        event.preventDefault()

        if (event.target.closest('button')) return summary.closest('details').toggleAttribute('open')
      }

      await startViewTransition(event.target, 'forwards', async () => {
        modifyDOMforwards(undefined, path, template)
      })
    }

    addBindings()
  }

  if (event.target.closest('button')) {
    if (event.target.closest('.alert')) {
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
    } else if (event.target.closest('.alert2')) {
      void alert()
    }
    if (event.target.closest('.backtocontroller')) {
      const path = new NavigationPath(event.target)?.hydrate()

      const parent = [...path.parents()].at(-2)?.hydrate()

      await startViewTransition(parent.body, 'backwards', async () => {
        modifyDOMbackwards(parent)
      })

      return
    }

    if (event.target.closest('.make-list')) {
      const btn = event.target.closest('.make-list')
      for (const el of btn.closest('v-stack').querySelectorAll('list-view'))
        if (btn.getAttribute('list')) el.setAttribute('list-style', btn.getAttribute('list'))
        else el.removeAttribute('list-style')
      for (const el of btn.closest('v-stack').querySelectorAll('[is=form-view]'))
        if (btn.getAttribute('list')) el.setAttribute('form-style', btn.getAttribute('list'))
        else el.removeAttribute('form-style')
    }

    if (event.target.closest('.bww')) {
      const path = new NavigationPath(event.target)?.hydrate()

      const parent = [...path.parents()].at(-2)

      // const sv = queryBodyAll(getRootViewController(event.target)).at(1),
      //   // closestBody(
      //   //     queryBodyAll(document).at(1) //[...document.querySelectorAll('scroll-view:not(navigation-stack[hidden] scroll-view,navigation-split-view[hidden] scroll-view)')][1]
      //   //   ),
      //   host = closestHost(sv) //queryFrameToolbars(sv).scene.parentElement

      await startViewTransition(parent.body, 'backwards', async () => {
        modifyDOMbackwards(parent)
      })
    } else if (event.target.closest('.bww2')) {
      // const sv = queryBodyAll(event.target.closest('dialog')).at(1), //[...event.target.closest('dialog').querySelectorAll('scroll-view')][1],
      //   host = closestHost(sv) //queryFrameToolbars(sv).scene.parentElement

      const path = new NavigationPath(event.target)?.hydrate()

      const parent = [...path.parents()]
        .filter((item) => item.component.matches('dialog>:scope'))
        .at(0)
        ?.hydrate()

      await startViewTransition(parent.body, 'backwards', async () => {
        modifyDOMbackwards(parent)
      })
    }

    if (event.target.closest('.fww')) {
      const path = new NavigationPath(event.target)?.hydrate()

      const root = [path, ...path.parents()]
        .map((item) => item.component)
        .filter(Boolean)
        .at(-1)

      // const sv = closestBody(event.target),
      //   root = getRootViewController(sv),
      //   view = getComputedView(sv)
      // { page, host } = getComputedView(sv) //{ scene, frame } = queryFrameToolbars(sv),
      // position = queryInsertPosition(host)

      await startViewTransition(path.body, 'forwards', async () => {
        modifyDOMforwards(
          event.target.closest('button'),
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
                              event.target.closest('.dlg')
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
                                          <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                                          <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                                          <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view system-image="smiley" slot="label"></label-view><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                                          
                                          <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                                          
                                          <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                                          
                                          <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                                        </tool-bar>
                                      </dialog>
                                      <tool-bar>
                                        <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                                        <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                                        <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view system-image="smiley" slot="label"></label-view><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                                        
                                        <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                                        
                                        <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                                        
                                        <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                                      </tool-bar>
                                    </dialog>
                                    <tool-bar>
                                      <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                                      <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                                      <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view system-image="smiley" slot="label"></label-view><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                                      
                                      <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                                      
                                      <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                                      
                                      <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                                    </tool-bar>
                                  </body-view>
                                  <tool-bar>
                                    <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                                    <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                                    <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view system-image="smiley" slot="label"></label-view><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                                    
                                    <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                                    
                                    <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                                    
                                    <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                                  </tool-bar>
                                </body-view>
                                <tool-bar>
                                  <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                                  <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                                  <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view system-image="smiley" slot="label"></label-view><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                                  
                                  <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                                  
                                  <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                                  
                                  <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                                </tool-bar>
                              </body-view>
                              <tool-bar>
                                <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                                <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                                <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view system-image="smiley" slot="label"></label-view><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                                
                                <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                                
                                <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                                
                                <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                              </tool-bar>
                            </dialog>`
                                : ''
                            }
                            <tool-bar>
                              <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                              <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                              <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view system-image="smiley" slot="label"></label-view><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                              
                              <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                              
                              <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                              
                              <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                            </tool-bar>
                          </body-view>
                          <tool-bar>
                            <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                            <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                            <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view system-image="smiley" slot="label"></label-view><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                            
                            <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                            
                            <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                            
                            <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                          </tool-bar>
                        </body-view>
                        <tool-bar>
                          <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                          <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                          <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view system-image="smiley" slot="label"></label-view><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                          
                          <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                          
                          <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                          
                          <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                        </tool-bar>
                      </body-view>
                      <tool-bar>
                        <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                        <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                        <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view system-image="smiley" slot="label"></label-view><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                        
                        <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                        
                        <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                        
                        <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                      </tool-bar>
                    </body-view>
                    <tool-bar>
                      <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                      <tool-bar-item slot="top-bar-leading"><picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view></tool-bar-item>

                      <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view system-image="smiley" slot="label"></label-view><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                      
                      <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                      
                      <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                      
                      <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                    </tool-bar>
                  </body-view>
                  `
        )
      })
    }

    if (event.target.closest('.bw')) {
      // const sv = closestBody(event.target), //event.target.closest('scroll-view') ?? event.target.closest('tool-bar')?.previousElementSibling,
      //   pr = closestHost(sv) //queryFrameToolbars(sv).scene.parentElement //sv.parentElement

      // const { host } = getComputedView(closestBody(event.target))
      const path = new NavigationPath(event.target)?.hydrate()

      await startViewTransition(event.target, 'backwards', async () => {
        modifyDOMbackwards(path)
      })
    }

    const fwBtn = event.target.closest('.fw')

    if (fwBtn) {
      const path = new NavigationPath(event.target)?.hydrate()

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
      await startViewTransition(event.target, 'forwards', async () => {
        const tag =
          6 === controller.querySelectorAll('scroll-view').length ? 'dialog' : 10 <= controller.querySelectorAll('scroll-view').length ? 'dialog' : 'body-view'

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
                        }<button type="button" class="bw">🔙</button><button type="button" class="fw">→</button><p>...</p><p>...</p><button type="button" class="bww">🔚</button><form method="dialog"><button>close</button></form><p>...</p><input type="text" /><p>...</p><menu-view tabindex="0"><label-view system-image="smiley" slot="label"></label-view><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button></menu-view><p>...</p>
                        
                        <picker-view picker-style="menu">
                        <label-view slot="label" system-image="dots-three" title="rtyty"></label-view>
                        <label-view slot="tag" title="rty0%"></label-view>
                        <label-view slot="tag" title="rtyMinimum Tip"></label-view>
                        <label-view slot="tag" title="rtyStandard"></label-view>
                        <label-view slot="tag" title="rtyGenerous"></label-view>
                        <label-view slot="tag" title="rtyVery Generous"></label-view>
                        </picker-view>
        
        <picker-view picker-style="menu"><option slot="list" value="0" label="0%"></option><option slot="list" value="10" label="Minimum Tip"></option><option slot="list" value="20" label="Standard"></option><option slot="list" value="30" label="Generous"></option><option slot="list" value="50" label="Very Generous"></option></picker-view>
        
        <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                      </v-stack>
                      <label-view slot="top-bar-principal" title="ghjh${controller.querySelectorAll('scroll-view').length}"></label-view>
                      <label-view slot="bottom-bar-principal" title="ghjh${controller.querySelectorAll('scroll-view').length}"></label-view>
                    </scroll-view>
                    <tool-bar>
                      <tool-bar-item tint="red" slot="top-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                      <tool-bar-item tint="red" slot="top-bar-leading"><picker-view picker-style="menu"><option value="0" label="00%" slot="list"></option><option value="10" label="0Minimum Tip" slot="list"></option><option value="20" label="0Standard" slot="list"></option><option value="30" label="0Generous" slot="list"></option><option value="50" label="0Very Generous" slot="list"></option></picker-view></tool-bar-item>

                      <tool-bar-item tint="red" slot="top-bar-leading">
                      <menu-view tabindex="0" tint="red"><label-view system-image="smiley" slot="label"></label-view><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button>
                      <details is="disclosure-group">
              <summary><label-view system-image="smiley" title="Item 1"></label-view></summary>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" title="Item 1"></label-view></button>
            </details>
            <button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button>
            <menu-view tabindex="0" tint="red"><label-view system-image="smiley" slot="label"></label-view><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><menu-view tabindex="0" tint="red"><label-view system-image="smiley" slot="label"></label-view><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button></menu-view><button tabindex="0"><label-view title="ddd"></label-view></button></menu-view>
            <button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button></menu-view>
            </tool-bar-item>
                      <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0" disabled><label-view system-image="smiley"></label-view></button></tool-bar-item>

                      <tool-bar-item-group tint="red" slot="top-bar-leading"><tool-bar-item><menu-view tabindex="0"><label-view system-image="smiley" slot="label"></label-view><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                      <tool-bar-item slot="top-bar-trailing"><input type="search" value="ssssss${controller.querySelectorAll('scroll-view').length}"></tool-bar-item>
                      <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0"><label-view title="a${controller.querySelectorAll('scroll-view').length}"></label-view></button></tool-bar-item>
                      <tool-bar-item slot="bottom-bar-leading">
                      <menu-view tabindex="0">
                      <label-view system-image="smiley" slot="label"></label-view>
                      <button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button>
                      <section-view header="Section 1">
                      <button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button>
                      </section-view>
                      <button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button><button tabindex="0"><label-view title="ddd"></label-view></button>
                      </menu-view>
                      </tool-bar-item>
                      <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${controller.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                      <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${controller.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                      <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${controller.querySelectorAll('scroll-view').length}"></tool-bar-item>
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

  if (event.target.id === 'btn2') {
    // alert(99)
    event.target.closest('body-view').remove()
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

export function queryTemplate(navPath) {
  return (
    Array.from(document.querySelectorAll('template')).find((t) => t.innerHTML.includes(`navigation-path="${CSS.escape(navPath)}"`)) ??
    document.getElementById(navPath)
  )
}

export function modifyDOMbackwards(host) {
  const child = [...host.children()].at(0) // const host2 = queryHost(queryBody(host))

  if (['NAVIGATION-STACK', 'NAVIGATION-SPLIT-VIEW'].includes(host.component.tagName)) {
    host.component.hidden = true

    child?.component?.remove()
  } else {
    host.component.remove()
  }
}

export function modifyDOMforwards(trigger, path, htmlorTpl, overwrite = true) {
  if (!(path instanceof NavigationPath)) throw new Error('invalid view')
  // const root = getRootViewController(body), //sv.closest('navigation-stack,navigation-split-view'),
  // const view = getComputedView(body) //{ scene, frame } = queryFrameToolbars(sv),
  // const { page, component } = path
  // const escapeHTMLPolicy = trustedTypes.createPolicy('myEscapePolicy', {
  //   createHTML: (string) => string.replace(/</g, '&lt;'),
  // })
  if (trigger?.hasAttribute('data-tag')) {
    document.querySelector(`#${trigger.getAttribute('data-tag')}`).hidden = false
  } else {
    // if (frame.tagName === 'NAVIGATION-SPLIT-VIEW') {
    //   position = 'beforebegin'
    //   lookFor = 'previousElementSibling'
    // } else if (
    //   frame.parentElement.tagName === 'NAVIGATION-SPLIT-VIEW' &&
    //   frame.parentElement.querySelector(':scope > [is=sidebar-view]') &&
    //   frame.tagName === 'BODY-VIEW'
    // ) {
    //   position = 'beforebegin'
    //   lookFor = 'previousElementSibling'
    // }
    const position = queryInsertPosition(path.component) //'afterend'
    const lookFor = 'beforebegin' === position ? 'previousElementSibling' : 'nextElementSibling'

    if (overwrite) if (['BODY-VIEW', 'DIALOG'].includes(path.page[lookFor]?.tagName)) path.page[lookFor].remove()

    // if (!['BODY-VIEW', 'DIALOG'].includes(page[lookFor]?.tagName)) {
    let node

    if (htmlorTpl instanceof HTMLTemplateElement) {
      node = htmlorTpl.content.cloneNode(true).firstElementChild
    } else {
      const tpl = document.createElement('template')
      tpl.innerHTML = htmlorTpl
      node = tpl.content.firstElementChild
    }

    path.page.insertAdjacentElement(position, node)
    // if ('DIALOG' === scene[lookFor]?.tagName) scene[lookFor].showModal()
    // console.log(99, node.tagName, scene[lookFor]?.tagName)
    // lm.insertAdjacentHTML(position, ``)
    // if ('DIALOG' === lm[lookFor]?.tagName) lm[lookFor].showModal()
    // }
  }
}

export const navHandler = async (event) => {
  console.debug(`⚡️ ${event?.type}`)

  for (const el of document.querySelectorAll('[navigation-destination]')) {
    if (el.hasAttribute('selected-when'))
      el.ariaSelected = el
        .getAttribute('selected-when')
        .split(' ')
        .map((item) => Boolean(document.querySelector(`[navigation-path="${CSS.escape(item)}"]`)))
        .some(Boolean)
    else el.ariaSelected = `${Boolean(document.querySelector(`[navigation-path="${CSS.escape(el.getAttribute('navigation-destination'))}"]`))}`
  }

  for (const el of document.querySelectorAll('button[data-tag]'))
    el.ariaSelected = `${Boolean(document.querySelector(`[id="${CSS.escape(el.getAttribute('data-tag'))}"]:not([hidden])`))}`
}

lifecycleObserver.addEventListener('tabshow', navHandler)
lifecycleObserver.addEventListener('tabhide', navHandler)
lifecycleObserver.addEventListener('pageshow', navHandler)
lifecycleObserver.addEventListener('pagehide', navHandler)
