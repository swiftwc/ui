<!-- #region pre -->

# LabelView

###### A view that labels items with an icon and a title.

`<label-view></label-view>`

<!-- #endregion pre -->

## Overview

One of the most familiar UI patterns is pairing an icon with a label.

::::: info &nbsp;
{% demo label-view/demo-full h-30 %}
:::: details View code {open .mt-0! .rounded-t-none!}

::: code-group

```html [HTML]
<label-view><span>Hello world!</span></label-view>
```

<<< @/public/examples/label-view/demo-full.html{17}

:::
::::
:::::

<!-- #region post -->

## Topics

**Creating a label using a `span` element:**

```html
<label-view><span>Hello world!</span></label-view>
```

**Creating a label using the `title` attribute:**

```html
<label-view title="Hello world!"></label-view>
```

**Creating a label with an icon and a title using the `system-image` attribute:**

```html
<label-view system-image="hand-waving"><span>Hello world!</span></label-view>
```

**Creating a label with an icon and a title using the `icon` slot:**

```html
<label-view>
  <i slot="icon" class="ph ph-duotone ph-hand-waving"></i>
  <span>Hello world!</span>
</label-view>
```

## Relationships

### Conforms To

`HTMLElement`

## Reference

### Attributes

<div class="*:w-full *:table-fixed *:table!">

| Name                  |                           Type                           | Description                                  |
| --------------------- | :------------------------------------------------------: | -------------------------------------------- |
| **`font`**            | [`Font`](/installation/editor-setup/html-data.json#font) | Sets the default font for text in this view. |
| **`system-image`**    |                         `string`                         |                                              |
| **`title`**           |                         `string`                         |                                              |
| **`line-limit`**      |                         `string`                         |                                              |
| **`truncation-mode`** |                         `"tail"`                         |                                              |

</div>

### Slots

<div>

| Name       | Description                                                            |
| ---------- | ---------------------------------------------------------------------- |
| _default_  | Any children without a `slot` attribute are placed in the title block. |
| **`icon`** | Use the `slot="icon"` attribute to place childen in the icon block.    |

</div>

### No Events

### No Properties

### No Methods

<!-- #endregion post -->
