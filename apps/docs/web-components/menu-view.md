<!-- #region pre -->

# MenuView

###### A control that opens a menu of actions.

```ts
interface MenuViewSignature {
  Attributes: {
    open?: string
    closing?: string
    label?: string
  }

  Slots: {
    default: HTMLElement[] // The default slot.
    label: HTMLElement[]
  }
}

class MenuView extends HTMLElement<MenuViewSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'menu-view': MenuView // <menu-view></menu-view>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
