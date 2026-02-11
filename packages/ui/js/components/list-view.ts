export class ListView extends HTMLElement {
  constructor() {
    super()
  }

  disconnectedCallback() {
    //
  }

  connectedCallback() {
    if (this.matches(':empty'))
      this.insertAdjacentHTML(
        'beforeend',
        `<button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <details is="disclosure-group">
              <summary><label-view system-image="smiley" label="Item 1"></label-view></summary>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            </details>
            <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <details is="disclosure-group">
              <summary><label-view system-image="smiley" label="Item 1"></label-view></summary>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            </details>
            <details is="disclosure-group">
              <summary><label-view system-image="smiley" label="Item 1"></label-view></summary>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            </details>
            <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button" tabindex="0"><label-view system-image="smiley" label="Item 1"></label-view></button>`
      )
  }
}
