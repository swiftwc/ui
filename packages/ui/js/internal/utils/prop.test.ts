import { beforeEach, describe, expect, it } from 'vitest'
import { default as prop } from './prop'

describe('prop', () => {
  let div: HTMLDivElement

  beforeEach(() => {
    div = document.createElement('div')
  })

  const p = '--prop',
    v = '1rem'

  for (const [desc, [pre, what, imp, toBe]] of new Map([
    ['set', [, v, , `${p}: ${v};`]],
    ['set incorrect style', [`${p}:   ${v}    `, v, , `${p}:   ${v}    `]],
    ['enforce unimportant', [`${p}: ${v} !important;`, v, , `${p}: ${v};`]],
    ['enforce important', [`${p}: ${v};`, v, 'important', `${p}: ${v} !important;`]],
    // ['enforce ImPoRtAnT', [`${p}: ${v};`, v, 'ImPoRtAnT', `${p}: ${v} !important;`]],
    ['unset (null)', [`${p}: ${v};`, null, , null]],
    ['unset ("")', [`${p}: ${v};`, '', , null]],
    ['unset (undefined)', [`${p}: ${v};`, , , null]],
  ])) {
    it(desc, () => {
      if (pre) div.setAttribute('style', pre)

      // @ts-expect-error
      prop(p, what!, div, imp)

      expect(div.getAttribute('style')).toBe(toBe)
    })
  }
})

// test('adds 1 + 2 to equal 3', () => {
//   expect(prop(1, 2)).toBe(3)
// })
