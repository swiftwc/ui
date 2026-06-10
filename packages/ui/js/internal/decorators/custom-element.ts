// https://www.typescriptlang.org/docs/handbook/decorators.html
export default function <T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    // reportingURL = 'http://www...'
  }
}
