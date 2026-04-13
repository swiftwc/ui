import timeout from './timeout'

export default function <F extends (...args: any[]) => any>(fn: F, delay = 300, immediate = false): (...args: Parameters<F>) => void {
  const { next, pending } = timeout()

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const context = this,
      callNow = immediate && !pending()

    next(() => {
      if (!immediate) fn.apply(context, args)
    }, delay)

    if (callNow) fn.apply(context, args)
  }
}
