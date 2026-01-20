import { DetailsBase } from '../internal/class'
import { cssTime } from '../internal/utils'
import { Snapshot } from '../snapshot'

const observers = new WeakMap();

export class DisclosureGroup extends DetailsBase {
  static observedAttributes = ['open']

  constructor() {
    super()
  }

  attributeChangedCallback(name: string, oldValue: boolean, newValue: boolean) {
    console.debug(`${DisclosureGroup.name} ⚡️ [${name}] change`)

    if(CSS.supports('interpolate-size', 'allow-keywords')) return 

    const mr={
      attributeName:name,
      oldValue:oldValue,
      target:this
    }

    // @ts-expect-error
    DisclosureGroup.polyfillAttributeChangedCallback([mr])
  }

  disconnectedCallback() {
    console.debug(`${DisclosureGroup.name} ⚡️ disconnect`)
  }

  connectedCallback() {
    console.debug(`${DisclosureGroup.name} ⚡️ connect`)
    
  }

  static polyfillDisconnectedCallback(el: DisclosureGroup) {
    if(CSS.supports('interpolate-size', 'allow-keywords')) return 

    el.removeEventListener('click', DisclosureGroup.handleClick)
    
    observers?.get(el)?.unobserve?.(el)
  }

  static polyfillConnectedCallback(el: DisclosureGroup) {
    if(CSS.supports('interpolate-size', 'allow-keywords')) return 

    el.addEventListener('click', DisclosureGroup.handleClick)
  }

  static handleClick = async (event: Event) => {

    if(!(event.target as HTMLElement).closest('summary')) return 

    const el=(event.target as HTMLElement).closest<HTMLDetailsElement>('details')
    if(!el) return 

      const wasOpen=el.open // will close after this event

      el.inert=true

      if(wasOpen) {
        el.classList.add(Snapshot.config!['disclosure-group-animation-close-class'])

        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
      }

      await new Promise(r => setTimeout(r, cssTime(`${el.computedStyleMap().get(Snapshot.config!['disclosure-group-animation-duration-css-prop'])}`)))

      el.inert=false

      if(wasOpen) el.open=false
      
  }

  static async polyfillAttributeChangedCallback([entry]: MutationRecord[]) {
    const node=(entry.target as HTMLDetailsElement)

    node.classList.remove(Snapshot.config!['disclosure-group-animation-close-class'])

    if(node.open) {
      observers.set(node, new ResizeObserver(([entry]) => {
          const { height } = entry.contentRect;

          node?.style?.setProperty?.(
            '--contents-height',
            `${height}px`
          )
      }));

      observers.get(node).observe(node)
    } else {
      observers.get(node)?.unobserve?.(node)
      observers.delete(node)

      node?.style?.removeProperty?.(
        '--contents-height'
      )
    }

    // const summaryHeight=node.querySelector(':scope > summary')?.clientHeight ?? 0,
    //   contentHeight=[...node.querySelectorAll(':scope > *:not(summary)')].map(item => item.clientHeight).reduce((a, b) => a + b, 0)

    // console.log(111,summaryHeight, contentHeight)
    /* const node=(entry.target as HTMLDetailsElement)

    // const nv=node.getAttribute(entry.attributeName ?? '')

    // console.log(333, document.querySelector('details::details-content'), getComputedStyle(node, '::details-content').height)

    // console.log(44,node,node.querySelector('*:not(summary)').getAnimations().map(({ finished }) => finished))

    if(CSS.supports('interpolate-size', 'allow-keywords')) return 

    return

    // self.requestAnimationFrame(async () => {

      const styleMap = node.computedStyleMap(),
      ee=styleMap.get('--disclosure-group-animation-duration');
      // console.log(444, ee.entries(), ee?.toString())
  
      console.log(444,node.clientHeight,)
  
      const duration=parseInt(`${ee}`),
      easing=getComputedStyle(node).getPropertyValue('--disclosure-group-animation-easing').trim()
  
      const summaryHeight=18, //node.querySelector(':scope > summary')?.clientHeight ?? 0,
      contentHeight=[...node.querySelectorAll(':scope > *:not(summary)')].map(item => item.clientHeight).reduce((a, b) => a + b, 0)
  
// node.style.overflow='hidden'

if(node.open) {
  // node.style.maxHeight='18px'
  const tr=node.animate([
    { maxHeight: `${summaryHeight}px` },
    { maxHeight: `100vh` },
  ],
  {
    // fill: "both",
    duration,
    easing
  })
} else {
  const tr=node.animate([
    { height: `120px`, maxHeight: 'unset' },
    { height: `${summaryHeight}px`, maxHeight: 'unset' },
  ],
  {
    // fill: "both",
    duration,
    easing
  })
}

      //  if(node.open) node.style.height=`${summaryHeight}px`
  
        console.log(99,node.open? `${summaryHeight + contentHeight}px`:`${summaryHeight}px`)
  
  

  // await tr.finished

  // node.removeAttribute('style')


    //   } else {
    //       // node.style.height='77px'
    
    // node.animate([
    //   { height: `${summaryHeight}px` },
    // ],
    // {
    //   fill: "both",
    //   duration,
    //   easing
    // })
        
    //   }
    // })

    // console.log(99, nv,node.open)
    // console.log(666, node.offsetHeight) */
  }
}
