export { default as kebabCase } from './kebab-case'
export { default as cssTime } from './css-time'
export { default as debounce } from './debounce'
export { default as touchGlass } from './touch-glass'
export { default as slowHideShow } from './slow-hide-show'
export { default as frame } from './frame'
export { default as frames } from './frames'
export { default as microtask } from './microtask'
export { default as sleep } from './sleep'
export { default as setTimeoutSafe } from './set-timeout-safe'
export { default as onoff } from './onoff'

// import * as cash from './cash' // import * as cash from './cash'
// export const $ = cash
// import cash, { prop as cashProp } from './cash'
import cash from './cash'

export const $: typeof cash = cash

// export { cashProp as prop }
