<!-- #region pre -->

# LabeledContent

###### A container view that pairs a label with a value.

```ts
interface LabeledContentSignature {
  Declaration: '<labeled-content></labeled-content>'

  Attributes: {
    value: string
    label: string
    header: string
    footer: string
    'labeled-content-style': 'vertical' | 'horizontal'
    format: string
  }

  Slots: {
    default: [] // The default slot.
    label: [] // Use the `slot="label"` attribute to place childen in the label block.
    header: []
    footer: []
  }
}

class LabeledContent extends HTMLElement<LabeledContentSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'labeled-content': LabeledContent
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
