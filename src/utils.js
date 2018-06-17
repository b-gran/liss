export function getIterator (maybeIterable) {
  if (maybeIterable === null || maybeIterable === undefined) {
    throw new Error('value is nil')
  }

  if (Symbol.iterator in maybeIterable) {
    return maybeIterable[Symbol.iterator]()
  } else {
    throw new Error('not iterable')
  }
}