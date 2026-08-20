<!-- #region pre -->

# ToolBar

###### A list of items placed into the toolbar or navigation bar around your content.

```ts
interface ToolBarSignature {
  Declaration: '<tool-bar></tool-bar>'

  Slots: {
    'cancellation-action': [] // The item represents a cancellation action for a modal interface. Places the item in the leading edge of the top bar and on the trailing edge of the bottom bar when fine modal
    'primary-action': [] // The item represents a primary action. Places the item in the trailing edge of the top bar and on the trailing edge of the bottom bar when fine modal
    'confirmation-action': [] // The item represents a confirmation action for a modal interface. Places the item in the trailing edge of the top bar and on the trailing edge of the bottom bar when fine modal
    'destructive-action': [] // The item represents a destructive action for a modal interface. Places the item in the leading edge of the top bar and on the leading edge of the bottom bar when fine modal
    'top-bar-leading': [] // Places the item in the leading edge of the top bar
    'top-bar-principal': [] // Places the item in the middle of the top bar
    'top-bar-trailing': [] // Places the item in the trailing edge of the top bar
    'bottom-bar-leading': [] // Places the item in the leading edge of the bottom bar
    'bottom-bar-principal': [] // Places the item in the middle of the bottom bar
    'bottom-bar-trailing': [] // Places the item in the trailing edge of the bottom bar
  }
}

class ToolBar extends HTMLElement<ToolBarSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'tool-bar': ToolBar
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
