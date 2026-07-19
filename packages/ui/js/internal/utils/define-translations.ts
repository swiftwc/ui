export default function <const T extends object>(factory: () => T) {
  return factory
}
