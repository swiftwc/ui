<!-- #region pre -->

# PickerView

## Declaration

`<form is="picker-view"></form>`

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLFormElement`

## Reference

### Slots

<div>

| Name                   | Description       |
| ---------------------- | ----------------- |
| _default_              | The default slot. |
| **`label`**            |                   |
| **`list`**             |                   |
| **`validity-options`** |                   |

</div>

### Events

_This component does not implement any events._

### Properties

<div class="*:w-full *:table-fixed *:table!">

| Name                         |                                Type                                 | Description                 |
| ---------------------------- | :-----------------------------------------------------------------: | --------------------------- |
| **`selection`**              |                              `string`                               |                             |
| **`template`** `readonly`    |                         `DocumentFragment`                          |                             |
| **`pickerStyle`** `readonly` | `"automatic" \| "menu" \| "inline" \| "navigation-link" \| "sheet"` |                             |
| **`name`** `readonly`        |                `string Form participation property`                 | Form participation property |

</div>

### Methods

<div class="*:w-full *:table-fixed *:table!">

| Name                    | Returns | Description |
| ----------------------- | :-----: | ----------- |
| **`setValidity`**       | `void`  |             |
| **`setCustomValidity`** | `void`  |             |

</div>

<!-- #endregion post -->
