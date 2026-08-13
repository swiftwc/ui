<!-- #region pre -->

# ContentUnavailableView

A message with a title and extra information that you show when part of your app can’t be used.

## Declaration

`<content-unavailable-view></content-unavailable-view>>`

<!-- #endregion pre -->

<!-- #region post -->

## Topics

**Example:**

```html
<content-unavailable-view search></content-unavailable-view>
```

**Example:**

```html
<content-unavailable-view search="foo"></content-unavailable-view>
```

**Example:**

```html
<content-unavailable-view padding>
  <label-view title="No Mail">
    <i class="ph ph-tray" slot="icon" foreground="secondary"></i>
  </label-view>
  <label-view title="New mails you receive will appear here." foreground="secondary" slot="description"></label-view>
  <button is="borderless-button" type="button" tabindex="0" slot="actions">
    <label-view title="Switch Account"></label-view>
  </button>
</content-unavailable-view>
```

**Example:**

```html
<content-unavailable-view padding>
  <label-view title="No Mail">
    <svg slot="icon" foreground="secondary" ...>...</svg>
  </label-view>
  <label-view title="New mails you receive will appear here." foreground="secondary" slot="description"></label-view>
  <button is="borderless-button" type="button" tabindex="0" slot="actions">
    <label-view title="Switch Account"></label-view>
  </button>
</content-unavailable-view>
```

## Relationships

### Conforms To

`HTMLElement`

## Reference

### Slots

<div>

| Name              | Description       |
| ----------------- | ----------------- |
| _default_         | The default slot. |
| **`description`** |                   |
| **`actions`**     |                   |

</div>

### Events

_This component does not implement any events._

### Properties

_This component does not implement any properties._

### Methods

_This component does not implement any properties._

<!-- #endregion post -->
