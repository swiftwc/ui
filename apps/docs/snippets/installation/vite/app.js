import "@phosphor-icons/web/bold";
import "@phosphor-icons/web/duotone";
import "@phosphor-icons/web/fill";
import "@phosphor-icons/web/light";
import "@phosphor-icons/web/regular";
import "@phosphor-icons/web/thin";
// [!code ++]
import { alert } from "@swiftwc/ui/client";

document.addEventListener("click", async (evt) => {
  if (!(evt.target instanceof HTMLElement)) return;

  if (!evt.target.closest("button")) return;

  await self.customElements.whenDefined("borderless-button");

  void alert("hello", "world");
});
