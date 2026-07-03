import { devFlags } from '../internal/utils'

export class ColorScheme extends HTMLElement {
  static get observedAttributes() {
    return ['dark']
  }

  constructor() {
    super()
  }

  connectedCallback() {
    if (devFlags.debug) console.debug(`${ColorScheme.name} ⚡️ connect`)

    this.hidden = true

    this.inert = true
  }

  disconnectedCallback() {
    if (devFlags.debug) console.debug(`${ColorScheme.name} ⚡️ disconnect`)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (devFlags.debug) console.debug(`${ColorScheme.name} ⚡️ attr-change [${name}]`)

    // self.CSS.registerProperty({ name: '--canvas', syntax: '<color>', inherits: false, initialValue: 'oklch(100% 0 0deg)' })
    if (newValue) self.CSS.registerProperty({ name: '--canvas', syntax: '<color>', inherits: false, initialValue: 'oklch(0% 0 0deg)' })
    // @property --canvas {
    //   syntax: "<color>";
    //   initial-value: oklch(100% 0 0deg);
    //   inherits: false;
    // }
    // @media (prefers-color-scheme: dark) {
    //   @property --canvas {
    //     syntax: "<color>";
    //     initial-value: oklch(0% 0 0deg);
    //     inherits: false;
    //   }
    // }
    // @property --canvastext {
    //   syntax: "<color>";
    //   initial-value: oklch(0% 0 0deg);
    //   inherits: false;
    // }
    // @media (prefers-color-scheme: dark) {
    //   @property --canvastext {
    //     syntax: "<color>";
    //     initial-value: oklch(100% 0 0deg);
    //     inherits: false;
    //   }
    // }
    // if (CSS.supports('interpolate-size', 'allow-keywords')) {
    // self.CSS.registerProperty({ name: '--background', syntax: '<color>', inherits: false, initialValue: 'oklch(100% 0 0deg)' })
    if (null !== newValue) self.CSS.registerProperty({ name: '--background', syntax: '<color>', inherits: false, initialValue: 'oklch(0% 0 0deg)' })
  }
}
