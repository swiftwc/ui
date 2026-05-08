# Editor Setup

Tooling to improve the developer experience when working with SwictWC.

## IntelliSense for VS Code

:::: info Modify `.vscode/settings.json` of your VSCode like this:

::::tabs key:theme

== 🇺🇸

```json [settings.json]
{
  // [!code ++]
  "html.customData": ["./packages/ui/web-components.html-data/en.json"]
}
```

::::

## Linting

Highlighting errors and potential bugs in your HTML markup.

### Choose Your Framework

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: '/manual.svg',
    org: 'Manual',
    orgLink: '/installation/editor-setup/manual',
  },
  {
    avatar: '/ember.svg',
    org: 'Ember.js',
    orgLink: '/installation/editor-setup/emberjs',
  },
]
</script>

<VPTeamMembers size="small" :members />
