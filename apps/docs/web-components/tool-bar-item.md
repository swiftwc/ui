<!-- #region pre -->

# ToolBarItem

###### A view placed in the toolbar or navigation bar.

```ts
interface ToolBarItemSignature {
  Declaration: '<tool-bar-item></tool-bar-item>'

  Attributes: {
    slot: string
    'data-previous-slot': string
    'title-key': string
  }
}

class ToolBarItem extends HTMLElement<ToolBarItemSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'tool-bar-item': ToolBarItem
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
