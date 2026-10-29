import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import '../client'
import type { LabeledContent } from './labeled-content'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: LabeledContent

  beforeEach(() => {
    document.body.insertAdjacentHTML('beforeend', '<labeled-content></labeled-content>')
    el = document.body.lastElementChild as LabeledContent
  })
  afterEach(() => el.remove())

  test('[value]', () => {
    el.setAttribute('value', 'Foo')
    expect(el.innerHTML).toBe(`<label-view><span>Foo</span></label-view>`)
  })

  test('[value] w/ dirty', () => {
    el.innerHTML = `<div>\nBar</div><div slot="icon">Baz</div>\n<whatever-name></whatever-name>\n<whatever-name slot="icon"></whatever-name>`
    el.setAttribute('value', 'Foo')
    expect(el.innerHTML).toBe(`<div>\nBar</div><div slot="icon">Baz</div>\n<whatever-name></whatever-name>\n<whatever-name slot="icon"></whatever-name><label-view><span>Foo</span></label-view>`)
  })

  test('[label]', () => {
    el.setAttribute('label', 'Bar')
    expect(el.innerHTML).toBe(`<label-view slot="label"><span>Bar</span></label-view>`)
  })

  test('[value][label]', () => {
    el.setAttribute('value', 'Foo')
    el.setAttribute('label', 'Bar')
    expect(el.innerHTML).toBe(`<label-view><span>Foo</span></label-view><label-view slot="label"><span>Bar</span></label-view>`)
  })

  for (const [i, [a, b, c]] of [
    ['currency:en-US:currency=USD', '1234.5', '$1,234.50'],
    ['percent:en-US', '0.42', '42%'],
    ['unit:en-US:unit=kilometer-per-hour', '50', '50 km/h'],
    ['number:en-US:notation=compact', '1200000', '1.2M'],
    ['date:en-US:dateStyle=full&timeStyle=short', '2026-07-04T14:30:00', 'Saturday, July 4, 2026 at 2:30 PM'],
    ['relative-time:en-US:numeric=auto', '-1~day', 'yesterday'],
    ['list:en-US:style=long&type=conjunction', 'Foo~Bar~Baz', 'Foo, Bar, and Baz'],
    ['region:en-US', 'GR', 'Greece'],
    ['byte-count:en-US:unitDisplay=short', '1024', '1 kB'],
    ['byte-count:en-US:unitDisplay=short', '1536', '1.5 kB'],
    ['byte-count:en-US:unitDisplay=short', '1048576', '1 MB'],
    ['byte-count:en-US:unitDisplay=short', '1073741824', '1 GB'],
    ['byte-count:en-US:unitDisplay=long', '1024', '1 kilobyte'],
    ['byte-count:en-US:unitDisplay=long', '1536', '1.5 kilobytes'],
    ['byte-count:en-US:unitDisplay=long', '1048576', '1 megabyte'],
    ['byte-count:en-US:unitDisplay=long', '1073741824', '1 gigabyte'],
    ['byte-count:en-US:unitDisplay=narrow', '1024', '1kB'],
    ['byte-count:en-US:unitDisplay=narrow', '1536', '1.5kB'],
    ['byte-count:en-US:unitDisplay=narrow', '1048576', '1MB'],
    ['byte-count:en-US:unitDisplay=narrow', '1073741824', '1GB'],
  ].entries())
    test(`[format=${a}][value][label]`, () => {
      el.setAttribute('format', a)
      el.setAttribute('value', b)
      expect(el.innerHTML).toBe(`<label-view><span>${c}</span></label-view>`)
    })
})
