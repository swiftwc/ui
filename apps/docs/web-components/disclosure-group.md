<!-- #region pre -->

# DisclosureGroup

###### A view that shows or hides another view when the user opens or closes it.

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

| Name       |   Type    | Description                |
| ---------- | :-------: | -------------------------- |
| **`open`** | `boolean` | The status of this element |

</div>

### No Slots

### Events

<div>

| Name               | Description |
| ------------------ | ----------- |
| **`is-expanded`**  |             |
| **`is-collapsed`** |             |

</div>

### No Properties

### No Methods

<!-- #endregion post -->
