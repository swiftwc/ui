import { I18n } from '../../i18n'
import { html, queryMorph } from '../../morphdom'

export default function (target: HTMLElement | null, role: string | null, titleKey?: string | null, config?: Record<string, string>) {
  if (!target) return

  const overiderTitle = typeof titleKey === 'string' && titleKey in I18n.t('ButtonRole') ? (titleKey as keyof ReturnType<typeof I18n.t<'ButtonRole'>>) : undefined

  let title: string | undefined, systemImage: string | undefined

  switch (role) {
    case 'cancel':
      title = overiderTitle && overiderTitle in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[overiderTitle] : I18n.t('ButtonRole').Cancel
      systemImage = config?.['cancel-button-icon'] ?? ''

      break
    case 'close':
      if (target.closest('[is=alert-dialog]')) {
        title = overiderTitle && overiderTitle in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[overiderTitle] : I18n.t('ButtonRole').OK
      } else {
        title = overiderTitle && overiderTitle in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[overiderTitle] : I18n.t('ButtonRole').Close
        systemImage = config?.['close-button-icon'] ?? ''
      }

      break
    case 'confirm':
      title = overiderTitle && overiderTitle in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[overiderTitle] : I18n.t('ButtonRole').Confirm
      systemImage = config?.['confirm-button-icon'] ?? ''

      break
    case 'confirmation-action':
      title = overiderTitle && overiderTitle in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[overiderTitle] : I18n.t('ButtonRole').Confirm
      systemImage = config?.['confirm-button-icon'] ?? ''

      break
    case 'cancellation-action':
      title = overiderTitle && overiderTitle in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[overiderTitle] : I18n.t('ButtonRole').Cancel
      systemImage = config?.['cancel-button-icon'] ?? ''

      break
    case 'destructive':
      title = overiderTitle && overiderTitle in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[overiderTitle] : I18n.t('ButtonRole').Destructive
      systemImage = config?.['delete-button-icon'] ?? ''

      break
  }

  queryMorph(
    '[slot=placeholder]',
    html`<label-view slot="placeholder">${systemImage ? html`<image-view slot="icon" system-name="${systemImage}"></image-view>` : null}${title ? html`<span>${title}</span>` : null}</label-view>`,
    target,
    { removeIf: !title }
  )
}
