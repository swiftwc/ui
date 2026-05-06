export function customElement<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    // reportingURL = 'http://www...'
  }
}
