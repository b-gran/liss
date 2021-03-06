import { pipe, take, map, filter, drop, tail, append, prepend, flatMap } from '../src'
import { getIterator } from '../src/utils'

describe('pipe', () => {
  it('passes the input iterable through all transforms and returns an Array', () => {
    const input = [1, 2, 3]

    const first = jest.fn(take(0))
    const second = jest.fn(take(0))
    const third = jest.fn(take(0))

    const piped = pipe(first, second, third)
    const result = piped(input)

    expect(result).toEqual([])

    expect(first).toHaveBeenCalledTimes(1)
    expect(Array.from(first.mock.calls[0][0])).toEqual(input)

    expect(second).toHaveBeenCalledTimes(1)
    expect(Array.from(second.mock.calls[0][0])).toEqual([])

    expect(third).toHaveBeenCalledTimes(1)
    expect(Array.from(third.mock.calls[0][0])).toEqual([])
  })

  it('throws if no transforms are passed', () => {
    expect(() => pipe()).toThrowError()
  })

  it('throws if the value isn\'t iterable', () => {
    const piped = pipe(take(0))
    expect(() => piped(5)).toThrowError()
  })
})

describe('take', () => {
  it('returns the first n elements of the iterable', () => {
    const iterable = getIterator([1, 2, 3])
    expect(Array.from(take(2)(iterable))).toEqual([1, 2])
  })

  it('returns an empty iterable', () => {
    const iterable = getIterator([1, 2, 3])
    expect(Array.from(take(0)(iterable))).toEqual([])
  })

  it('returns every element of the iterable', () => {
    const iterable = getIterator([1, 2, 3])
    expect(Array.from(take(999)(iterable))).toEqual([1, 2, 3])
  })
})

describe('map', () => {
  it('passes each element of the input through the mapper', () => {
    const input = [1, 2, 3]
    const iteratee = jest.fn(x => x + 1)
    const mapper = map(iteratee)

    const iterable = getIterator(input)
    expect(Array.from(mapper(iterable))).toEqual([2, 3, 4])

    expect(iteratee).toHaveBeenCalledTimes(input.length)
  })
})

describe('filter', () => {
  it('adds all elements satisfying the predicate to the output', () => {
    const input = ['a', 'b', 'c']
    const predicate = x => x !== 'b'

    const doFilter = filter(predicate)

    const iterable = getIterator(input)
    expect(Array.from(doFilter(iterable))).toEqual(['a', 'c'])
  })

  it('calls the predicate for each element', () => {
    const input = ['a', 'b', 'c']
    const predicate = jest.fn(x => x !== 'b')

    const doFilter = filter(predicate)
    Array.from(doFilter(getIterator(input)))

    expect(predicate).toHaveBeenCalledTimes(input.length)
  })
})

describe('drop', () => {
  it('drops the first n elements of the iterable', () => {
    const iterable = getIterator([1, 2, 3, 4])
    expect(Array.from(drop(2)(iterable))).toEqual([3, 4])
  })

  it('returns an empty iterable', () => {
    const iterable = getIterator([1, 2, 3])
    expect(Array.from(drop(5)(iterable))).toEqual([])
  })

  it('returns every element of the iterable', () => {
    const iterable = getIterator([1, 2, 3])
    expect(Array.from(drop(0)(iterable))).toEqual([1, 2, 3])
  })
})

describe('tail', () => {
  it('drops the first element of the iterable', () => {
    const iterable = getIterator([1, 2, 3, 4])
    expect(Array.from(tail()(iterable))).toEqual([2, 3, 4])
  })

  it('returns an empty iterable', () => {
    const iterable = getIterator([1])
    expect(Array.from(tail()(iterable))).toEqual([])
  })
})

describe('append', () => {
  it('appends the element', () => {
    const iterable = getIterator([1, 2, 3])
    expect(Array.from(append(4)(iterable))).toEqual([1, 2, 3, 4])
  })

  it('return an iterator containing only the element', () => {
    const iterable = getIterator([])
    expect(Array.from(append(1)(iterable))).toEqual([1])
  })
})

describe('prepend', () => {
  it('prepends the element', () => {
    const iterable = getIterator([1, 2, 3])
    expect(Array.from(prepend(0)(iterable))).toEqual([0, 1, 2, 3])
  })

  it('return an iterator containing only the element', () => {
    const iterable = getIterator([])
    expect(Array.from(prepend(1)(iterable))).toEqual([1])
  })
})

describe('flatMap', () => {
  [
    [x => getIterator([x, 'foo']), 'plain iterator'],
    [x => [x, 'foo'], 'Arrays'],
    [x => new Set([x, 'foo']), 'Sets'],
  ].forEach(([ iteratee, iterableType ]) => {
    it(`flattens the iterables (${iterableType}) returned by the iteratee`, () => {
      const iterable = getIterator([1, 2, 3])

      const result = Array.from(flatMap(iteratee)(iterable))
      expect(result).toEqual([1, 'foo', 2, 'foo', 3, 'foo'])
    })
  })
})
