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
export { default as getRank } from './get-rank'

// import * as cash from './cash' // import * as cash from './cash'
// export const $ = cash
// import cash, { prop as cashProp } from './cash'
import cash from './cash'

export const $: typeof cash = cash

// export { cashProp as prop }
