import { CleanupRegistry } from '../internal/class/cleanup-registry'

export class ToolBarItemGroup extends HTMLElement {
  // static get observedAttributes() {
  //   return ['preferred-fine-modal-placement']
  // }

  constructor() {
    super()
  }

  connectedCallback() {
    console.debug(`${ToolBarItemGroup.name} ⚡️ connect`)

    // if (!this.closest('[is=sheet-view]')) return
    // if (!self.matchMedia('(pointer: fine)').matches) return

    // const handler1 = toolbarRepositioner.bind(null, this)

    // CleanupRegistry.register(this, onoff('fine_dialog_sheet:change', handler1 as unknown as EventListener, Snapshot.on).on())

    // Snapshot.waitReady.then(() => {
    //   toolbarRepositioner(
    //     this,
    //     new MediaQueryListEvent(`media-change`, {
    //       matches: Snapshot.breakpoints?.get('fine_dialog_sheet'),
    //     })
    //   ) // Initial check
    // })
  }

  disconnectedCallback() {
    console.debug(`${ToolBarItemGroup.name} ⚡️ disconnect`)

    CleanupRegistry.unregister(this)
  }

  // attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
  //   console.debug(`${ToolBarItemGroup.name} ⚡️ attr-change [${name}] ("${oldValue}" → "${newValue}")`)

  //   switch (name) {
  //     case 'preferred-fine-modal-placement':
  //       Snapshot.waitReady.then(() => {
  //         toolbarRepositioner(
  //           this,
  //           new MediaQueryListEvent(`media-change`, {
  //             matches: Snapshot.breakpoints?.get('fine_dialog_sheet'),
  //           })
  //         ) // Initial check
  //       })

  //       break
  //   }
  // }
}
