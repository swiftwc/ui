<!-- #region pre -->

# SectionView

###### A container view that groups related content together.

```ts
interface SectionViewSignature {
  Declaration: '<section-view></section-view>'

  Attributes: {
    header: string
    footer: string
  }

  Slots: {
    default: [] // The default slot.
    header: []
    footer: []
  }
}

class SectionView extends HTMLElement<SectionViewSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'section-view': SectionView
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
