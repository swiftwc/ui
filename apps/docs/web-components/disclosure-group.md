<!-- #region pre -->

# DisclosureGroup

A view that shows or hides another content view, based on the state of a disclosure control.

## Declaration

`<details is="disclosure-group"></details>>`

<!-- #endregion pre -->

<!-- #region post -->

## Topics

**Example:**

```html
<details is="disclosure-group">
  <summary><label-view title="Items"></label-view></summary>
  <label-view title="Item 1"></label-view>
  <label-view title="Item 2"></label-view>
  <details is="disclosure-group">
    <summary><label-view title="Sub-items"></label-view></summary>
    <label-view title="Sub-item 1"></label-view>
  </details>
</details>
```

## Relationships

### Conforms To

`HTMLDetailsElement`

## Reference

### Slots

_This component does not implement any slotted content._

### Events

_This component does not implement any events._

### Properties

_This component does not implement any properties._

### Methods

_This component does not implement any properties._

<!-- #endregion post -->
