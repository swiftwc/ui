<!-- #region pre -->

# ToggleView

###### A control that switches between on and off states.

`<form is="toggle-view"></form>`

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

### Events

<div>

| Name                | Description              |
| ------------------- | ------------------------ |
| **`toggle:change`** | User toggled the control |

</div>

### Properties

<div class="*:w-full *:table-fixed *:table!">

| Name                         |          Type          | Description                 |
| ---------------------------- | :--------------------: | --------------------------- |
| **`toggleStyle`** `readonly` | `"button" \| "switch"` |                             |
| **`isOn`**                   |       `boolean`        |                             |
| **`name`** `readonly`        |        `string`        | Form participation property |
| **`value`**                  |    `string \| null`    |                             |

</div>

### Methods

<div class="*:w-full *:table-fixed *:table!">

| Name                    | Returns | Description |
| ----------------------- | :-----: | ----------- |
| **`setValidity`**       | `void`  |             |
| **`setCustomValidity`** | `void`  |             |

</div>

<!-- #endregion post -->
