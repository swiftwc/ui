import postcss from 'postcss'
import { compile } from 'sass'
import { expect, it } from 'vitest'

it('keeps a stable layer order', () => {
  const { css } = compile(`${import.meta.dirname}/index.scss`, { logger: { debug() {}, warn() {} } })
  const order = new Set<string>()
  postcss.parse(css).walkAtRules('layer', (rule) => {
    const parents: string[] = []
    for (let p = rule.parent; p?.type === 'atrule'; p = p.parent) {
      if ((p as postcss.AtRule).name === 'layer') parents.unshift((p as postcss.AtRule).params)
    }
    for (const name of rule.params.split(',')) order.add([...parents, name.trim()].join('.'))
  })
  expect([...order]).toEqual([
    'sw',
    'sw.sw-base',
    'sw.sw-components',
    'sw.sw-nav-components',
    'sw.sw-list-components',
    'sw.sw-tab-components',
    'sw.sw-utils',
    'sw.sw-colors',
    'sw.sw-actions',
    'sw.sw-transitions',
    'sw.sw-final',
  ])
})
