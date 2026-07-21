import { I18n } from '../../i18n'
import { Snapshot } from '../../snapshot'
import { default as $ } from './cash'

type ButtonRole = keyof ReturnType<typeof I18n.t<'ButtonRole'>>

function renderPlaceholder(el: HTMLElement, role: string | null, titleKey?: ButtonRole, config?: Record<string, string>) {
  // if (!el.isConnected) return

  // self.requestAnimationFrame(() => {
  //   if (!el.isConnected) return

  const label = el.querySelector(':scope>[slot=placeholder]') ?? el.appendChild($(`<label-view slot="placeholder"></label-view>`, '>1'))

  switch (role) {
    case 'cancel':
      label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Cancel)
      label.setAttribute('system-image', config!['cancel-button-icon'])

      break
    case 'close':
      if (label.closest('[is=alert-dialog]')) {
        label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').OK)
      } else {
        label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Close)
        label.setAttribute('system-image', config!['close-button-icon'])
      }

      break
    case 'confirm':
      label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Confirm)
      label.setAttribute('system-image', config!['confirm-button-icon'])

      break
    case 'confirmation-action':
      label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Confirm)
      label.setAttribute('system-image', config!['confirm-button-icon'])

      break
    case 'cancellation-action':
      label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Cancel)
      label.setAttribute('system-image', config!['cancel-button-icon'])

      break
    case 'destructive':
      label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Destructive)
      label.setAttribute('system-image', config!['delete-button-icon'])

      break
    default:
      label?.remove()

      break
  }

  // if (role) {
  //   label.setAttribute('title', I18n.t('ButtonRole').Default.Destructive)
  // } else label?.remove()
  // })
}

export default function (target: HTMLElement | null, role: string | null, titleKey?: string | null, config?: Record<string, string>) {
  if (!target) return

  const overiderTitle = typeof titleKey === 'string' && titleKey in I18n.t('ButtonRole') ? (titleKey as ButtonRole) : undefined

  renderPlaceholder(target, role, overiderTitle)

  // CleanupRegistry.unregister(target, 'i18n')

  // CleanupRegistry.register(target, onoff('localechange', () => renderPlaceholder(target, role, overiderTitle), I18n.on).on(), 'i18n')
}
