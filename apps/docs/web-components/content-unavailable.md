<!-- #region pre -->

# ContentUnavailable

###### A message with a title and extra information that you show when part of your app can’t be used.

```ts
interface ContentUnavailableSignature {
  Declaration: '<content-unavailable></content-unavailable>'

  Attributes: {
    search?: string
  }

  Slots: {
    default: HTMLElement[] // The default slot.
    description: HTMLElement[]
    actions: HTMLElement[]
  }
}

class ContentUnavailable extends HTMLElement<ContentUnavailableSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'content-unavailable': ContentUnavailable
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Topics

**Example:**

```html
<content-unavailable search></content-unavailable>
```

**Example:**

```html
<content-unavailable search="foo"></content-unavailable>
```

**Example:**

```html
<content-unavailable padding>
  <label-view title="No Mail">
    <i class="ph ph-tray" slot="icon" foreground="secondary"></i>
  </label-view>
  <label-view title="New mails you receive will appear here." foreground="secondary" slot="description"></label-view>
  <button is="borderless-button" type="button" tabindex="0" slot="actions">
    <label-view title="Switch Account"></label-view>
  </button>
</content-unavailable>
```

**Example:**

```html
<content-unavailable padding>
  <label-view title="No Mail">
    <svg slot="icon" foreground="secondary" ...>...</svg>
  </label-view>
  <label-view title="New mails you receive will appear here." foreground="secondary" slot="description"></label-view>
  <button is="borderless-button" type="button" tabindex="0" slot="actions">
    <label-view title="Switch Account"></label-view>
  </button>
</content-unavailable>
```

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
