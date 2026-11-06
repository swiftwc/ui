import { defineTemplate } from './-types.mts';

// Paths that survive the full purge before each run.
const keep: string[] = [
    // e.g. 'public/favicon.svg'
]

// Scaffold. `{name}` is replaced by the template name. Runs inside an empty temp dir.
const scaffold = 'npx ember-cli new ember-app --typescript --no-welcome'

// Installs (inside the template).
const install = [
    'ember install @swiftwc/ui@canary',
]

// Paths to delete (relative to the template).
const deletes:string[] = [];

// Files to write (relative path -> content).
const files: Record<string, string> = {
  'app/router.ts': `import EmberRouter from '@embroider/router';
import config from 'ember-app/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('about')
});
`,
    'templates/application.gts': `import { pageTitle } from 'ember-page-title';

<template>
  {{pageTitle "EmberApp"}}
 
 <v-keyboard></v-keyboard>

  {{outlet}}
</template>`,

    'templates/index.gts': `import { pageTitle } from 'ember-page-title';
import { startViewTransition } from '@swiftwc/ui/client';
import { type Registry as Services, service } from '@ember/service';
import Component from '@glimmer/component'

interface S {
  Args: Record<string, never>
}

export default class extends Component<S> {
  @service declare router: Services['router'];

    handleClick = async (event) => {
    await startViewTransition(event.target, 'forwards', async () => {
        this.router.transitionTo('about');
    });
    }

<template>
  <navigation-stack>
    <scroll-view>
      <v-stack>
        <button is="borderless-button" type="button" {{on "click" this.handleClick}}>About</button>
      </v-stack>
    </scroll-view>
    {{outlet}}
  </navigation-stack>
</template>
}`,
}

// Scripts registered in package.json, then run with `npm run` (not npx).
const scripts: Record<string, string> = {
  
}
const lintAndFormat = ['npm run lint:fix', 'npm run format']

// Build check. If this fails, the template is left as-is and no replacements are applied.
const build = 'npm run build'

// Replacements, applied only after a successful build.
//    file (relative to the template) -> [[search, replacement], ...]; search is a string (all) or RegExp.
const replacements: Record<string, [string | RegExp, string][]> = {
    // 'index.html': [['<title>vite-app</title>', '<title>My App</title>']],
}

// Final package.json edit, applied last.
const editPackageJson = (pkg: Record<string, any>, name: string) => {
    pkg.name = name
    delete pkg.scripts.preview
    for (const field of ['dependencies', 'devDependencies']) {
        for (const dep of Object.keys(pkg[field] ?? {})) {
            if (dep.startsWith('@swiftwc/')) pkg[field][dep] = 'latest'
        }
    }
    return pkg
}

export default defineTemplate({
    keep,
    scaffold,
    install,
    deletes,
    files,
    scripts,
    lintAndFormat,
    build,
    replacements,
    editPackageJson,
})
