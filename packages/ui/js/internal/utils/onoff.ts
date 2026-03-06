/**
 * const el = document.querySelector('button')!

// 1. Single — no event arg
useEvent('click', () => console.log('clicked'), el)

// 2. Single — with event arg
useEvent('click', (e) => console.log(e.target), el)

// 3. Single — with options
useEvent('click', (e) => console.log(e), el, { passive: true, once: true })

// 4. Single — capture as boolean
useEvent('click', (e) => console.log(e), el, true)

// 5. Array — shared t
useEvent([
  { types: 'click', listener: (e) => console.log('click', e) },
  { types: 'mouseover mouseout', listener: (e) => console.log('hover', e) },
], el)

// 6. Using on/off
const { on, off } = useEvent('scroll', (e) => console.log(e), el, { passive: true })
on()   // start listening
off()  // stop listening
 */
// type Types = string
type Options = boolean | AddEventListenerOptions

interface EventConfig {
  types: string
  listener: EventListener
  // t?: EventTarget
  addOptions?: Options
}

function single(types: string, listener: EventListener, t?: EventTarget, addOptions?: Options) {
  const events = types.split(' ')

  const removeOptions: boolean | EventListenerOptions | undefined =
    typeof addOptions === 'boolean' ? addOptions : addOptions !== undefined && 'capture' in addOptions ? { capture: addOptions.capture } : undefined

  const off = () => {
      for (const event of events) t?.removeEventListener(event, listener, removeOptions)
    },
    on = () => {
      for (const event of events) t?.addEventListener(event, listener, addOptions)

      return off
    }

  return {
    on,
    off,
  }
}

export default function (configs: EventConfig[], t?: EventTarget): ReturnType<typeof single>
export default function (types: string, listener: EventListener, t?: EventTarget, addOptions?: Options): ReturnType<typeof single>
export default function (typesOrConfigs: string | EventConfig[], listenerOrT?: EventListener | EventTarget, t?: EventTarget, addOptions?: Options) {
  if (Array.isArray(typesOrConfigs)) {
    const element = listenerOrT as EventTarget | undefined,
      results = typesOrConfigs.map((c) => single(c.types, c.listener, element, c.addOptions)) //, c.t ?? element, c.addOptions))

    const off = () => results.forEach((r) => r.off()),
      on = () => {
        for (const r of results) r.on()

        return off
      }

    return {
      on,
      off,
    }
  }

  return single(typesOrConfigs, listenerOrT as EventListener, t, addOptions)
}
