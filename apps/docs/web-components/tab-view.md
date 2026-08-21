<!-- #region pre -->

# TabView

###### A container view that switches between screens using tabs.

```ts
interface TabViewSignature {
  Declaration: '<tab-view></tab-view>'

  Events: {
    tabshow: CustomEvent // A Tab is shown
    tabhide: CustomEvent // A Tab is hidden
    'tab-view:toggle': CustomEvent
    'tab-view:adaptable-tab-bar-placement-change': CustomEvent
  }

  CSSProperties: {
    '--adaptable-tab-bar-placement'?: string
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
