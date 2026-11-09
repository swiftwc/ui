import { defineTemplate } from './-types.mts';

// Paths that survive the full purge before each run.
const keep: string[] = [
    // e.g. 'public/favicon.svg'
]

// Scaffold. `{name}` is replaced by the template name. Runs inside an empty temp dir.
const scaffold = 'npx ember-cli new ember-app --typescript --no-welcome --skip-git --skip-npm'

// Installs (inside the template).
const install = [
    'npm i -D @swiftwc/ui@canary @phosphor-icons/web @fontsource-variable/inter --no-package-lock --ignore-scripts',
    'npm i -D tailwindcss @tailwindcss/vite --no-package-lock --ignore-scripts',
]

// Paths to delete (relative to the template).
const deletes:string[] = ['package-lock.json', '.git'];

// Files to write (relative path -> content).
const files: Record<string, string> = {
  'vite.config.mjs': `import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    classicEmberSupport(),
    ember(),
    // extra plugins here
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
});
`,
  'types/global.d.ts': `declare module '@swiftwc/ui/css' {}
declare module '@phosphor-icons/web/*' {}
declare module '*.css' {}
declare module '*.scss' {}
`,
  'app/styles/app.css': `/* Ember supports plain CSS out of the box. More info: https://cli.emberjs.com/release/advanced-use/stylesheets/ */
@layer base, sw, components, utilities, theme;

@import "tailwindcss";
@import "@swiftwc/ui/css";
`,
  '.stylelintrc.mjs': `export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'import-notation': 'string',
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'theme',
          'source',
          'utility',
          'variant',
          'custom-variant',
          'plugin',
          'config',
          'apply',
        ],
      },
    ],
  },
};

`,
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

  handleClick = async ({target}: Event) => {
    if (!(target instanceof HTMLElement)) return;

    await startViewTransition(target, 'forwards', async () => {
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
             tabindex="0"
            {{on "click" this.handleClick}}
          >
          <label-view title="Say hello" system-image="hand-waving"></label-view>  
          </button>
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

  handleClick = async ({target}: Event) => {
    if (!(target instanceof HTMLElement)) return;

    await startViewTransition(target, 'backwards', async () => {
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
            font="title"
            class="font-semibold"
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
    'index.html': [
        [`/@embroider/virtual/app.css`, `/app/styles/app.css`],
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
