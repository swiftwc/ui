<!-- #region pre -->

# MenuView

###### A control that opens a menu of actions.

```ts
interface MenuViewSignature {
  Declaration: '<menu-view></menu-view>'

  Attributes: {
    open: string
    closing: string
    label: string
  }

  Slots: {
    default: [] // The default slot.
    label: []
  }
}

class MenuView extends HTMLElement<MenuViewSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'menu-view': MenuView
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
