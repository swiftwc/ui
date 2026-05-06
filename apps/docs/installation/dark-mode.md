# Dark Mode

Add dark mode support to your web app.

## Override Device Settings

By default, SwiftWC components respect the `prefers-color-scheme` device preference.

**To override the color scheme, add the `<color-scheme>` tag inside the `<body>` like this:**

::: code-group

```html [☾]
<!doctype html>
<html lang="en" dir="ltr">
  <head></head>
  <body>
    <v-keyboard></v-keyboard>
    <!-- [!code focus] -->
    <!-- [!code ++] -->
    <color-scheme dark></color-scheme>
  </body>
</html>
```

```html [☀️]
<!doctype html>
<html lang="en" dir="ltr">
  <head></head>
  <body>
    <v-keyboard></v-keyboard>
    <!-- [!code focus] -->
    <!-- [!code ++] -->
    <color-scheme light></color-scheme>
  </body>
</html>
```

:::
