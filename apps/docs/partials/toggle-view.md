## Overview

You create a toggle by providing an `is-on` attribute and a `label` attribute.

::::: info &nbsp;

{% demo toggle-view/demo-full h-30 %}

:::: details View code {open .mt-0! .rounded-t-none!}

::: code-group

```html [HTML]
<toggle-view is-on>
  <label-view slot="label" title="Vibrate on Ring" system-image="vibrate"></label-view>
  <label-view slot="label" title="Enable vibration when the phone rings"></label-view>
</toggle-view>
```

<<< @/public/examples/toggle-view/demo-full.html#html{17-20}

:::

::::
:::::
