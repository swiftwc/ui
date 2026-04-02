export default function <T extends object>(set: Set<T> | WeakSet<T>, value: T): boolean {
  if (!set.has(value)) {
    set.add(value)

    return true
  }

  return false
}
