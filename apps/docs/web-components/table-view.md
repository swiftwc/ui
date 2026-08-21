<!-- #region pre -->

# TableView

###### A container view that arranges data in rows and columns, optionally letting the user select one or more of them.

```ts
interface TableViewSignature {
  Declaration: '<table-view></table-view>'

  Attributes: {
    'preferred-compact-template'?: 'title:trailing:subtitle' | 'trailing:title:subtitle' | 'title:subtitle:trailing' | '*' // Sets the template areas when the table is in compact mode
  }

  Slots: {
    default: HTMLElement[] // The default slot.
    'header-leading': HTMLElement[]
    'header-principal': HTMLElement[]
    'header-trailing': HTMLElement[]
    column: HTMLElement[]
    'footer-leading': HTMLElement[]
    'footer-principal': HTMLElement[]
    'footer-trailing': HTMLElement[]
  }
}

class TableView extends HTMLElement<TableViewSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'table-view': TableView
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
