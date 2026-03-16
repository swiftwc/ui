import queryBodyAll from './query-body-all'

/**
 * Looks for child bodies (excluding current body)
 */
export default function (any?: HTMLElement) {
  return queryBodyAll(any)?.[0]
}
