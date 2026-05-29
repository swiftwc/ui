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
    <v-keyboard system-font="Inter"></v-keyboard>
  </body>
</html>
```

::: details `lang` and `dir` attributes are required on the HTML tag
Use them to adapt component formatting preferences and view-transitions direction.

```html{2}
<html lang="en" dir="ltr">
  <head></head>
  <body></body>
</html>
```

:::

::: details `<v-keyboard>` tag is required inside the BODY tag
It is used to handle the virtual keyboard on touch devices.

```html{1,4}
<body>
  <v-keyboard system-font="Inter"></v-keyboard>
</body>
```

:::
