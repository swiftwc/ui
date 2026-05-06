# App HTML Layout

All SwiftWC apps require this minimal HTML structure:

::: code-group

```html{3,10} [app.html]
<!doctype html>
<!-- [!code focus] -->
<html lang="en" dir="ltr">
  <head>
  </head>
  <body>
    <!-- [!code focus] -->
    <!-- [!code ++] -->
    <v-keyboard></v-keyboard>
  </body>
</html>
```

:::

::: details `lang` and `dir` attributes are required
Use them to adapt component formatting preferences and view-transitions direction.

```html
<!-- Must be set on the HTML tag -->
<html lang="en" dir="ltr"></html>
```

:::

::: details `VKEYBOARD` tag is required
It is used to handle the virtual keyboard on touch devices.

```html
<body>
  <!-- Must be placed inside the BODY tag -->
  <v-keyboard></v-keyboard>
</body>
```

:::
