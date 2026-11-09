### Prioritize CSS layers

SwiftWC puts all its styles inside a CSS cascade layer named `sw`. If you use other libraries, you must prepend a `@layer` rule before any stylesheet and define the order of all the layers in your app.

**For example, with [Tailwind CSS](https://tailwindcss.com/docs/adding-custom-styles#using-custom-css) the correct order is this:**
