import { I18n } from '../../i18n'
import { Snapshot } from '../../snapshot'
import { CleanupRegistry } from '../class/cleanup-registry'
import { default as $ } from './cash'
import onoff from './onoff'

type ButtonRole = keyof ReturnType<typeof I18n.t<'ButtonRole'>>

const observing = new WeakMap<WeakKey, MutationObserver>()

function ensurePlaceholder(el: HTMLElement, role: string | null, titleKey?: ButtonRole) {
  // if (!el.isConnected) return

  // self.requestAnimationFrame(() => {
  //   if (!el.isConnected) return

  const label = el.querySelector(':scope>[slot=placeholder]') ?? el.appendChild($(`<label-view slot="placeholder"></label-view>`, '>1'))

  switch (role) {
    case 'cancel':
      label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Cancel)
      label.setAttribute('system-image', Snapshot.config!['cancel-button-icon'])

      break
    case 'close':
      if (label.closest('[is=alert-dialog]')) {
        label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').OK)
      } else {
        label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Close)
        label.setAttribute('system-image', Snapshot.config!['close-button-icon'])
      }

      break
    case 'confirm':
      label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Confirm)
      label.setAttribute('system-image', Snapshot.config!['confirm-button-icon'])

      break
    case 'confirmation-action':
      label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Confirm)
      label.setAttribute('system-image', Snapshot.config!['confirm-button-icon'])

      break
    case 'cancellation-action':
      label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Cancel)
      label.setAttribute('system-image', Snapshot.config!['cancel-button-icon'])

      break
    case 'destructive':
      label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Destructive)
      label.setAttribute('system-image', Snapshot.config!['delete-button-icon'])

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

export default function (host: HTMLElement, target: HTMLElement, role: string | null, titleKey?: string | null) {
  const overiderTitle = typeof titleKey === 'string' && titleKey in I18n.t('ButtonRole') ? (titleKey as ButtonRole) : undefined

  ensurePlaceholder(target, role, overiderTitle)

  if (observing.has(host)) observing.get(host)?.disconnect()

  CleanupRegistry.unregister(target, 'i18n')

  CleanupRegistry.register(target, onoff('localechange', () => ensurePlaceholder(target, role, overiderTitle), I18n.on).on(), 'i18n')

  observing.set(host, new MutationObserver(() => ensurePlaceholder(target, role, overiderTitle)))

  observing.get(host)?.observe(host, {
    childList: true,
  })
}
