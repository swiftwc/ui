import "./style.scss"
import { startViewTransition } from "@swiftwc/ui/client"
import "@phosphor-icons/web/bold"
import "@phosphor-icons/web/duotone"
import "@phosphor-icons/web/fill"
import "@phosphor-icons/web/light"
import "@phosphor-icons/web/regular"
import "@phosphor-icons/web/thin"

const detailView = document.querySelector<HTMLTemplateElement>("#detail-view")!

document.addEventListener("click", async ({ target }: Event) => {
  if (!(target instanceof HTMLElement)) return

  if (target.closest("tool-bar-item")) {
    await startViewTransition(target as HTMLElement, "backwards", async () => {
      document.querySelector<HTMLDivElement>("content-view")?.remove()
    })
  } else if (target.closest("button")) {
    await startViewTransition(target as HTMLElement, "forwards", async () => {
      document
        .querySelector("navigation-stack")
        ?.append(detailView.content.cloneNode(true))
    })
  }
})
