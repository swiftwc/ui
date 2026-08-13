<!-- #region pre -->

# LabelView

A view that labels items with an icon and a title.

## Declaration

`<label-view></label-view>`

<!-- #endregion pre -->

## Topics

### Creating a label

::::: info Creating a label with a system icon image and a title:
{% demo label-view/demo-full h-30 %}
:::: details View code

::: code-group

```html [HTML]
<label-view system-image="hand-waving"><span>Hello world!</span></label-view>
```

<<< @/public/examples/label-view/demo-full.html{17}

:::
::::
:::::

::::: info Creating a label with an image and a title:
{% demo label-view/demo-full h-30 %}
:::: details View code

::: code-group

```html [HTML]
<label-view>
  <i slot="icon" class="ph ph-duotone ph-hand-waving"></i>
  <span>Hello world!</span>
</label-view>
```

<<< @/public/examples/label-view/demo-full.html{17}

:::
::::
:::::

<!-- #region post -->

## Topics

**Creating a label with an icon image and a title:**

```html
<label-view system-image="hand-tap"><span>Hello</span></label-view>
```

## Relationships

### Conforms To

`HTMLElement`

## Reference

### Slots

<div>

| Name       | Description                                                                   |
| ---------- | ----------------------------------------------------------------------------- |
| _default_  | Place children without a `slot` attribute inside the main block of the label. |
| **`icon`** | Place children with a `slot="icon"` attribute in the icon block of the label. |

</div>

### Events

_This component does not implement any events._

### Properties

_This component does not implement any properties._

### Methods

_This component does not implement any properties._

<!-- #endregion post -->
