import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core'
import { Router } from '@angular/router'
import { startViewTransition } from '@swiftwc/ui/client'

@Component({
  selector: 'content-view',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <scroll-view>
      <v-stack>
        <button is="borderless-button" type="button">Back</button>
      </v-stack>
    </scroll-view>
    <tool-bar>
      <tool-bar-item slot="top-bar-leading">
        <button type="button" tabindex="0" (click)="handleClick($event)">
          <label-view system-image="caret-left"></label-view>
        </button>
      </tool-bar-item>
    </tool-bar>
  `,
})
export class AboutComponent {
  constructor(private router: Router) {}

  async handleClick(event: Event) {
    await startViewTransition(event.target as HTMLElement, 'backwards', async () => {
      await this.router.navigate(['/'])
    })
  }
}
