<!-- #region pre -->

# ColorScheme

######

```ts
interface ColorSchemeSignature {
  Declaration: '<color-scheme></color-scheme>'

  Attributes: {
    dark?: string
  }
}

class ColorScheme extends HTMLElement<ColorSchemeSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'color-scheme': ColorScheme
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
