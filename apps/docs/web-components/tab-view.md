<!-- #region pre -->

# TabView

###### A container view that switches between screens using tabs.

```ts
interface TabViewSignature {
  Declaration: '<tab-view></tab-view>'

  Events: {
    tabshow: CustomEvent<{ value: string }> // A Tab is shown
    tabhide: CustomEvent<{ value: string }> // A Tab is hidden
    'tab-view:toggle': CustomEvent<{ value: string }>
    'tab-view:adaptable-tab-bar-placement-change': CustomEvent<{
      value: string
    }>
  }
}

class TabView extends HTMLElement<TabViewSignature> {
  readonly tabBarPlacement: 'bottom-bar' | 'ornament' | 'sidebar' | 'top-bar' | undefined
  readonly moreTab: NavigationStack | null
  selectedTab: (NavigationSplitView | NavigationStack)[]
}

declare global {
  interface HTMLElementTagNameMap {
    'tab-view': TabView
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
