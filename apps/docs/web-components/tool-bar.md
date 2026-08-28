<!-- #region pre -->

# ToolBar

###### A list of items placed into the toolbar or navigation bar around your content.

```ts
interface ToolBarSignature {
  Slots: {
    'cancellation-action': HTMLElement[] // The item represents a cancellation action for a modal interface. Places the item in the leading edge of the top bar and on the trailing edge of the bottom bar when fine modal
    'primary-action': HTMLElement[] // The item represents a primary action. Places the item in the trailing edge of the top bar and on the trailing edge of the bottom bar when fine modal
    'confirmation-action': HTMLElement[] // The item represents a confirmation action for a modal interface. Places the item in the trailing edge of the top bar and on the trailing edge of the bottom bar when fine modal
    'destructive-action': HTMLElement[] // The item represents a destructive action for a modal interface. Places the item in the leading edge of the top bar and on the leading edge of the bottom bar when fine modal
    'top-bar-leading': HTMLElement[] // Places the item in the leading edge of the top bar
    'top-bar-principal': HTMLElement[] // Places the item in the middle of the top bar
    'top-bar-trailing': HTMLElement[] // Places the item in the trailing edge of the top bar
    'bottom-bar-leading': HTMLElement[] // Places the item in the leading edge of the bottom bar
    'bottom-bar-principal': HTMLElement[] // Places the item in the middle of the bottom bar
    'bottom-bar-trailing': HTMLElement[] // Places the item in the trailing edge of the bottom bar
  }
}

class ToolBar extends HTMLElement<ToolBarSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'tool-bar': ToolBar // <tool-bar></tool-bar>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
