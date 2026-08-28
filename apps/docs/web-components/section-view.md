<!-- #region pre -->

# SectionView

###### A container view that groups related content together.

```ts
interface SectionViewSignature {
  Attributes: {
    header?: string
    footer?: string
  }

  Slots: {
    default: HTMLElement[] // The default slot.
    header: HTMLElement[]
    footer: HTMLElement[]
  }
}

class SectionView extends HTMLElement<SectionViewSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'section-view': SectionView // <section-view></section-view>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
