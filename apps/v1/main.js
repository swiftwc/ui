// import { UILabel } from './js/components'
// console.log(444, UILabel)
// import { Snapshot, polyfills, updateTheDOMSomehow } from '../../packages/ui/generated/client' //'./js/client'
import { Snapshot, polyfills, updateTheDOMSomehow } from '../../packages/ui/js/client'

document.body.addEventListener('click', async (event) => {
  console.debug(`⚡️ click`)

  if (event.target.tagName === 'BUTTON') {
    if (event.target.classList.contains('bw')) {
      const sv = event.target.closest('scroll-view'),
        pr = sv.parentElement
      await updateTheDOMSomehow(event, 'backwards', async () => {
        if (['NAVIGATION-STACK', 'NAVIGATION-SPLIT-VIEW'].includes(pr.tagName)) {
          pr.hidden = true
        } else {
          pr.remove()
        }
      })
    }

    if (event.target.classList.contains('fw')) {
      const lm = event.target.closest('navigation-stack,navigation-split-view'),
        sv = event.target.closest('scroll-view'),
        pr = sv.parentElement
      await updateTheDOMSomehow(event, 'forwards', async () => {
        const escapeHTMLPolicy = trustedTypes.createPolicy('myEscapePolicy', {
          createHTML: (string) => string.replace(/</g, '&lt;'),
        })
        if (pr.tagName === 'NAVIGATION-STACK' && 'more' === pr.getAttribute('is')) {
          document.querySelector(`#${event.target.getAttribute('tag')}`).hidden = false
        } else {
          let position = 'afterend'
          let lookFor = 'nextElementSibling'

          if (pr.tagName === 'NAVIGATION-SPLIT-VIEW') {
            position = 'beforebegin'
            lookFor = 'previousElementSibling'
          } else if (
            pr.parentElement.tagName === 'NAVIGATION-SPLIT-VIEW' &&
            'three-column' === pr.parentElement.getAttribute('visibility') &&
            pr.parentElement.tagName === 'NAVIGATION-SPLIT-VIEW'
          ) {
            position = 'beforebegin'
            lookFor = 'previousElementSibling'
          }

          if (!['BODY-VIEW', 'DIALOG'].includes(sv[lookFor]?.tagName)) {
            sv.insertAdjacentHTML(
              position,
              `
                  <${4 === lm.querySelectorAll('scroll-view').length ? 'dialog is="sheet-view"' : 'body-view'}>
                    <scroll-view>
                      <v-stack>
                        ${lm.id}section${
                          lm.querySelectorAll('scroll-view').length
                        }<button type="button" class="bw">...</button><button type="button" class="fw">...</button><p>...</p><p>...</p><form method="dialog"><button type="submit">close</button></form><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                      </v-stack>
                    </scroll-view>
                    <navigation-bar>
                      <tool-bar-item slot="leading"><button type="button" tabindex="0">aaaa${lm.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                      <tool-bar-item slot="leading"><button type="button" tabindex="0" disabled>dddd${lm.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                      <tool-bar-item-group slot="leading"><tool-bar-item><button type="button" tabindex="0">gggg${lm.querySelectorAll('scroll-view').length}</button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">gggg${lm.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                      <tool-bar-item slot="trailing"><input type="search" value="ssssss${lm.querySelectorAll('scroll-view').length}"></tool-bar-item>
                    </navigation-bar>
                  </${4 === lm.querySelectorAll('scroll-view').length ? 'dialog' : 'body-view'}>
                  `
            )
            if ('DIALOG' === sv[lookFor]?.tagName) sv[lookFor].showModal()
          }
        }
      })
      // document.startViewTransition({
      //   async update() {
      //     updateTheDOMSomehow(event, false)
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
