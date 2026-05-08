# App HTML Layout

All SwiftWC apps require this minimal HTML structure:

```html{3} [app.html]
<!doctype html>
<!-- [!code focus] -->
<html lang="en" dir="ltr">
  <head></head>
  <body>
    <!-- [!code focus] -->
    <!-- [!code ++] -->
    <v-keyboard></v-keyboard>
  </body>
</html>
```

::: details `lang` and `dir` attributes are required
Use them to adapt component formatting preferences and view-transitions direction.

```html{2}
<!-- Must be set on the HTML tag -->
<html lang="en" dir="ltr">
  <head></head>
  <body></body>
</html>
```

:::

::: details `<v-keyboard>` tag is required
It is used to handle the virtual keyboard on touch devices.

```html{1,4}
<body>
  <!-- Must be placed inside the BODY tag -->
  <v-keyboard></v-keyboard>
</body>
```

:::
