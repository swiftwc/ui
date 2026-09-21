import { beforeEach, describe, expect, test, vi } from 'vitest'
import { PickerView } from './picker-view'

describe('prop', () => {
  let div: PickerView
  let form: HTMLFormElement

  customElements.define('picker-view', PickerView)

  beforeEach(() => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-0000-0000-000000000000')
    form = document.createElement('form')
    div = document.createElement('picker-view') as PickerView
    div.setAttribute('name', 'foo')
    form.appendChild(div)
    document.body.appendChild(form)
  })

  test('[selection]', () => {
    const data = new FormData(form) //{foo:""}

    expect(data.get('foo')).toBe('')
  })

  test('[selection]', () => {
    div.setAttribute('selection', 'bar')

    const data = new FormData(form) //{foo:"bar"}

    expect(data.get('foo')).toBe('bar')
  })

  test('[selection]', () => {
    div.selection = 'bar'

    const data = new FormData(form) //{foo:"bar"}

    expect(data.get('foo')).toBe('bar')
  })

  test('[picker-style="radio-group"]', () => {
    div.setAttribute('picker-style', 'radio-group')
    div.selection = 'Tyrannosaurus'

    div.innerHTML = `<optgroup label="Theropods" slot="list">
                <option>Tyrannosaurus</option>
                <option>Velociraptor</option>
                <option>Deinonychus</option>
              </optgroup>`

    const data = new FormData(form) //{foo:"bar"}

    expect(data.get('foo')).toBe('Tyrannosaurus')
  })

  test('[picker-style="radio-group"]', async () => {
    div.setAttribute('picker-style', 'radio-group')
    div.selection = 'Tyrannosaurus'

    const og = Object.assign(document.createElement('optgroup'), {
      label: 'Theropods',
      slot: 'list',
      innerHTML: '<option>Tyrannosaurus</option><option>Velociraptor</option><option>Deinonychus</option>',
    })
    og.label = 'Theropods'
    og.slot = 'list'

    div.appendChild(og)

    await new Promise<void>((r) => queueMicrotask(r))

    expect(div.innerHTML).toBe(`<optgroup label="Theropods" slot="list"><option>Tyrannosaurus</option><option>Velociraptor</option><option>Deinonychus</option></optgroup><label>
      <h-stack distribution="fill" template="auto spacer" spacing="5">
        <input type="radio" name="00000000-0000-0000-0000-000000000000" style="min-inline-size: 20px; margin: 0" disabled="">
        <h-stack distribution="fill">
      <!--🔥PART🔥-->
      <v-stack spacing="3" alignment="fill">
        <label-view title="Theropods"></label-view>
        <!--🔥PART🔥-->
      </v-stack>
    </h-stack><!--🔥PART🔥-->
      </h-stack>
    </label><label>
      <h-stack distribution="fill" template="auto spacer" spacing="5">
        <input type="radio" name="00000000-0000-0000-0000-000000000000" value="Tyrannosaurus" style="min-inline-size: 20px; margin: 0">
        <h-stack distribution="fill">
      <!--🔥PART🔥-->
      <v-stack spacing="3" alignment="fill">
        <label-view title="Tyrannosaurus"></label-view>
        <!--🔥PART🔥-->
      </v-stack>
    </h-stack><!--🔥PART🔥-->
      </h-stack>
    </label><label>
      <h-stack distribution="fill" template="auto spacer" spacing="5">
        <input type="radio" name="00000000-0000-0000-0000-000000000000" value="Velociraptor" style="min-inline-size: 20px; margin: 0">
        <h-stack distribution="fill">
      <!--🔥PART🔥-->
      <v-stack spacing="3" alignment="fill">
        <label-view title="Velociraptor"></label-view>
        <!--🔥PART🔥-->
      </v-stack>
    </h-stack><!--🔥PART🔥-->
      </h-stack>
    </label><label>
      <h-stack distribution="fill" template="auto spacer" spacing="5">
        <input type="radio" name="00000000-0000-0000-0000-000000000000" value="Deinonychus" style="min-inline-size: 20px; margin: 0">
        <h-stack distribution="fill">
      <!--🔥PART🔥-->
      <v-stack spacing="3" alignment="fill">
        <label-view title="Deinonychus"></label-view>
        <!--🔥PART🔥-->
      </v-stack>
    </h-stack><!--🔥PART🔥-->
      </h-stack>
    </label>`)
  })
})
