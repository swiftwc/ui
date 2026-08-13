<!-- #region pre -->

# BorderlessButton

A control that starts an action. Styled without any borders.

## Declaration

`<button is="borderless-button"></button>`

<!-- #endregion pre -->

## Topics

### Creating a borderless button

::::: info Use the `is` attribute to style a `button` as a `borderless-button`:

{% demo borderless-button/demo-full h-60 %}

:::: details View code

::: code-group

```html [HTML]
<button is="borderless-button" type="button">
  <label-view title="Hello world!" system-image="hand-waving"></label-view>
</button>
```

<<< @/public/examples/borderless-button/demo-full.html#html{30-32}

:::

::::
:::::

<!-- #region post -->

## Topics

**Creating a borderless button:**

```html
<button is="borderless-button">
  <label-view system-image="hand-tap" title="Tap Me"></label-view>
</button>
```

## Relationships

### Conforms To

`HTMLButtonElement`

## Reference

### Slots

<div>

| Name          | Description |
| ------------- | ----------- |
| **`overlay`** |             |

</div>

### Events

_This component does not implement any events._

### Properties

_This component does not implement any properties._

### Methods

_This component does not implement any properties._

<!-- #endregion post -->
