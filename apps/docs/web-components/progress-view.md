<!-- #region pre -->

# ProgressView

###### A view that shows how far along a task is.

```ts
interface ProgressViewSignature {
  Attributes: {
    label?: string
    'current-value-label'?: string
    value?: string
  }

  Slots: {
    default: HTMLElement[] // The default slot.
    'current-value': HTMLElement[]
  }
}

class ProgressView extends HTMLElement<ProgressViewSignature> {
  readonly progressViewStyle: 'circular' | 'linear'
}

declare global {
  interface HTMLElementTagNameMap {
    'progress-view': ProgressView // <progress-view></progress-view>
  }
}
```

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

<!-- #endregion post -->
