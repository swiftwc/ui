const fallback = {
  matches: false,
  media: '',
  addEventListener() {},
  removeEventListener() {},
} as unknown as MediaQueryList

export default (query: string): MediaQueryList => (typeof self !== 'undefined' && typeof self.matchMedia === 'function' ? self.matchMedia(query) : fallback)
