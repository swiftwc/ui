import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core'
import { Router } from '@angular/router'
import { startViewTransition } from '@swiftwc/ui/client'

const greetings = ['Hello', 'Hola', 'Bonjour', 'Ciao', 'Γειά σου', 'こんにちは']
let next = 0

@Component({
  selector: 'content-view',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
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
  `,
})
export class AboutComponent {
  greeting = greetings[next++ % greetings.length]

  constructor(private router: Router) {}

  async handleClick(event: Event) {
    await startViewTransition(event.target as HTMLElement, 'backwards', async () => {
      await this.router.navigate(['/'])
    })
  }
}