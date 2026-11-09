import { defineTemplate } from './-types.mts';

// Paths that survive the full purge before each run.
const keep: string[] = [
    // e.g. 'public/favicon.svg'
]

// Scaffold. `{name}` is replaced by the template name. Runs inside an empty temp dir.
const scaffold = 'npx ng new angular-app --style=tailwind --ssr=false --ai-config=none --skip-git --defaults'

// Installs (inside the template).
const install = [
    'npm i @swiftwc/ui@canary @phosphor-icons/web @fontsource-variable/inter --no-package-lock --ignore-scripts',
]

// Paths to delete (relative to the template).
const deletes:string[] = ['package-lock.json', '.git'];

// Files to write (relative path -> content).
const files: Record<string, string> = {
  'src/styles.css': `/* You can add global styles to this file, and also import other style files */

@layer base, sw, components, utilities, theme;

@import 'tailwindcss';
@import '@fontsource-variable/inter';
@import '@phosphor-icons/web/bold';
@import '@phosphor-icons/web/duotone';
@import '@phosphor-icons/web/fill';
@import '@phosphor-icons/web/light';
@import '@phosphor-icons/web/regular';
@import '@phosphor-icons/web/thin';
@import '@swiftwc/ui/css';`,

  'src/app/app.routes.ts': `import { Routes } from '@angular/router'
import { AboutComponent } from './about.component'

export const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
  },
]`,

  'src/app/app.html': `<v-keyboard system-font="Inter"></v-keyboard>

<navigation-stack>
  <scroll-view>
    <v-stack>
      <button is="borderless-button" type="button">
        <label-view title="Hello world" system-image="hand-waving" (click)="handleClick($event)"></label-view>
      </button>
    </v-stack>
  </scroll-view>
  <router-outlet />
</navigation-stack>`,

    'src/app/app.ts': `import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { startViewTransition } from '@swiftwc/ui/client'
import { Router } from '@angular/router'

@Component({
  imports: [RouterOutlet],
  selector: 'body',
  styleUrl: './app.css',
  templateUrl: './app.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class App {
  protected readonly title = signal('about-me')

  constructor(private router: Router) {}

  async handleClick(event: Event) {
    await startViewTransition(event.target as HTMLElement, 'forwards', async () => {
      await this.router.navigate(['/about'])
    })
  }
}`,

    'src/app/about.component.ts': `import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core'
import { Router } from '@angular/router'
import { startViewTransition } from '@swiftwc/ui/client'

const greetings = ['Hello', 'Hola', 'Bonjour', 'Ciao', 'Γειά σου', 'こんにちは']
let next = 0

@Component({
  selector: 'content-view',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <scroll-view>
      <v-stack>
        <label-view [attr.title]="greeting" font="title" class="font-semibold"></label-view>
      </v-stack>
    </scroll-view>
    <tool-bar>
      <tool-bar-item slot="top-bar-leading">
        <button type="button" tabindex="0" help="Back" (click)="handleClick($event)">
          <label-view system-image="caret-left"></label-view>
        </button>
      </tool-bar-item>
    </tool-bar>
  \`,
})
export class AboutComponent {
  greeting = greetings[next++ % greetings.length]

  constructor(private router: Router) {}

  async handleClick(event: Event) {
    await startViewTransition(event.target as HTMLElement, 'backwards', async () => {
      await this.router.navigate(['/'])
    })
  }
}`,
}

// Scripts registered in package.json, then run with `npm run` (not npx).
const scripts: Record<string, string> = {
  
}
// Runs before the build, so the budget bump is in place when `ng build` checks it
// (replacements only apply after a successful build, which the 1MB budget would block).
const lintAndFormat:string[] = [
    `node -e "const fs=require('fs');fs.writeFileSync('angular.json',fs.readFileSync('angular.json','utf8').replace('\\"maximumError\\": \\"1MB\\"','\\"maximumError\\": \\"4MB\\"'))"`,
]

// Build check. If this fails, the template is left as-is and no replacements are applied.
const build = 'npm run build'

// Replacements, applied only after a successful build.
//    file (relative to the template) -> [[search, replacement], ...]; search is a string (all) or RegExp.
const replacements: Record<string, [string | RegExp, string][]> = {
    'src/main.ts': [
        [/^/, `import '@swiftwc/ui/client';
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
