export class ListView extends HTMLElement {
  constructor() {
    super()
  }

  disconnectedCallback() {
    //
  }

  connectedCallback() {
    this.insertAdjacentHTML(
      'beforeend',
      `<button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <details is="disclosure-group">
              <summary><label-view system-image="smiley" label="Item 1"></label-view></summary>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
            </details>
            <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <details is="disclosure-group">
              <summary><label-view system-image="smiley" label="Item 1"></label-view></summary>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
            </details>
            <details is="disclosure-group">
              <summary><label-view system-image="smiley" label="Item 1"></label-view></summary>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
              <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
            </details>
            <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>
            <button type="button"><label-view system-image="smiley" label="Item 1"></label-view></button>`
    )
  }
}
