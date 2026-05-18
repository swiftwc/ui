import { I18n } from '../../i18n'
import { Snapshot } from '../../snapshot'
import { CleanupRegistry } from '../class/cleanup-registry'
import { default as $ } from './cash'
import onoff from './onoff'

function renderPlaceholder(el: HTMLElement, role: string | null) {
  const label = el.querySelector(':scope>[slot=placeholder]') ?? el.appendChild($(`<label-view slot="placeholder"></label-view>`, '>1'))

  switch (role) {
    case 'cancel':
      label.setAttribute('title', I18n.t('ButtonRole').Default.Cancel)
      label.setAttribute('system-image', Snapshot.config!['cancel-button-icon'])

      break
    case 'close':
      label.setAttribute('title', I18n.t('ButtonRole').Default.Close)
      label.setAttribute('system-image', Snapshot.config!['close-button-icon'])

      break
    case 'confirm':
      label.setAttribute('title', I18n.t('ButtonRole').Default.Confirm)
      label.setAttribute('system-image', Snapshot.config!['confirm-button-icon'])

      break
    case 'destructive':
      label.setAttribute('title', I18n.t('ButtonRole').Default.Destructive)
      label.setAttribute('system-image', Snapshot.config!['delete-button-icon'])

      break
    default:
      label?.remove()

      break
  }

  // if (role) {
  //   label.setAttribute('title', I18n.t('ButtonRole').Default.Destructive)
  // } else label?.remove()
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
