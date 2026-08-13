<!-- #region pre -->

# TabView

## Declaration

`<tab-view></tab-view>`

<!-- #endregion pre -->

<!-- #region post -->

## Relationships

### Conforms To

`HTMLElement`

## Reference

### Slots

_This component does not implement any slotted content._

### Events

<div>

| Name                                              | Description     |
| ------------------------------------------------- | --------------- |
| **`tabshow`**                                     | A Tab is shown  |
| **`tabhide`**                                     | A Tab is hidden |
| **`tab-view:toggle`**                             |                 |
| **`tab-view:adaptable-tab-bar-placement-change`** |                 |

</div>

### Properties

<div class="*:w-full *:table-fixed *:table!">

| Name                             |                                Type                                 | Description |
| -------------------------------- | :-----------------------------------------------------------------: | ----------- |
| **`tabBarPlacement`** `readonly` | `"bottom-bar" \| "ornament" \| "sidebar" \| "top-bar" \| undefined` |             |
| **`moreTab`** `readonly`         |                      `NavigationStack \| null`                      |             |
| **`selectedTab`**                |            `(NavigationSplitView \| NavigationStack)[]`             |             |

</div>

### Methods

<div class="*:w-full *:table-fixed *:table!">

| Name | Returns | Description |
| ---- | :-----: | ----------- |

</div>

<!-- #endregion post -->
