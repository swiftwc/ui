<!-- #region pre -->

# DisclosureGroup

###### A view that shows or hides another content view, based on the state of a disclosure control.

`<details is="disclosure-group"></details>`

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

### Attributes

<div class="*:w-full *:table-fixed *:table!">

| Name       |   Type   | Description |
| ---------- | :------: | ----------- |
| **`open`** | `string` |             |

</div>

### No Slots

### No Events

### No Properties

### No Methods

<!-- #endregion post -->
