import { I18n } from '../../i18n'
import { CleanupRegistry } from '../class/cleanup-registry'
import { default as $ } from './cash'
import onoff from './onoff'

function renderPlaceholder(el: HTMLElement, role: string | null) {
  const label = el.querySelector(':scope>[slot=placeholder]') ?? el.appendChild($(`<label-view system-image="magnifying-glass" slot="placeholder"></label-view>`, '>1'))

  if (role) {
    label.setAttribute('title', I18n.t('ButtonRole').Default.Destructive)
  } else label?.remove()
}

export default function (target: HTMLElement, attributeName: string | null) {
  renderPlaceholder(target, target.getAttribute(attributeName ?? ''))

  CleanupRegistry.unregister(target, 'i18n')

  CleanupRegistry.register(
    target,
    onoff(
      'localechange',
      () => {
        renderPlaceholder(target, target.getAttribute(attributeName ?? ''))
      },
      I18n.on
    ).on(),
    'i18n'
  )
}
