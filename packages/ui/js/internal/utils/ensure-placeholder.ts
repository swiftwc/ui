import { I18n } from '../../i18n'
import { html, queryMorph } from '../../morphdom'

// type ButtonRole = keyof ReturnType<typeof I18n.t<'ButtonRole'>>

// function renderPlaceholder(el: HTMLElement, role: string | null, titleKey?: ButtonRole, config?: Record<string, string>) {
//   // if (!el.isConnected) return

//   // self.requestAnimationFrame(() => {
//   //   if (!el.isConnected) return

//   let title: string | undefined, systemImage: string | undefined

//   // const label = el.querySelector(':scope>[slot=placeholder]') ?? el.appendChild($(`<label-view slot="placeholder"></label-view>`, '>1'))

//   switch (role) {
//     case 'cancel':
//       title = titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Cancel //label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Cancel)
//       systemImage = config?.['cancel-button-icon'] ?? '' //label.setAttribute('system-image', config?.['cancel-button-icon'] ?? '')

//       break
//     case 'close':
//       if (el.closest('[is=alert-dialog]')) {
//         title = titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').OK //.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').OK)
//       } else {
//         title = titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Close //label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Close)
//         systemImage = config?.['close-button-icon'] ?? '' //label.setAttribute('system-image', config?.['close-button-icon'] ?? '')
//       }

//       break
//     case 'confirm':
//       title = titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Confirm //label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Confirm)
//       systemImage = config?.['confirm-button-icon'] ?? '' //label.setAttribute('system-image', config?.['confirm-button-icon'] ?? '')

//       break
//     case 'confirmation-action':
//       title = titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Confirm //label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Confirm)
//       systemImage = config?.['confirm-button-icon'] ?? '' //label.setAttribute('system-image', config?.['confirm-button-icon'] ?? '')

//       break
//     case 'cancellation-action':
//       title = titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Cancel //label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Cancel)
//       systemImage = config?.['cancel-button-icon'] ?? '' //label.setAttribute('system-image', config?.['cancel-button-icon'] ?? '')

//       break
//     case 'destructive':
//       title = titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Destructive // label.setAttribute('title', titleKey && titleKey in I18n.t('ButtonRole') ? I18n.t('ButtonRole')[titleKey] : I18n.t('ButtonRole').Destructive)
//       systemImage = config?.['delete-button-icon'] ?? '' // label.setAttribute('system-image', config?.['delete-button-icon'] ?? '')

//       break
//     // default:
//     //   label?.remove()

//     //   break
//   }

//   queryMorph(
//     '[slot=placeholder]',
//     html`<label-view slot="placeholder">${systemImage ? html`<image-view slot="icon" system-name="${systemImage}"></image-view>` : null}${title ? html`<span>${title}</span>` : null}</label-view>`,
//     el,
//     { removeIf: !title }
//   )

//   // if (role) {
//   //   label.setAttribute('title', I18n.t('ButtonRole').Default.Destructive)
//   // } else label?.remove()
//   // })
// }

export default function (target: HTMLElement | null, role: string | null, titleKey?: string | null, config?: Record<string, string>) {
  if (!target) return

  const overiderTitle = typeof titleKey === 'string' && titleKey in I18n.t('ButtonRole') ? (titleKey as keyof ReturnType<typeof I18n.t<'ButtonRole'>>) : undefined

  // renderPlaceholder(target, role, overiderTitle, config)

  let title: string | undefined, systemImage: string | undefined

  // const label = el.querySelector(':scope>[slot=placeholder]') ?? el.appendChild($(`<label-view slot="placeholder"></label-view>`, '>1'))

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

  // CleanupRegistry.unregister(target, 'i18n')

  // CleanupRegistry.register(target, onoff('localechange', () => renderPlaceholder(target, role, overiderTitle), I18n.on).on(), 'i18n')
}
