// [!code ++]
import { alert } from '@swiftwc/ui/client'

document.addEventListener('click', async (evt       ) => {
  if (!(evt.target instanceof HTMLElement)) return

  if (!evt.target.closest('button')) return

  await self.customElements.whenDefined('borderless-button')

  // [!code ++]
  void alert('hello', 'world')
})
