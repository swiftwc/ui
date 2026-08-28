<!-- #region pre -->

# ColorScheme

######

```ts
interface ColorSchemeSignature {
  Attributes: {
    dark?: string
  }
}

class ColorScheme extends HTMLElement<ColorSchemeSignature> {}

declare global {
  interface HTMLElementTagNameMap {
    'color-scheme': ColorScheme // <color-scheme></color-scheme>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
