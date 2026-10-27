<!-- #region pre -->

# DetailPlaceholder

######

```ts
interface DetailPlaceholderSignature {
  Slots: {
    default: HTMLElement[] // The default slot
  }
}

class DetailPlaceholder extends HTMLElement<DetailPlaceholderSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'detail-placeholder': DetailPlaceholder // <detail-placeholder></detail-placeholder>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
