import { getIterator } from './utils'

export function pipe (...transforms) {
  return iterableOrArray => {
    const iterable = getIterator(iterableOrArray)
    return Array.from(transforms.reduce(
      (currentIterable, transform) => transform(currentIterable),
      iterable
    ))
  }
}

export function map (f) {
  return function* (iterable) {
    for (const el of iterable) {
      yield f(el)
    }
  }
}

export function take (n) {
  return function* (iterable) {
    for (let i = 0; i < n; i++) {
      const { done, value } = iterable.next()
      if (done) {
        return
      }
      yield value
    }
  }
}