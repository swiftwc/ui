# App HTML Layout

First thing we should do for our App is to create index.html file with app's skeleton. Let's look at basic app layout:

```html{4}
<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="path/to/styles.css" />
    <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="manifest" href="manifest.webmanifest" />
    <title>My App</title>
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

    <script type="module" src="path/to/swiftwc-ui/client.js"></script>
    <script type="module" src="path/to/my-app.js"></script>
  </body>
</html>
```