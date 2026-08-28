<!-- #region pre -->

# ImageView

###### A view that displays an image.

```ts
interface ImageViewSignature {
  Attributes: {
    'system-name'?: string
    'system-weight'?: string
  }
}

class ImageView extends HTMLElement<ImageViewSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'image-view': ImageView // <image-view></image-view>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
