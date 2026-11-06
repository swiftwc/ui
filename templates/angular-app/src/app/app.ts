import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core'
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
}