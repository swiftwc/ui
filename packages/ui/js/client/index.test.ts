import { expect, describe, test, beforeEach } from 'vitest'
import { FormView, SidebarView, TabBar, NavigationStack, ScrollView, BodyView } from '../components'
import { $ } from '../internal/utils'
import { NavigationPath } from './index'

describe('prop', () => {
  let div: HTMLElement

  // customElements.define('navigation-stack', NavigationStack)
  // customElements.define('scroll-stack', ScrollView)
  // customElements.define('body-view', BodyView)

  beforeEach(() => {
    div = document.createElement('div')
    document.body.appendChild(div)
  })

  test('queryBodyAll', () => {
    const el = div.appendChild(
        $(`<navigation-stack>
        <scroll-view id="sv1"></scroll-view>
        <body-view><scroll-view id="sv2"></scroll-view>
        <body-view><scroll-view id="sv3"></scroll-view></body-view></body-view>
        </navigation-stack>`)
      ),
      sv = el.querySelector<ScrollView>('#sv1')!

    expect(`${[...new NavigationPath(sv).children()].map(({ body }) => body?.id).join('')}`).toBe('sv2sv3')
  })

  test('queryBodyAll 2', () => {
    const el = div.appendChild(
        $(`<navigation-stack>
        <scroll-view id="sv1"></scroll-view>
        <navigation-stack hidden>
        <body-view><scroll-view id="sv2"></scroll-view>
        <body-view><scroll-view id="sv3"></scroll-view></body-view></body-view>
        </navigation-stack>
        <navigation-stack>
        <body-view><scroll-view id="sv4"></scroll-view>
        <body-view><scroll-view id="sv5"></scroll-view></body-view></body-view>
        </navigation-stack>
        </navigation-stack>`)
      ),
      sv = el.querySelector<ScrollView>('#sv1')!

    expect(`${[...new NavigationPath(sv).children()].map(({ body }) => body?.id).join('')}`).toBe('sv4sv5')
  })

  test('queryBodyAll 3', () => {
    const el = div.appendChild(
        $(`<navigation-stack>
        <scroll-view id="sv1"></scroll-view>
        <navigation-stack hidden>
          <scroll-view id="sv1a"></scroll-view>
          <body-view><scroll-view id="sv2"></scroll-view>
            <body-view><scroll-view id="sv3"></scroll-view></body-view>
          </body-view>
        </navigation-stack>
        <navigation-split-view>
          <body-view><scroll-view id="sv5"></scroll-view>
            <body-view><scroll-view id="sv6"></scroll-view>
              <body-view><scroll-view id="sv7"></scroll-view></body-view>
            </body-view>
          </body-view>
          <scroll-view id="sv4"></scroll-view>
        </navigation-split-view>
        </navigation-stack>`)
      ),
      sv = el.querySelector<ScrollView>('#sv1')!

    expect(`${[...new NavigationPath(sv).children()].map(({ body }) => body?.id).join('')}`).toBe('sv4sv5sv6sv7')
  })

  test('queryToolbarConfigAll 3', () => {
    const el = div.appendChild(
        $(`<navigation-stack>
          <scroll-view id="sv1"></scroll-view>
          <tool-bar><tool-bar-item id="sv0"></tool-bar-item></tool-bar>
          <navigation-stack hidden>
            <scroll-view></scroll-view>
            <tool-bar><tool-bar-item id="sv1a"></tool-bar-item></tool-bar>
            <body-view>
              <scroll-view></scroll-view><tool-bar><tool-bar-item id="sv2"></tool-bar-item></tool-bar>
              <body-view>
                <scroll-view></scroll-view><tool-bar><tool-bar-item id="sv3"></tool-bar-item></tool-bar>
              </body-view>
            </body-view>
          </navigation-stack>
          <navigation-split-view>
            <body-view><scroll-view></scroll-view><tool-bar><tool-bar-item id="sv5"></tool-bar-item></tool-bar>
              <body-view><scroll-view></scroll-view><tool-bar><tool-bar-item id="sv6"></tool-bar-item></tool-bar>
                <body-view><scroll-view></scroll-view><tool-bar><tool-bar-item id="sv7"></tool-bar-item></tool-bar></body-view>
              </body-view>
            </body-view>
            <scroll-view></scroll-view>
            <tool-bar><tool-bar-item id="sv4"></tool-bar-item></tool-bar>
          </navigation-split-view>
        </navigation-stack>`)
      ),
      sv = el.querySelector<ScrollView>('#sv1')!

    expect(
      `${[...new NavigationPath(sv).children()]
        .map(({ toolBarConfig }) => toolBarConfig)
        .flat()
        .map((item) => item?.id)
        .join('')}`
    ).toBe('sv4sv5sv6sv7')
  })

  test('queryHostAll', () => {
    const el = div.appendChild(
        $(`<navigation-stack>
        <scroll-view id="sv1"></scroll-view>
        <navigation-stack hidden>
          <body-view id="sv2"><scroll-view></scroll-view>
            <body-view id="sv3"><scroll-view></scroll-view></body-view>
          </body-view>
        </navigation-stack>
        <navigation-split-view>
          <body-view id="sv4">
            <body-view id="sv5"><scroll-view></scroll-view>
              <body-view id="sv6"><scroll-view></scroll-view>
                <body-view id="sv7"><scroll-view></scroll-view></body-view>
              </body-view>
            </body-view>
            <scroll-view></scroll-view>
          </body-view>
          <scroll-view></scroll-view>
        </navigation-split-view>
        </navigation-stack>`)
      ),
      sv = el.querySelector<ScrollView>('#sv1')!

    expect(`${[...new NavigationPath(sv).children()].map(({ component }) => component?.id).join('')}`).toBe('sv4sv5sv6sv7')
  })

  test('closestHost', () => {
    const el = div.appendChild(
        $(`<navigation-stack id="n0">
        <scroll-view id="sv1"></scroll-view>
        <body-view id="b1"><scroll-view id="sv2"></scroll-view>
        <body-view id="b2"><scroll-view id="sv3"></scroll-view></body-view></body-view>
        </navigation-stack>`)
      ),
      sv = el.querySelector<ScrollView>('#sv1')!

    expect(new NavigationPath(sv)?.component?.id).toBe('n0')
  })
  test('closestHost 2', () => {
    const el = div.appendChild(
        $(`<navigation-stack id="n0">
        <scroll-view id="sv1"></scroll-view>
        <body-view id="b1">
          <scroll-view id="sv2"></scroll-view>
          <body-view id="b2"><scroll-view id="sv3"></scroll-view></body-view>
        </body-view>
        </navigation-stack>`)
      ),
      sv = el.querySelector<ScrollView>('#sv2')!

    expect(new NavigationPath(sv)?.component?.id).toBe('b1')
  })

  test('queryHost', () => {
    const el = div.appendChild(
        $(`<navigation-stack id="n0">
        <scroll-view id="sv1"></scroll-view>
        <body-view id="b1"><scroll-view id="sv2"></scroll-view>
        <body-view id="b2"><scroll-view id="sv3"></scroll-view></body-view></body-view>
        </navigation-stack>`)
      ),
      sv = el.querySelector<ScrollView>('#sv1')!

    expect(new NavigationPath(sv)?.slot?.id).toBe('b1')
  })
  test('queryHost 2', () => {
    const el = div.appendChild(
        $(`<navigation-stack id="n0">
        <scroll-view id="sv1"></scroll-view>
        <body-view id="b1">
          <scroll-view id="sv2"></scroll-view>
          <body-view id="b2"><scroll-view id="sv3"></scroll-view></body-view>
        </body-view>
        </navigation-stack>`)
      ),
      sv = el.querySelector<ScrollView>('#sv2')!

    expect(new NavigationPath(sv)?.slot?.id).toBe('b2')
  })
  test('queryHost 3', () => {
    const el = div.appendChild(
        $(`<navigation-stack id="n0">
        <scroll-view id="sv1"></scroll-view>
        <body-view id="b1"><scroll-view id="sv2"></scroll-view>
        <body-view id="b2"><scroll-view id="sv3"></scroll-view></body-view></body-view>
        </navigation-stack>`)
      ),
      n0 = el.querySelector<ScrollView>('#n0')!

    expect(new NavigationPath(n0)?.component?.id).toBe(undefined)
  })
  test('queryHost 4', () => {
    const el = div.appendChild(
        $(`<navigation-stack id="n0">
        <scroll-view id="sv1"></scroll-view>
        <body-view id="b1">
          <scroll-view id="sv2"></scroll-view>
          <body-view id="b2"><scroll-view id="sv3"></scroll-view></body-view>
        </body-view>
        </navigation-stack>`)
      ),
      b1 = el.querySelector<ScrollView>('#b1')!

    expect(new NavigationPath(b1)?.component?.id).toBe('b1')
  })
})
