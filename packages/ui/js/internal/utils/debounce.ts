export default function <F extends (...args: any[]) => any>(fn: F, delay = 300, immediate = false): (...args: Parameters<F>) => void {
  let timeoutId: number | null = null

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const context = this

    const callNow = immediate && !timeoutId

    if (timeoutId) self.clearTimeout(timeoutId)

    timeoutId = self.setTimeout(() => {
      timeoutId = null
      if (!immediate) fn.apply(context, args)
    }, delay)

    if (callNow) fn.apply(context, args)
  }
}
