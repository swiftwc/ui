// import { UILabel } from './js/components'
// console.log(444, UILabel)
// import { Snapshot, polyfills, startViewTransition } from '../../packages/ui/generated/client' //'./js/client'
import { getRootController, closestBody, startViewTransition, closestHost, getComputedView } from '../../packages/ui/js/client'

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

document.body.addEventListener('selection', async (event) => {
  alert(event.detail.tag)
})

document.body.addEventListener('click', async (event) => {
  console.debug(`⚡️ click`)

  if (event.target.closest('button')) {
    if (event.target.closest('.make-list')) {
      const btn = event.target.closest('.make-list')
      for (const el of btn.closest('scroll-view').querySelectorAll('list-view'))
        if (btn.getAttribute('list')) el.setAttribute('list-style', btn.getAttribute('list'))
        else el.removeAttribute('list-style')
      for (const el of btn.closest('scroll-view').querySelectorAll('[is=form-view]'))
        if (btn.getAttribute('list')) el.setAttribute('form-style', btn.getAttribute('list'))
        else el.removeAttribute('form-style')
    }
    if (event.target.closest('.bww')) {
      const sv = closestBody(
          [...document.querySelectorAll('scroll-view:not(navigation-stack[hidden] scroll-view,navigation-split-view[hidden] scroll-view)')][1]
        ),
        pr = closestHost(sv) //queryFrameToolbars(sv).scene.parentElement

      await startViewTransition({ target: sv }, 'backwards', async () => {
        modifyDOMbackwards(pr)
      })
    } else if (event.target.closest('.bww2')) {
      const sv = [...event.target.closest('dialog').querySelectorAll('scroll-view')][1],
        pr = closestHost(sv) //queryFrameToolbars(sv).scene.parentElement

      await startViewTransition({ target: sv }, 'backwards', async () => {
        modifyDOMbackwards(pr)
      })
    }

    if (event.target.closest('.fww')) {
      const sv = closestBody(event.target),
        root = getRootController(sv),
        view = getComputedView(sv)
      // { page, host } = getComputedView(sv) //{ scene, frame } = queryFrameToolbars(sv),
      // position = queryInsertPosition(host)

      await startViewTransition({ target: sv }, 'forwards', async () => {
        modifyDOMforwards(
          event.target,
          view,
          `
                  <body-view>
                    <scroll-view>
                      <v-stack padding distribution="start" frame-width="infinity">
                        <button type="button" class="bw">🔙</button>
                        <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                      </v-stack>
                    </scroll-view>
                    <body-view>
                      <scroll-view>
                        <v-stack padding distribution="start" frame-width="infinity">
                          <button type="button" class="bw">🔙</button>
                          <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                        </v-stack>
                      </scroll-view>
                      <body-view>
                        <scroll-view>
                          <v-stack padding distribution="start" frame-width="infinity">
                            <button type="button" class="bw">🔙</button>
                            <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                          </v-stack>
                        </scroll-view>
                        <body-view>
                          <scroll-view>
                            <v-stack padding distribution="start" frame-width="infinity">
                              <button type="button" class="bw">🔙</button>
                              <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                            </v-stack>
                          </scroll-view>
                          <body-view>
                            <scroll-view>
                              <v-stack padding distribution="start" frame-width="infinity">
                                <button type="button" class="bw">🔙</button>
                                <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                              </v-stack>
                            </scroll-view>
                            ${
                              event.target.closest('.dlg')
                                ? `<dialog is="sheet-view">
                              <scroll-view>
                                <v-stack padding distribution="start" frame-width="infinity">
                                  <button type="button" class="bw">🔙</button>
                                    <button type="button" class="bww">🔚</button>
                                    <button type="button" class="bww2">🔚 of modal</button>
                                  <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                                </v-stack>
                              </scroll-view>
                              <body-view>
                                <scroll-view>
                                  <v-stack padding distribution="start" frame-width="infinity">
                                    <button type="button" class="bw">🔙</button>
                                    <button type="button" class="bww">🔚</button>
                                    <button type="button" class="bww2">🔚 of modal</button>
                                    <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                                  </v-stack>
                                </scroll-view>
                                <body-view>
                                  <scroll-view>
                                    <v-stack padding distribution="start" frame-width="infinity">
                                      <button type="button" class="bw">🔙</button>
                                      <button type="button" class="bww">🔚</button>
                                      <button type="button" class="bww2">🔚 of modal</button>
                                      <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                                    </v-stack>
                                  </scroll-view>
                                  <body-view>
                                    <scroll-view>
                                      <v-stack padding distribution="start" frame-width="infinity">
                                        <button type="button" class="bw">🔙</button>
                                        <button type="button" class="bww">🔚</button>
                                        <button type="button" class="bww2">🔚 of modal</button>
                                        <button type="button" class="fww">deep</button>
                                        <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                                      </v-stack>
                                    </scroll-view>
                                    <tool-bar>
                                      <tool-bar-item slot="navigation-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                                      <tool-bar-item slot="navigation-bar-leading"><picker-view picker-style="menu"><datalist slot="list"><option value="0" label="0%"></option><option value="10" label="Minimum Tip"></option><option value="20" label="Standard"></option><option value="30" label="Generous"></option><option value="50" label="Very Generous"></option></datalist></picker-view></tool-bar-item>

                                      <tool-bar-item-group slot="navigation-bar-leading"><tool-bar-item><menu-view><label-view system-image="smiley" slot="label"></label-view><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                                      
                                      <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                                      
                                      <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                                      
                                      <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                                    </tool-bar>
                                  </body-view>
                                  <tool-bar>
                                    <tool-bar-item slot="navigation-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                                    <tool-bar-item slot="navigation-bar-leading"><picker-view picker-style="menu"><datalist slot="list"><option value="0" label="0%"></option><option value="10" label="Minimum Tip"></option><option value="20" label="Standard"></option><option value="30" label="Generous"></option><option value="50" label="Very Generous"></option></datalist></picker-view></tool-bar-item>

                                    <tool-bar-item-group slot="navigation-bar-leading"><tool-bar-item><menu-view><label-view system-image="smiley" slot="label"></label-view><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                                    
                                    <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                                    
                                    <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                                    
                                    <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                                  </tool-bar>
                                </body-view>
                                <tool-bar>
                                  <tool-bar-item slot="navigation-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                                  <tool-bar-item slot="navigation-bar-leading"><picker-view picker-style="menu"><datalist slot="list"><option value="0" label="0%"></option><option value="10" label="Minimum Tip"></option><option value="20" label="Standard"></option><option value="30" label="Generous"></option><option value="50" label="Very Generous"></option></datalist></picker-view></tool-bar-item>

                                  <tool-bar-item-group slot="navigation-bar-leading"><tool-bar-item><menu-view><label-view system-image="smiley" slot="label"></label-view><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                                  
                                  <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                                  
                                  <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                                  
                                  <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                                </tool-bar>
                              </body-view>
                              <tool-bar>
                                <tool-bar-item slot="navigation-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                                <tool-bar-item slot="navigation-bar-leading"><picker-view picker-style="menu"><datalist slot="list"><option value="0" label="0%"></option><option value="10" label="Minimum Tip"></option><option value="20" label="Standard"></option><option value="30" label="Generous"></option><option value="50" label="Very Generous"></option></datalist></picker-view></tool-bar-item>

                                <tool-bar-item-group slot="navigation-bar-leading"><tool-bar-item><menu-view><label-view system-image="smiley" slot="label"></label-view><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                                
                                <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                                
                                <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                                
                                <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                              </tool-bar>
                            </dialog>`
                                : ''
                            }
                            <tool-bar>
                              <tool-bar-item slot="navigation-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                              <tool-bar-item slot="navigation-bar-leading"><picker-view picker-style="menu"><datalist slot="list"><option value="0" label="0%"></option><option value="10" label="Minimum Tip"></option><option value="20" label="Standard"></option><option value="30" label="Generous"></option><option value="50" label="Very Generous"></option></datalist></picker-view></tool-bar-item>

                              <tool-bar-item-group slot="navigation-bar-leading"><tool-bar-item><menu-view><label-view system-image="smiley" slot="label"></label-view><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                              
                              <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                              
                              <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                              
                              <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                            </tool-bar>
                          </body-view>
                          <tool-bar>
                            <tool-bar-item slot="navigation-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                            <tool-bar-item slot="navigation-bar-leading"><picker-view picker-style="menu"><datalist slot="list"><option value="0" label="0%"></option><option value="10" label="Minimum Tip"></option><option value="20" label="Standard"></option><option value="30" label="Generous"></option><option value="50" label="Very Generous"></option></datalist></picker-view></tool-bar-item>

                            <tool-bar-item-group slot="navigation-bar-leading"><tool-bar-item><menu-view><label-view system-image="smiley" slot="label"></label-view><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                            
                            <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                            
                            <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                            
                            <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                          </tool-bar>
                        </body-view>
                        <tool-bar>
                          <tool-bar-item slot="navigation-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                          <tool-bar-item slot="navigation-bar-leading"><picker-view picker-style="menu"><datalist slot="list"><option value="0" label="0%"></option><option value="10" label="Minimum Tip"></option><option value="20" label="Standard"></option><option value="30" label="Generous"></option><option value="50" label="Very Generous"></option></datalist></picker-view></tool-bar-item>

                          <tool-bar-item-group slot="navigation-bar-leading"><tool-bar-item><menu-view><label-view system-image="smiley" slot="label"></label-view><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                          
                          <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                          
                          <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                          
                          <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                        </tool-bar>
                      </body-view>
                      <tool-bar>
                        <tool-bar-item slot="navigation-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                        <tool-bar-item slot="navigation-bar-leading"><picker-view picker-style="menu"><datalist slot="list"><option value="0" label="0%"></option><option value="10" label="Minimum Tip"></option><option value="20" label="Standard"></option><option value="30" label="Generous"></option><option value="50" label="Very Generous"></option></datalist></picker-view></tool-bar-item>

                        <tool-bar-item-group slot="navigation-bar-leading"><tool-bar-item><menu-view><label-view system-image="smiley" slot="label"></label-view><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                        
                        <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                        
                        <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                        
                        <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                      </tool-bar>
                    </body-view>
                    <tool-bar>
                      <tool-bar-item slot="navigation-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>

                      <tool-bar-item slot="navigation-bar-leading"><picker-view picker-style="menu"><datalist slot="list"><option value="0" label="0%"></option><option value="10" label="Minimum Tip"></option><option value="20" label="Standard"></option><option value="30" label="Generous"></option><option value="50" label="Very Generous"></option></datalist></picker-view></tool-bar-item>

                      <tool-bar-item-group slot="navigation-bar-leading"><tool-bar-item><menu-view><label-view system-image="smiley" slot="label"></label-view><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                      
                      <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                      
                      <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                      
                      <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                    </tool-bar>
                  </body-view>
                  `
        )
      })
    }

    if (event.target.closest('.bw')) {
      const sv = closestBody(event.target), //event.target.closest('scroll-view') ?? event.target.closest('tool-bar')?.previousElementSibling,
        pr = closestHost(sv) //queryFrameToolbars(sv).scene.parentElement //sv.parentElement

      await startViewTransition(event, 'backwards', async () => {
        modifyDOMbackwards(pr)
      })
    }

    if (event.target.classList.contains('fw')) {
      const sv = closestBody(event.target), //event.target.closest('scroll-view') ?? event.target.closest('tool-bar')?.previousElementSibling,
        root = getRootController(sv), //sv.closest('navigation-stack,navigation-split-view'),
        view = getComputedView(sv) //{ scene, frame } = queryFrameToolbars(sv),
      // position = queryInsertPosition(host) //'afterend'

      // scene = sv.parentElement?.matches('dialog[is=sidebar-view]') ? sv.parentElement : sv,
      // frame = scene.parentElement
      // console.log(99, lm, frame, queryFrameToolbars(sv).scene)
      await startViewTransition(event, 'forwards', async () => {
        modifyDOMforwards(
          event.target,
          view,
          `
                  <${6 === root.querySelectorAll('scroll-view').length ? 'dialog is="sheet-view"' : 'body-view'}>
                    <scroll-view>
                      <v-stack padding distribution="start" frame-width="infinity">
                        <navigation-title value="dds"></navigation-title>
                        ${root.id}section${
                          root.querySelectorAll('scroll-view').length
                        }<button type="button" class="bw">🔙</button><button type="button" class="fw">→</button><p>...</p><p>...</p><button type="button" class="bww">🔚</button><form method="dialog"><button>close</button></form><p>...</p><input type="text" /><p>...</p><menu-view><label-view system-image="smiley" slot="label"></label-view><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button></menu-view><p>...</p>
                        
                        <picker-view picker-style="menu">
                        <label-view slot="label" system-image="dots-three" label="rtyty"></label-view>
                        <label-view slot="tag" label="0%"></label-view>
                        <label-view slot="tag" label="Minimum Tip"></label-view>
                        <label-view slot="tag" label="Standard"></label-view>
                        <label-view slot="tag" label="Generous"></label-view>
                        <label-view slot="tag" label="Very Generous"></label-view>
                        </picker-view>
        
        <picker-view picker-style="menu"><datalist slot="list"><option value="0" label="0%"></option><option value="10" label="Minimum Tip"></option><option value="20" label="Standard"></option><option value="30" label="Generous"></option><option value="50" label="Very Generous"></option></datalist></picker-view>
        
        <p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                      </v-stack>
                      <label-view slot="navigation-bar-principal" label="ghjh${root.querySelectorAll('scroll-view').length}"></label-view>
                      <label-view slot="bottom-bar-principal" label="ghjh${root.querySelectorAll('scroll-view').length}"></label-view>
                    </scroll-view>
                    <tool-bar>
                      <tool-bar-item slot="navigation-bar-leading"><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item>
                      <tool-bar-item slot="navigation-bar-leading"><picker-view picker-style="menu"><datalist slot="list"><option value="0" label="0%"></option><option value="10" label="Minimum Tip"></option><option value="20" label="Standard"></option><option value="30" label="Generous"></option><option value="50" label="Very Generous"></option></datalist></picker-view></tool-bar-item>
                      <tool-bar-item slot="navigation-bar-leading">
                      <menu-view><label-view system-image="smiley" slot="label"></label-view><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button>
                      <details is="disclosure-group">
              <summary><label-view system-image="smiley" label="Item 1"></label-view></summary>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            </details>
            <button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button>
            <menu-view><label-view system-image="smiley" slot="label"></label-view><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button></menu-view>
            <button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button></menu-view>
            </tool-bar-item>
                      <tool-bar-item slot="navigation-bar-leading"><button type="button" tabindex="0" disabled><label-view system-image="smiley"></label-view></button></tool-bar-item>

                      <tool-bar-item-group slot="navigation-bar-leading"><tool-bar-item><menu-view><label-view system-image="smiley" slot="label"></label-view><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button></menu-view></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0"><label-view system-image="smiley"></label-view></button></tool-bar-item></tool-bar-item-group>
                      <tool-bar-item slot="navigation-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                      <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0"><label-view label="a${root.querySelectorAll('scroll-view').length}"></label-view></button></tool-bar-item>
                      <tool-bar-item slot="bottom-bar-leading">
                      <menu-view>
                      <label-view system-image="smiley" slot="label"></label-view>
                      <button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button>
                      <section-view header="Section 1">
                      <button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button>
                      </section-view>
                      <button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button><button tabindex="0">ddd</button>
                      </menu-view>
                      </tool-bar-item>
                      <tool-bar-item slot="bottom-bar-leading"><button type="button" tabindex="0" disabled>d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item>
                      <tool-bar-item-group slot="bottom-bar-leading"><tool-bar-item><button type="button" tabindex="0"><label-view><svg slot="image" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path></svg></label-view></button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">d${root.querySelectorAll('scroll-view').length}</button></tool-bar-item></tool-bar-item-group>
                      <tool-bar-item slot="bottom-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll('scroll-view').length}"></tool-bar-item>
                    </tool-bar>
                  </${6 === root.querySelectorAll('scroll-view').length ? 'dialog' : 'body-view'}>
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

export function modifyDOMbackwards(pr) {
  if (['NAVIGATION-STACK', 'NAVIGATION-SPLIT-VIEW'].includes(pr.tagName)) {
    pr.hidden = true
  } else {
    pr.remove()
  }
}

export function modifyDOMforwards(trigger, view, htmlorTpl) {
  // const root = getRootController(body), //sv.closest('navigation-stack,navigation-split-view'),
  // const view = getComputedView(body) //{ scene, frame } = queryFrameToolbars(sv),
  const { page, host } = view
  // const escapeHTMLPolicy = trustedTypes.createPolicy('myEscapePolicy', {
  //   createHTML: (string) => string.replace(/</g, '&lt;'),
  // })
  if (trigger?.hasAttribute('tag')) {
    document.querySelector(`#${trigger.getAttribute('tag')}`).hidden = false
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
    const position = queryInsertPosition(host) //'afterend'
    const lookFor = 'beforebegin' === position ? 'previousElementSibling' : 'nextElementSibling'

    if (!['BODY-VIEW', 'DIALOG'].includes(page[lookFor]?.tagName)) {
      let node

      if (htmlorTpl instanceof HTMLTemplateElement) {
        node = htmlorTpl.content.cloneNode(true).firstElementChild
      } else {
        const tpl = document.createElement('template')
        tpl.innerHTML = htmlorTpl
        node = tpl.content.firstElementChild
      }

      page.insertAdjacentElement(position, node)
      // if ('DIALOG' === scene[lookFor]?.tagName) scene[lookFor].showModal()
      // console.log(99, node.tagName, scene[lookFor]?.tagName)
      // lm.insertAdjacentHTML(position, ``)
      // if ('DIALOG' === lm[lookFor]?.tagName) lm[lookFor].showModal()
    }
  }
}
