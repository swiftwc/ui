<!-- #region pre -->

# DatePicker

A control for selecting an absolute date.

## Declaration

`<date-picker></date-picker>`

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLFormElement`

## Reference

### Slots

_This component does not implement any slotted content._

### Events

_This component does not implement any events._

### Properties

<div class="*:w-full *:table-fixed *:table!">

| Name                             |                          Type                           | Description                         |
| -------------------------------- | :-----------------------------------------------------: | ----------------------------------- |
| **`template`** `readonly`        |                   `DocumentFragment`                    |                                     |
| **`datePickerStyle`** `readonly` |         `"graphical" \| "field" \| "automatic"`         |                                     |
| **`name`** `readonly`            |          `string Form participation property`           | Form participation property         |
| **`value`** `readonly`           |     `{ year: string; month: string; day: string; }`     |                                     |
| **`valueAsDate`** `readonly`     |   `Date \| null Returns the value as a Date object.`    | Returns the value as a Date object. |
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
