<!-- #region pre -->

# ScrollView

###### A view that scrolls its content when it doesn’t fit the screen.

```ts
interface ScrollViewSignature {
  Attributes: {
    'navigation-title'?: string // Configures the view’s title for purposes of navigation. Shorthand for `<v-stack spacing="0" alignment="fill" slot="top-bar-principal"><label-view line-limit="1" truncation-mode="tail" font="headline"><span>Navigation Title</span></label-view></v-stack>`
    'navigation-inline-title'?: string
    'navigation-inline-subtitle'?: string
    'navigation-icon'?: string
    'navigation-bar-title-display-mode'?: string
  }

  Slots: {
    default: HTMLElement[] // The default slot.
    'top-bar-principal': HTMLElement[]
    'bottom-bar-principal': HTMLElement[]
  }
}

class ScrollView extends HTMLElement<ScrollViewSignature> {
  centerScrollToElement(): void
}

declare global {
  interface HTMLElementTagNameMap {
    'scroll-view': ScrollView // <scroll-view></scroll-view>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
