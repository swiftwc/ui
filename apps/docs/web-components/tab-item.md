<!-- #region pre -->

# TabItem

###### A control that switches the tab view to this tab.

```ts
interface TabItemSignature {}

class TabItem extends HTMLButtonElement<TabItemSignature> {}

declare global {
  interface HTMLButtonElement {
    is: 'tab-item' // <button is="tab-item"></button>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLButtonElement`

<!-- #endregion post -->
