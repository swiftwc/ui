# Building layouts with stack views

## Position views with alignment and spacer views

<div class="relative grid gap-10">

:::: info By default safe center

<div class="h-[50vh] min-h-30 rounded-xl grid grid-cols-2 gap-4">

<div>
<iframe src="/examples/view-stacks/a.html" frameborder="0" loading="lazy" class="rounded-xl h-60 w-full pointer-events-none"></iframe>

```js
// your code snippet here
function example() {
  return "hello world";
}
```

</div>

<div>
<iframe src="/examples/view-stacks/a.html" frameborder="0" loading="lazy" class="rounded-xl h-60 w-full pointer-events-none"></iframe>

```js
// your code snippet here
function example() {
  return "hello world";
}
```

</div>

</div>

::::

<!-- <<< @/snippets/stacks/a.html -->

<!-- dd -->

</div>

<div style="display:grid; column-gap:3rem; row-gap:0.25rem; grid-template-columns:repeat(2,minmax(0,1fr)); min-height:3000px;">

<div style="position:relative;">

<div style="background: blue; position: sticky; top: 6rem; z-index: 1;">

## {% icon rows-plus-bottom %} v-stack

</div>
<div style="background: red; position: sticky; top: 10rem; height: calc(70vh - 6rem); min-height: 20rem;">
This content grows to fill available space.

<iframe src="/examples/view-stacks/a.html"></iframe>

</div>

</div>

<div style="background: red; position: sticky; top: 6rem; height: calc(70vh - 6rem); min-height: 20rem;">

## {% icon columns-plus-right %} h-stack

This content takes its natural width.

</div>

</div>
