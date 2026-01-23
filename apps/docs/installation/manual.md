# Manual Installation

Add dependencies to your project manually.

## Add styles and scripts

You can now start adding components to your project.

```html{4,7}
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="https://unpkg.com/@swiftwc/ui/css" />
  </head>
  <body>
    <script type="module" src="https://unpkg.com/@swiftwc/ui/client"></script>
  </body>
</html>
```


## That's it

You can now start adding components to your project.

```html{7-15}
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="https://unpkg.com/@swiftwc/ui/css" />
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