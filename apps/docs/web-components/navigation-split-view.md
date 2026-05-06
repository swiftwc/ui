<!-- #region pre -->

# NavigationSplitView

This is the description of the class.

<!-- #endregion pre -->

## Overview

You create a navigation split view with two or three columns, and typically use it as the root view inside the body.

**To create a two-column navigation split view, use the :**

```html{3}
<html>
  <body>
    <navigation-split-view>
      <scroll-view>
        <v-stack>
          <button is="borderless-button" type="button">Hello world</button>
        </v-stack>
      </scroll-view>
    </navigation-split-view>
  </body>
</html>
```

## Control column visibility

You can programmatically control the visibility of navigation split view columns.

**The following code updates the first example above to always hide the first column when the view appears:**

```html{3}
<html>
  <body>
    <navigation-split-view column-visibility="double-column">
      <scroll-view>
        <v-stack>
          <button is="borderless-button" type="button">Hello world</button>
        </v-stack>
      </scroll-view>
    </navigation-split-view>
  </body>
</html>
```

## Collapsed split views

At narrow size classes, such as on iPhone or Apple Watch, a navigation split view collapses into a single stack.

**The following code shows the blue detail view when run on iPhone.**

```html{3}
<html>
  <body>
    <navigation-split-view preferred-compact-column="content">
      <scroll-view>
        <v-stack>
          <button is="borderless-button" type="button">Hello world</button>
        </v-stack>
      </scroll-view>
    </navigation-split-view>
  </body>
</html>
```

## Default styling reference

**Here's a complete list of the default colors and their values for reference:**

```css{2}
@layer components {
  navigation-split-view {
    display: grid;
    touch-action: none;
    height: var(--100lvh, 100lvh);
  }
}
```

## Topics

### Adding a sidebar to a navigation split view

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).


<!-- #region post -->

## Relationships

### Conforms To

`NavigationView`

<!-- #endregion post -->