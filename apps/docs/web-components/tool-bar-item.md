<!-- #region pre -->

# ToolBarItem

###### A view placed in the toolbar or navigation bar.

```ts
interface ToolBarItemSignature {
  Attributes: {
    slot?: string
    'data-previous-slot'?: string
    'title-key'?: string
  }
}

class ToolBarItem extends HTMLElement<ToolBarItemSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'tool-bar-item': ToolBarItem // <tool-bar-item></tool-bar-item>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
