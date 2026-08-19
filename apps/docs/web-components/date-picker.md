<!-- #region pre -->

# DatePicker

###### A control that selects an absolute date.

`<form is="date-picker"></form>`

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLFormElement`

## Reference

### Attributes

<div class="*:w-full *:table-fixed *:table!">

| Name                    |                  Type                   | Description               |
| ----------------------- | :-------------------------------------: | ------------------------- |
| **`date-picker-style`** | `"graphical" \| "field" \| "automatic"` | The style of this element |
| **`required`**          |              `"required"`               |                           |
| **`prompt`**            |                `string`                 |                           |
| **`label`**             |                `string`                 |                           |
| **`name`**              |                `string`                 |                           |
| **`selection`**         |                `string`                 |                           |
| **`disabled`**          |              `"disabled"`               |                           |
| **`minimum`**           |                `string`                 |                           |
| **`maximum`**           |                `string`                 |                           |

</div>

### No Slots

### No Events

### Properties

<div class="*:w-full *:table-fixed *:table!">

| Name                             |                          Type                           | Description                         |
| -------------------------------- | :-----------------------------------------------------: | ----------------------------------- |
| **`template`** `readonly`        |                   `DocumentFragment`                    |                                     |
| **`datePickerStyle`** `readonly` |         `"graphical" \| "field" \| "automatic"`         |                                     |
| **`name`** `readonly`            |                        `string`                         | Form participation property         |
| **`value`** `readonly`           |     `{ year: string; month: string; day: string; }`     |                                     |
| **`valueAsDate`** `readonly`     |                     `Date \| null`                      | Returns the value as a Date object. |
| **`minimum`** `readonly`         | `{ year: string; month: string; day: string; } \| null` |                                     |
| **`maximum`** `readonly`         | `{ year: string; month: string; day: string; } \| null` |                                     |

</div>

### Methods

<div class="*:w-full *:table-fixed *:table!">

| Name                    | Returns | Description |
| ----------------------- | :-----: | ----------- |
| **`setValidity`**       | `void`  |             |
| **`setCustomValidity`** | `void`  |             |

</div>

<!-- #endregion post -->
