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
