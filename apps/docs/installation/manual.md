# Manual Installation

Add dependencies to your project manually.

## Add styles

```html{4}
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="https://unpkg.com/@swiftwc/ui/styles.css" />
  </head>
</html>
```

## Add script

```html{4}
<!doctype html>
<html>
  <body>
    <script type="module" src="https://unpkg.com/@swiftwc/ui/client"></script>
  </body>
</html>
```

## Add VKeyboard component

```html{4}
<!doctype html>
<html>
  <body>
    <v-keyboard></v-keyboard>
  </body>
</html>
```

## That's it

You can now start adding components to your project.

```html{4}
<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <link rel="preconnect" href="https://unpkg.com/" />
    <link rel="preconnect" href="https://rsms.me/" />
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
    <link rel="stylesheet" href="https://unpkg.com/@swiftwc/ui/styles.css" />
    <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="manifest" href="manifest.webmanifest" />
    <title>hello-world</title>
  </head>
  <body>
    <v-keyboard></v-keyboard>

    <navigation-stack>
      <scroll-view>
        <v-stack>
          <button is="borderless-button" type="button">Hello world</button>
        </v-stack>
      </scroll-view>
    </navigation-stack>

    <script type="module" src="https://unpkg.com/@swiftwc/ui/client"></script>
  </body>
</html>
```