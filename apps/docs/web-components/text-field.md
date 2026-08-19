<!-- #region pre -->

# TextField

###### A control that displays an editable text area.

`<form is="text-field"></form>`

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLFormElement`

## Reference

### Slots

<div>

| Name                   | Description |
| ---------------------- | ----------- |
| **`label`**            |             |
| **`validity-options`** |             |

</div>

### No Events

### Properties

<div class="*:w-full *:table-fixed *:table!">

| Name                                    |                     Type                     | Description                 |
| --------------------------------------- | :------------------------------------------: | --------------------------- |
| **`keyboardType`** `readonly`           | `"decimal-pad" \| "number-pad" \| "default"` |                             |
| **`text`**                              |                   `string`                   |                             |
| **`name`** `readonly`                   |                   `string`                   | Form participation property |
| **`value`** `readonly`                  |                   `string`                   |                             |
| **`valueAsNumber`** `readonly`          |                `number \| ""`                |                             |
| **`negativeNumbersAllowed`** `readonly` |                  `boolean`                   |                             |

</div>

### Methods

<div class="*:w-full *:table-fixed *:table!">

| Name                    | Returns | Description |
| ----------------------- | :-----: | ----------- |
| **`setValidity`**       | `void`  |             |
| **`setCustomValidity`** | `void`  |             |

</div>

<!-- #endregion post -->
