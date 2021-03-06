import { getIterator } from './utils'

export function pipe (...transforms) {
  if (transforms.length === 0) {
    throw new Error('You must pass at least one transform')
  }

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

export function filter (predicate) {
  return function* (iterable) {
    for (const el of iterable) {
      if (predicate(el)) {
        yield el
      }
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

export function drop (n) {
  return function* (iterable) {
    for (let i = 0; i < n; i++) {
      const { done } = iterable.next()
      if (done) {
        return
      }
    }
    for (const el of iterable) {
      yield el
    }
  }
}

export function tail () {
  return drop(1)
}

export function append (value) {
  return function* (iterable) {
    for (const el of iterable) {
      yield el
    }
    yield value
  }
}

export function prepend (value) {
  return function* (iterable) {
    yield value
    for (const el of iterable) {
      yield el
    }
  }
}

export function flatMap (iteratee) {
  return function* (iterable) {
    for (const el of iterable) {
      const innerIterable = iteratee(el)
      for (const mappedEl of innerIterable) {
        yield mappedEl
      }
    }
  }
}
