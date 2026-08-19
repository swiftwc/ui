import { describe, expect, it } from 'vitest'
import { default as kebabCase } from './kebab-case'

describe('kebabCase', () => {
  it('Hello World', () => {
    expect(kebabCase('Hello World')).toBe('hello-world')
  })
  it('VStack', () => {
    expect(kebabCase('VStack')).toBe('v-stack')
  })
})
