<!-- #region pre -->

# FineTooltip

###### A tooltip that shows an unobtrusive helpful message on pointer:fine screens. Use it by adding a `help` attribute to any element.

```ts
interface FineTooltipSignature {}

class FineTooltip extends HTMLElement<FineTooltipSignature> {
  hidePopover(): void
}

declare global {
  interface HTMLElementTagNameMap {
    'fine-tooltip': FineTooltip // <fine-tooltip></fine-tooltip>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
