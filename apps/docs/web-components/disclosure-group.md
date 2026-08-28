<!-- #region pre -->

# DisclosureGroup

###### A view that shows or hides another view when the user opens or closes it.

```ts
interface DisclosureGroupSignature {
  Attributes: {
    open?: boolean // The status of this element
  }
}

class DisclosureGroup extends HTMLDetailsElement<DisclosureGroupSignature> {}

interface GlobalEventMap<Targets = HTMLElementEventMap | DocumentEventMap | WindowEventMap> {
  'is-expanded': CustomEvent
  'is-collapsed': CustomEvent
}

declare global {
  interface HTMLDetailsElement {
    is: 'disclosure-group' // <details is="disclosure-group"></details>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Topics

**Example:**

```html
<details is="disclosure-group">
  <summary><label-view title="Items"></label-view></summary>
  <label-view title="Item 1"></label-view>
  <label-view title="Item 2"></label-view>
  <details is="disclosure-group">
    <summary><label-view title="Sub-items"></label-view></summary>
    <label-view title="Sub-item 1"></label-view>
  </details>
</details>
```

## Relationships

### Conforms To

`HTMLDetailsElement`

<!-- #endregion post -->
