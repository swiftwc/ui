// import * as _intl from './intl'
import cash from './cash'

export { default as kebabCase } from './kebab-case'
export { default as cssTime } from './css-time'
export { default as debounce } from './debounce'
export { default as touchGlass } from './touch-glass'
export { default as slowHideShow } from './slow-hide-show'
export { default as frame } from './frame'
export { default as microtask } from './microtask'
export { default as sleep } from './sleep'
export { default as onoff } from './onoff'
export { default as timeout } from './timeout'
export { default as listActive } from './list-active'
export { default as ancestors } from './ancestors'
export { default as nextAll } from './next-all'
export { default as prevAll } from './prev-all'
export { default as next } from './next'
export { default as prev } from './prev'
export { default as siblings } from './siblings'
export { default as set } from './set'
export { default as clamp } from './clamp'
export { default as compareBigDecimals } from './compare-big-decimals'

// import * as cash from './cash' // import * as cash from './cash'
// export const $ = cash
// import cash, { prop as cashProp } from './cash'

export const $: typeof cash = cash

// export const intl: typeof _intl = _intl

// export { cashProp as prop }
