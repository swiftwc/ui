<!-- #region pre -->

# TabView

###### A container view that switches between screens using tabs.

```ts
interface TabViewSignature {
  CSSProperties: {
    '--adaptable-tab-bar-placement'?: string
  }
}

class TabView extends HTMLElement<TabViewSignature> {
  readonly tabBarPlacement: 'bottom-bar' | 'ornament' | 'sidebar' | 'top-bar' | undefined
  readonly moreTab: NavigationStack | null
  selectedTab: (NavigationSplitView | NavigationStack)[]
}

interface GlobalEventMap<Targets = HTMLElementEventMap | DocumentEventMap | WindowEventMap> {
  tabshow: CustomEvent // A Tab is shown
  tabhide: CustomEvent // A Tab is hidden
  'tab-view:toggle': CustomEvent
  'tab-view:adaptable-tab-bar-placement-change': CustomEvent
}

declare global {
  interface HTMLElementTagNameMap {
    'tab-view': TabView // <tab-view></tab-view>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
