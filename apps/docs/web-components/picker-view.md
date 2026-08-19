<!-- #region pre -->

# PickerView

###### A control that selects one value from a set of options.

`<form is="picker-view"></form>`

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLFormElement`

## Reference

### Attributes

<div class="*:w-full *:table-fixed *:table!">

| Name                        |                                Type                                 | Description                                                             |
| --------------------------- | :-----------------------------------------------------------------: | ----------------------------------------------------------------------- |
| **`picker-style`**          | `"menu" \| "inline" \| "navigation-link" \| "sheet" \| "automatic"` |                                                                         |
| **`help`**                  |                             `"string"`                              | Adds a help tooltip to the trigger of the picker, if style supports one |
| **`dictionary`**            |                           `"DictEntry[]"`                           | Renders all options using this array                                    |
| **`label-value-placement`** |               `"vertical" \| "horizontal" \| "auto"`                |                                                                         |

</div>

### Slots

<div>

| Name                   | Description       |
| ---------------------- | ----------------- |
| _default_              | The default slot. |
| **`label`**            |                   |
| **`list`**             |                   |
| **`validity-options`** |                   |

</div>

### No Events

### Properties

<div class="*:w-full *:table-fixed *:table!">

| Name                         |                                Type                                 | Description                 |
| ---------------------------- | :-----------------------------------------------------------------: | --------------------------- |
| **`selection`**              |                              `string`                               |                             |
| **`template`** `readonly`    |                         `DocumentFragment`                          |                             |
| **`pickerStyle`** `readonly` | `"automatic" \| "menu" \| "inline" \| "navigation-link" \| "sheet"` |                             |
| **`name`** `readonly`        |                              `string`                               | Form participation property |

</div>

### Methods

<div class="*:w-full *:table-fixed *:table!">

| Name                    | Returns | Description |
| ----------------------- | :-----: | ----------- |
| **`setValidity`**       | `void`  |             |
| **`setCustomValidity`** | `void`  |             |

</div>

<!-- #endregion post -->
