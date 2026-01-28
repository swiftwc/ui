// import { UILabel } from './js/components'
// console.log(444, UILabel)
// import { Snapshot, polyfills, startViewTransition } from '../../packages/ui/generated/client' //'./js/client'
import { startViewTransition } from '../../packages/ui/js/client'

document.body.addEventListener('click', async (event) => {
  console.debug(`⚡️ click`)

  if (event.target.tagName === 'BUTTON') {
    if (event.target.classList.contains('bw')) {
      const sv = event.target.closest('scroll-view'),
        pr = sv.parentElement
      await startViewTransition(event, 'backwards', async () => {
        if (['NAVIGATION-STACK', 'NAVIGATION-SPLIT-VIEW'].includes(pr.tagName)) {
          pr.hidden = true
        } else {
          pr.remove()
        }
      })
    }

    if (event.target.classList.contains('fw')) {
      const sv = event.target.closest('scroll-view'),
        root = sv.closest('navigation-stack,navigation-split-view'),
        lm = sv.parentElement?.matches('dialog[is=sidebar-view]') ? sv.parentElement : sv,
        frame = lm.parentElement
      await startViewTransition(event, 'forwards', async () => {
        // const escapeHTMLPolicy = trustedTypes.createPolicy('myEscapePolicy', {
        //   createHTML: (string) => string.replace(/</g, '&lt;'),
        // })
        if (event.target.hasAttribute('tag')) {
          document.querySelector(`#${event.target.getAttribute('tag')}`).hidden = false
        } else {
          let position = 'afterend'
          let lookFor = 'nextElementSibling'

          if (frame.tagName === 'NAVIGATION-SPLIT-VIEW') {
            position = 'beforebegin'
            lookFor = 'previousElementSibling'
          } else if (
            frame.parentElement.tagName === 'NAVIGATION-SPLIT-VIEW' &&
            frame.parentElement.querySelector(':scope > [is=sidebar-view]') &&
            frame.tagName === 'BODY-VIEW'
          ) {
            position = 'beforebegin'
            lookFor = 'previousElementSibling'
          }

          if (!['BODY-VIEW', 'DIALOG'].includes(lm[lookFor]?.tagName)) {
            lm.insertAdjacentHTML(
              position,
              `
                  <${6 === root.querySelectorAll('scroll-view').length ? 'dialog is="sheet-view"' : 'body-view'}>
                    <scroll-view>
                      <v-stack>
                        ${root.id}section${
                          root.querySelectorAll('scroll-view').length
                        }<button type="button" class="bw">...</button><button type="button" class="fw">...</button><p>...</p><p>...</p><form method="dialog"><button>close</button></form><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                      </v-stack>
                      <label-view slot="navigation-bar-principal">ghjh${root.querySelectorAll('scroll-view').length}</label-view>
                      <label-view slot="bottom-bar-principal">ghjh${root.querySelectorAll('scroll-view').length}</label-view>
                    </scroll-view>
                    <tool-bar>
                      <tool-bar-item slot="navigation-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>
                      <tool-bar-item slot="navigation-bar-leading"><button type="button" tabindex="0" disabled><label-view system-image="smiley"></label-view></button></tool-bar-item>
                      <tool-bar-item-group slot="navigation-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                      <tool-bar-item slot="navigation-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                      <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0"><label-view label="a${root.querySelectorAll('scroll-view').length}"/></button></tool-bar-item>
                      <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                      <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                      <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                    </tool-bar>
                  </${6 === root.querySelectorAll('scroll-view').length ? 'dialog' : 'body-view'}>
                  `
            )
            if ('DIALOG' === lm[lookFor]?.tagName) lm[lookFor].showModal()
          }
        }
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
