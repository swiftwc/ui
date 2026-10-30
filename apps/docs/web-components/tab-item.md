<!-- #region pre -->

# TabItem

###### A control that switches the tab view to this tab.

```ts
interface TabItemSignature {
  Slots: {
    default: HTMLElement[] // The default slot
  }
}

class TabItem extends HTMLButtonElement<TabItemSignature> {}

declare global {
  interface HTMLButtonElement {
    is: 'tab-item' // <button is="tab-item"></button>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

<!-- #endregion post -->
