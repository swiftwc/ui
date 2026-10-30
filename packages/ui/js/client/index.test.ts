/// <reference types="vite/client" />

import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { Snapshot } from '../client'
import { ScrollView } from '../components'
import { $ } from '../internal/utils'
import { html } from '../tpl'
import { NavigationPath, alert } from './index'

beforeEach(() => document.body.replaceChildren())

describe('prop', () => {
  let el: HTMLElement

  beforeEach(() => {
    // document.body.insertAdjacentHTML('beforeend', '<div></div>')
    // div = document.body.lastElementChild as HTMLElement
  })
  afterEach(() => el.remove())

  test('queryBodyAll', () => {
    document.body.insertAdjacentElement(
      'beforeend',
      $(
        html`<navigation-stack>
          <scroll-view id="sv1"></scroll-view>
          <content-view
            ><scroll-view id="sv2"></scroll-view> <content-view><scroll-view id="sv3"></scroll-view></content-view
          ></content-view>
        </navigation-stack>`,
        '>1'
      )
    )
    el = document.body.lastElementChild as HTMLElement

    const sv = el.querySelector<ScrollView>('#sv1')!

    expect(`${[...new NavigationPath(sv).children()].map(({ body }) => body?.id).join('')}`).toBe('sv2sv3')
  })

  test('queryBodyAll 2', () => {
    document.body.insertAdjacentElement(
      'beforeend',
      $(
        html`<navigation-stack>
          <scroll-view id="sv1"></scroll-view>
          <navigation-stack hidden>
            <content-view
              ><scroll-view id="sv2"></scroll-view> <content-view><scroll-view id="sv3"></scroll-view></content-view
            ></content-view>
          </navigation-stack>
          <navigation-stack>
            <content-view
              ><scroll-view id="sv4"></scroll-view> <content-view><scroll-view id="sv5"></scroll-view></content-view
            ></content-view>
          </navigation-stack>
        </navigation-stack>`,
        '>1'
      )
    )
    el = document.body.lastElementChild as HTMLElement

    const sv = el.querySelector<ScrollView>('#sv1')!

    expect(`${[...new NavigationPath(sv).children()].map(({ body }) => body?.id).join('')}`).toBe('sv4sv5')
  })

  test('queryBodyAll 3', () => {
    document.body.insertAdjacentElement(
      'beforeend',
      $(
        html`<navigation-stack>
          <scroll-view id="sv1"></scroll-view>
          <navigation-stack hidden>
            <scroll-view id="sv1a"></scroll-view>
            <content-view
              ><scroll-view id="sv2"></scroll-view>
              <content-view><scroll-view id="sv3"></scroll-view></content-view>
            </content-view>
          </navigation-stack>
          <navigation-split-view>
            <content-view
              ><scroll-view id="sv5"></scroll-view>
              <content-view
                ><scroll-view id="sv6"></scroll-view>
                <content-view><scroll-view id="sv7"></scroll-view></content-view>
              </content-view>
            </content-view>
            <scroll-view id="sv4"></scroll-view>
          </navigation-split-view>
        </navigation-stack>`,
        '>1'
      )
    )
    el = document.body.lastElementChild as HTMLElement

    const sv = el.querySelector<ScrollView>('#sv1')!

    expect(`${[...new NavigationPath(sv).children()].map(({ body }) => body?.id).join('')}`).toBe('sv4sv5sv6sv7')
  })

  test('queryToolbarConfigAll 3', () => {
    document.body.insertAdjacentElement(
      'beforeend',
      $(
        html`<navigation-stack>
          <scroll-view id="sv1"></scroll-view>
          <tool-bar><tool-bar-item id="sv0"></tool-bar-item></tool-bar>
          <navigation-stack hidden>
            <scroll-view></scroll-view>
            <tool-bar><tool-bar-item id="sv1a"></tool-bar-item></tool-bar>
            <content-view>
              <scroll-view></scroll-view><tool-bar><tool-bar-item id="sv2"></tool-bar-item></tool-bar>
              <content-view>
                <scroll-view></scroll-view><tool-bar><tool-bar-item id="sv3"></tool-bar-item></tool-bar>
              </content-view>
            </content-view>
          </navigation-stack>
          <navigation-split-view>
            <content-view
              ><scroll-view></scroll-view><tool-bar><tool-bar-item id="sv5"></tool-bar-item></tool-bar>
              <content-view
                ><scroll-view></scroll-view><tool-bar><tool-bar-item id="sv6"></tool-bar-item></tool-bar>
                <content-view
                  ><scroll-view></scroll-view><tool-bar><tool-bar-item id="sv7"></tool-bar-item></tool-bar
                ></content-view>
              </content-view>
            </content-view>
            <scroll-view></scroll-view>
            <tool-bar><tool-bar-item id="sv4"></tool-bar-item></tool-bar>
          </navigation-split-view>
        </navigation-stack>`,
        '>1'
      )
    )
    el = document.body.lastElementChild as HTMLElement

    const sv = el.querySelector<ScrollView>('#sv1')!

    expect(
      `${[...new NavigationPath(sv).children()]
        .map(({ toolBarConfig }) => toolBarConfig)
        .flat()
        .map((item) => item?.id)
        .join('')}`
    ).toBe('sv4sv5sv6sv7')
  })

  test('queryHostAll', () => {
    document.body.insertAdjacentElement(
      'beforeend',
      $(
        html`<navigation-stack>
          <scroll-view id="sv1"></scroll-view>
          <navigation-stack hidden>
            <content-view id="sv2"
              ><scroll-view></scroll-view>
              <content-view id="sv3"><scroll-view></scroll-view></content-view>
            </content-view>
          </navigation-stack>
          <navigation-split-view>
            <content-view id="sv4">
              <content-view id="sv5"
                ><scroll-view></scroll-view>
                <content-view id="sv6"
                  ><scroll-view></scroll-view>
                  <content-view id="sv7"><scroll-view></scroll-view></content-view>
                </content-view>
              </content-view>
              <scroll-view></scroll-view>
            </content-view>
            <scroll-view></scroll-view>
          </navigation-split-view>
        </navigation-stack>`,
        '>1'
      )
    )
    el = document.body.lastElementChild as HTMLElement

    const sv = el.querySelector<ScrollView>('#sv1')!

    expect(`${[...new NavigationPath(sv).children()].map(({ component }) => component?.id).join('')}`).toBe('sv4sv5sv6sv7')
  })

  test('closestHost', () => {
    document.body.insertAdjacentElement(
      'beforeend',
      $(
        html`<navigation-stack id="n0">
          <scroll-view id="sv1"></scroll-view>
          <content-view id="b1"
            ><scroll-view id="sv2"></scroll-view> <content-view id="b2"><scroll-view id="sv3"></scroll-view></content-view
          ></content-view>
        </navigation-stack>`,
        '>1'
      )
    )
    el = document.body.lastElementChild as HTMLElement

    const sv = el.querySelector<ScrollView>('#sv1')!

    expect(new NavigationPath(sv)?.component?.id).toBe('n0')
  })
  test('closestHost 2', () => {
    document.body.insertAdjacentElement(
      'beforeend',
      $(
        html`<navigation-stack id="n0">
          <scroll-view id="sv1"></scroll-view>
          <content-view id="b1">
            <scroll-view id="sv2"></scroll-view>
            <content-view id="b2"><scroll-view id="sv3"></scroll-view></content-view>
          </content-view>
        </navigation-stack>`,
        '>1'
      )
    )
    el = document.body.lastElementChild as HTMLElement

    const sv = el.querySelector<ScrollView>('#sv2')!

    expect(new NavigationPath(sv)?.component?.id).toBe('b1')
  })

  test('queryHost', () => {
    document.body.insertAdjacentElement(
      'beforeend',
      $(
        html`<navigation-stack id="n0">
          <scroll-view id="sv1"></scroll-view>
          <content-view id="b1"
            ><scroll-view id="sv2"></scroll-view> <content-view id="b2"><scroll-view id="sv3"></scroll-view></content-view
          ></content-view>
        </navigation-stack>`,
        '>1'
      )
    )
    el = document.body.lastElementChild as HTMLElement

    const sv = el.querySelector<ScrollView>('#sv1')!

    expect(new NavigationPath(sv)?.slot?.id).toBe('b1')
  })
  test('queryHost 2', () => {
    document.body.insertAdjacentElement(
      'beforeend',
      $(
        html`<navigation-stack id="n0">
          <scroll-view id="sv1"></scroll-view>
          <content-view id="b1">
            <scroll-view id="sv2"></scroll-view>
            <content-view id="b2"><scroll-view id="sv3"></scroll-view></content-view>
          </content-view>
        </navigation-stack>`,
        '>1'
      )
    )
    el = document.body.lastElementChild as HTMLElement

    const sv = el.querySelector<ScrollView>('#sv2')!

    expect(new NavigationPath(sv)?.slot?.id).toBe('b2')
  })
  test('queryHost 3', () => {
    document.body.insertAdjacentElement(
      'beforeend',
      $(
        html`<navigation-stack id="n0">
          <scroll-view id="sv1"></scroll-view>
          <content-view id="b1"
            ><scroll-view id="sv2"></scroll-view> <content-view id="b2"><scroll-view id="sv3"></scroll-view></content-view
          ></content-view>
        </navigation-stack>`,
        '>1'
      )
    )
    el = document.body.lastElementChild as HTMLElement

    const n0 = el.querySelector<ScrollView>('#n0')!

    expect(new NavigationPath(n0)?.component?.id).toBe(undefined)
  })
  test('queryHost 4', () => {
    document.body.insertAdjacentElement(
      'beforeend',
      $(
        html`<navigation-stack id="n0">
          <scroll-view id="sv1"></scroll-view>
          <content-view id="b1">
            <scroll-view id="sv2"></scroll-view>
            <content-view id="b2"><scroll-view id="sv3"></scroll-view></content-view>
          </content-view>
        </navigation-stack>`,
        '>1'
      )
    )
    el = document.body.lastElementChild as HTMLElement

    const b1 = el.querySelector<ScrollView>('#b1')!

    expect(new NavigationPath(b1)?.component?.id).toBe('b1')
  })

  test('alert()', async () => {
    await Snapshot.waitReady //await Snapshot.mock()

    document.body.insertAdjacentElement('beforeend', $(html`<navigation-stack><scroll-view></scroll-view></navigation-stack>`, '>1'))
    el = document.body.lastElementChild as HTMLElement

    void alert('foo')

    await expect.element(page.getByRole('dialog')).toHaveAttribute('open')

    const dialog = document.body.lastElementChild

    await expect.poll(() => dialog?.outerHTML).toBe(`<dialog is="alert-dialog" autofocus="" open="">
          <v-stack spacing="1" alignment="fill">
            <label-view font="headline" title="foo"><span>foo</span></label-view><!--🔥PART🔥-->
            <!--🔥PART🔥-->
          </v-stack>
          
              <button type="button" tabindex="0" is="bordered-button" value="0" role="close">
                <!--🔥PART🔥-->
              <label-view slot="placeholder"><span>OK</span></label-view></button>
            <!--🔥PART🔥-->
        </dialog>`)

    await userEvent.click(document.querySelector<HTMLElement>('button[role="close"]')!)

    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument() // await expect.poll(() => dialog?.isConnected).toBe(false) await expect.element(page.getByRole('dialog')).toBeUndefined()
  })
})

describe('customElements', () => {
  const modules = import.meta.glob(['../components/**/*.ts', '!../components/**/*.test.ts', '!../components/**/*.d.ts'], { eager: true })

  const classes = [
    ...new Map(
      Object.values(modules).flatMap((mod) =>
        Object.values(mod as object)
          .filter((v): v is CustomElementConstructor => typeof v === 'function' && v.prototype instanceof HTMLElement)
          .map((ctor) => [ctor, ctor] as const)
      )
    ).keys(),
  ]
  const cases = classes.map((ctor) => ({ name: ctor.name, ctor }))

  test('found element classes', () => expect(classes.length).toBeGreaterThan(0))

  test.for(cases)('$name is registered', ({ ctor }) => {
    const tag = customElements.getName(ctor)
    expect(tag, `${ctor.name} is not registered`).not.toBeNull()
    expect(customElements.get(tag!)).toBe(ctor)

    const base = (ctor as { polyfillExtends?: string }).polyfillExtends
    const el = base ? document.createElement(base, { is: tag! }) : document.createElement(tag!)

    expect(el).toBeInstanceOf(ctor)
  })
})
