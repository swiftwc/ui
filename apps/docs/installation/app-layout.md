# App HTML Layout

First thing we should do for our App is to create index.html file with app's skeleton. Let's look at basic app layout:

::: code-group

<<< @/snippets/hello-world-browser.html [app.html]

```js [manifest.webmanifest]
{
  "name": "My App",
  "display": "standalone"
}
```

<<< @/snippets/sw.js [sw.js]

<<< @/snippets/app.js [app.js]

:::

## Further requirements for build installable PWAs

### `dir` is required. Use it to adapt components and transitions direction.

::: code-group

```html [app.html]
<!doctype html>
<!-- [!code focus] -->
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="stylesheet" href="https://unpkg.com/@swiftwc/ui/css" />
    <link rel="stylesheet" href="path/to/styles.css" />
    <link rel="manifest" href="manifest.webmanifest" />
    <title>My App</title>
  </head>
  <body>
    <v-keyboard></v-keyboard>

    <navigation-stack>
      <scroll-view>
        <v-stack>
          <button is="borderless-button" type="button">Hello world!</button>
        </v-stack>
      </scroll-view>
    </navigation-stack>

    <script type="module" src="https://unpkg.com/@swiftwc/ui/client"></script>
    <script type="module" src="path/to/my-app.js"></script>
  </body>
</html>
```

:::

### Required `head` tags for making app installable.

::: code-group

```html [app.html]
<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <!-- [!code focus] -->
    <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <!-- [!code focus] -->
    <meta name="mobile-web-app-capable" content="yes" />
    <!-- [!code focus] -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <!-- [!code focus] -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="stylesheet" href="https://unpkg.com/@swiftwc/ui/css" />
    <link rel="stylesheet" href="path/to/styles.css" />
    <!-- [!code focus] -->
    <link rel="manifest" href="manifest.webmanifest" />
    <title>My App</title>
  </head>
  <body>
    <v-keyboard></v-keyboard>

    <navigation-stack>
      <scroll-view>
        <v-stack>
          <button is="borderless-button" type="button">Hello world!</button>
        </v-stack>
      </scroll-view>
    </navigation-stack>

    <script type="module" src="https://unpkg.com/@swiftwc/ui/client"></script>
    <script type="module" src="path/to/my-app.js"></script>
  </body>
</html>
```

```js [manifest.webmanifest]
{
  "name": "My App", // [!code focus]
  "display": "standalone" // [!code focus]
}
```

:::

### Required CSS styles

::: code-group

```html [app.html]
<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <!-- [!code focus] -->
    <link rel="stylesheet" href="https://unpkg.com/@swiftwc/ui/css" />
    <link rel="stylesheet" href="path/to/styles.css" />
    <link rel="manifest" href="manifest.webmanifest" />
    <title>My App</title>
  </head>
  <body>
    <v-keyboard></v-keyboard>

    <navigation-stack>
      <scroll-view>
        <v-stack>
          <button is="borderless-button" type="button">Hello world!</button>
        </v-stack>
      </scroll-view>
    </navigation-stack>

    <script type="module" src="https://unpkg.com/@swiftwc/ui/client"></script>
    <script type="module" src="path/to/my-app.js"></script>
  </body>
</html>
```

:::

### Required component for `body` tag.

::: code-group

```html [app.html]
<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="stylesheet" href="https://unpkg.com/@swiftwc/ui/css" />
    <link rel="stylesheet" href="path/to/styles.css" />
    <link rel="manifest" href="manifest.webmanifest" />
    <title>My App</title>
  </head>
  <body>
    <!-- [!code focus] -->
    <v-keyboard></v-keyboard>

    <navigation-stack>
      <scroll-view>
        <v-stack>
          <button is="borderless-button" type="button">Hello world!</button>
        </v-stack>
      </scroll-view>
    </navigation-stack>

    <script type="module" src="https://unpkg.com/@swiftwc/ui/client"></script>
    <script type="module" src="path/to/my-app.js"></script>
  </body>
</html>
```

:::

### Required modules.

::: code-group

```html [app.html]
<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="stylesheet" href="https://unpkg.com/@swiftwc/ui/css" />
    <link rel="stylesheet" href="path/to/styles.css" />
    <link rel="manifest" href="manifest.webmanifest" />
    <title>My App</title>
  </head>
  <body>
    <v-keyboard></v-keyboard>

    <navigation-stack>
      <scroll-view>
        <v-stack>
          <button is="borderless-button" type="button">Hello world!</button>
        </v-stack>
      </scroll-view>
    </navigation-stack>

    <!-- [!code focus] -->
    <script type="module" src="https://unpkg.com/@swiftwc/ui/client"></script>
    <script type="module" src="path/to/my-app.js"></script>
  </body>
</html>
```

:::
