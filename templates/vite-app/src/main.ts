import "./style.css"
import { startViewTransition } from "@swiftwc/ui/client"
import "@phosphor-icons/web/bold"
import "@phosphor-icons/web/duotone"
import "@phosphor-icons/web/fill"
import "@phosphor-icons/web/light"
import "@phosphor-icons/web/regular"
import "@phosphor-icons/web/thin"

const greetings = ["Hello", "Hola", "Bonjour", "Ciao", "Γειά σου", "こんにちは"]
let next = 0

const detailView = document.querySelector<HTMLTemplateElement>("#detail-view")!

document.addEventListener("click", async ({ target }: Event) => {
  if (!(target instanceof HTMLElement)) return

  if (target.closest("tool-bar-item")) {
    await startViewTransition(target, "backwards", async () => {
      document.querySelector("content-view")?.remove()
    })
  } else if (target.closest("button")) {
    await startViewTransition(target, "forwards", async () => {
      const view = detailView.content.cloneNode(true) as DocumentFragment
      view
        .querySelector("[data-greeting]")
        ?.setAttribute("title", greetings[next++ % greetings.length])
      document.querySelector("navigation-stack")?.append(view)
    })
  }
})
