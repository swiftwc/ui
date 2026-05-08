---
prev:
  text: "Installation"
  link: "/installation/"
---

# Install SwiftWC with Vite

How to install dependencies and structure your Vite app.

## 1. Create your project

```bash
npm create vite@latest my-project
cd my-project
```

## 2. Install SwiftWC

:::tabs key:install

== latest

::: code-group

```bash [npm]
npm i -D @swiftwc/ui@latest
```

```bash [bun]
bun add --exact @swiftwc/ui@latest --dev
```

:::

## Import the CSS file

```css{1} [app.css]
@import "@swiftwc/ui/css";
```

## Import the Client file

```ts{1} [main.ts]
import { Snapshot } "@swiftwc/ui/client";
```

## Start your build process

```bash
npm run dev
```

## Start using SwiftWC web components in your HTML

::: code-group

```html{6,13} [index.html]
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="app.css" rel="stylesheet">
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

  <script type="module" src="app.js"></script>
</body>
</html>
```

```js [app.js]
// import { Snapshot } "@swiftwc/ui/client";

document.body.addEventListener("click", async (event) => {
  console.debug(`⚡️ click`);

  if (event.target.tagName === "BUTTON") {
    if (event.target.classList.contains("bw")) {
      const sv = event.target.closest("scroll-view"),
        pr = sv.parentElement;
      await startViewTransition(event.target, "backwards", async () => {
        pr.remove();
      });
    }

    if (event.target.classList.contains("fw")) {
      const sv = event.target.closest("scroll-view"),
        root = sv.closest("navigation-stack,navigation-split-view"),
        lm = sv.parentElement?.matches("[is=sidebar-view]") ? sv.parentElement : sv,
        frame = lm.parentElement;
      await startViewTransition(event.target, "forwards", async () => {
        let position = "afterend",
          lookFor = "nextElementSibling";

        if (!["BODY-VIEW", "DIALOG"].includes(lm[lookFor]?.tagName)) {
          lm.insertAdjacentHTML(
            position,
            `
                  <${6 === root.querySelectorAll("scroll-view").length ? 'dialog is="sheet-view"' : "body-view"}>
                    <scroll-view>
                      <v-stack>
                        ${root.id}section${
                          root.querySelectorAll("scroll-view").length
                        }<button type="button" class="bw">🔙</button><button type="button" class="fw">→</button><p>...</p><p>...</p><form method="dialog"><button type="submit">close</button></form><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><p>...</p><input type="text" /><p>...</p><p>...</p><p>...</p>
                      </v-stack>
                    </scroll-view>
                    <tool-bar>
                      <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0">aaaa${root.querySelectorAll("scroll-view").length}</button></tool-bar-item>
                      <tool-bar-item slot="top-bar-leading"><button type="button" tabindex="0" disabled>dddd${root.querySelectorAll("scroll-view").length}</button></tool-bar-item>
                      <tool-bar-item-group slot="top-bar-leading"><tool-bar-item><button type="button" tabindex="0">gggg${root.querySelectorAll("scroll-view").length}</button></tool-bar-item><tool-bar-item><button type="button" tabindex="0">gggg${root.querySelectorAll("scroll-view").length}</button></tool-bar-item></tool-bar-item-group>
                      <tool-bar-item slot="top-bar-trailing"><input type="search" value="ssssss${root.querySelectorAll("scroll-view").length}"></tool-bar-item>
                    </tool-bar>
                  </${6 === root.querySelectorAll("scroll-view").length ? "dialog" : "body-view"}>
                  `,
          );
          if ("DIALOG" === lm[lookFor]?.tagName) lm[lookFor].showModal();
        }
      });
    }
  }
});
```

:::
