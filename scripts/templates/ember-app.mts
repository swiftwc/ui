import { defineTemplate } from './-types.mts';

// Paths that survive the full purge before each run.
const keep: string[] = [
    // e.g. 'public/favicon.svg'
]

// Scaffold. `{name}` is replaced by the template name. Runs inside an empty temp dir.
const scaffold = 'npx ember-cli new ember-app --typescript --no-welcome --skip-git --skip-npm'

// Installs (inside the template).
const install = [
    'npm i @swiftwc/ui@canary @phosphor-icons/web @fontsource/inter --no-package-lock --ignore-scripts',
]

// Paths to delete (relative to the template).
const deletes:string[] = ['package-lock.json', '.git'];

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
});`,
    'app/templates/application.gts': `import { pageTitle } from 'ember-page-title';
import Component from '@glimmer/component';
import { startViewTransition } from '@swiftwc/ui/client';
import { type Registry as Services, service } from '@ember/service';
import { on } from '@ember/modifier';
import { scheduleOnce } from '@ember/runloop';

interface S {
  Args: Record<string, never>;
}

export default class extends Component<S> {
  @service declare router: Services['router'];

  handleClick = async (event: Event) => {
    await startViewTransition(event.target, 'forwards', async () => {
      await this.router.transitionTo('about');

      const { promise, resolve } = Promise.withResolvers<void>();

      // eslint-disable-next-line
      scheduleOnce('afterRender', resolve);

      await promise;
    });
  };

  <template>
    {{pageTitle "EmberApp"}}

    <v-keyboard system-font="Inter"></v-keyboard>

    <navigation-stack>
      <scroll-view>
        <v-stack>
          <button
            is="borderless-button"
            type="button"
            {{on "click" this.handleClick}}
          >About</button>
        </v-stack>
      </scroll-view>

      {{outlet}}
    </navigation-stack>
  </template>
}`,

    'app/templates/about.gts': `import { pageTitle } from 'ember-page-title';
import { startViewTransition } from '@swiftwc/ui/client';
import { type Registry as Services, service } from '@ember/service';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';

const greetings = [
  'Hello',
  'Hola',
  'Bonjour',
  'Ciao',
  'Γειά σου',
  'こんにちは',
];
let next = 0;

interface S {
  Args: Record<string, never>;
}

export default class extends Component<S> {
  @service declare router: Services['router'];

  greeting = greetings[next++ % greetings.length];

  handleClick = async (event: Event) => {
    await startViewTransition(event.target, 'backwards', async () => {
      await this.router.transitionTo('/');
    });
  };

  <template>
    {{pageTitle "About"}}

    <content-view>
      <scroll-view>
        <v-stack>
          <label-view
            title={{this.greeting}}
            system-image="hand-waving"
          ></label-view>
        </v-stack>
      </scroll-view>
      {{outlet}}
      <tool-bar>
        <tool-bar-item slot="top-bar-leading">
          <button
            type="button"
            tabindex="0"
            help="Back"
            {{on "click" this.handleClick}}
          >
            <label-view system-image="caret-left"></label-view>
          </button>
        </tool-bar-item>
      </tool-bar>
    </content-view>
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
    'app/app.ts': [
        [/^/, `import '@swiftwc/ui/css';
import '@fontsource-variable/inter';
import '@swiftwc/ui/client';
import '@phosphor-icons/web/bold';
import '@phosphor-icons/web/duotone';
import '@phosphor-icons/web/fill';
import '@phosphor-icons/web/light';
import '@phosphor-icons/web/regular';
import '@phosphor-icons/web/thin';
`],
    ],
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
