<!-- #region pre -->

# PlainButton

######

```ts
interface PlainButtonSignature {}

class PlainButton extends HTMLButtonElement<PlainButtonSignature> {}

declare global {
  interface HTMLButtonElement {
    is: 'plain-button' // <button is="plain-button"></button>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLButtonElement`

<!-- #endregion post -->
