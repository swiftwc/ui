# JavaScript

This library is published as an ES module and must be loaded using `<script type="module">`.

:::: info `type="module"` attribute is required

::: code-group

```html{6} [app.html]
<!doctype html>
<html lang="en" dir="ltr">
  <head></head>
  <body>
    <!-- [!code focus] -->
    <script type="module" src="https://unpkg.com/@swiftwc/ui/client"></script>
  </body>
</html>
```

```html{6} [app.html]
<!doctype html>
<html lang="en" dir="ltr">
  <head></head>
  <body>
     <!-- [!code focus] -->
    <script type="module" src="path/to/app.js">
     // [!code focus]
      import {client} from 'https://unpkg.com/@swiftwc/ui/client';
      // [!code focus]
      // rest of your app code here 👇🏻
      // [!code focus]
    </script>
  </body>
</html>
```

:::

::::
