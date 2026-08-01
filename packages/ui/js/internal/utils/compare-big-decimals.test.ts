import { describe, expect, it } from 'vitest'
import { default as compareBigDecimals } from './compare-big-decimals'

describe('compareBigDecimals', () => {
  const isInRange = (value: string, min: string, max: string): boolean => compareBigDecimals(value, min) >= 0 && compareBigDecimals(value, max) <= 0

  it('1e3', () => {
    expect(compareBigDecimals('1e3', '1000')).toBe(0)
  })
  it('1e-3', () => {
    expect(compareBigDecimals('1e-3', '0.001')).toBe(0)
  })
  it('-10', () => {
    expect(compareBigDecimals('-10', '-2')).toBe(-1)
  })
  it('sort', () => {
    const arr = ['1.2', '1.10', '1.02', '1e2', '100', '-0.5']
    expect(arr.sort(compareBigDecimals)).toStrictEqual(['-0.5', '1.02', '1.10', '1.2', '1e2', '100'])
  })
  it('isInRange("-5", "-10", "-1")', () => {
    expect(isInRange('-5', '-10', '-1')).toBe(true)
  })
  it('isInRange("-11", "-10", "-1")', () => {
    expect(isInRange('-11', '-10', '-1')).toBe(false)
  })
  it('isInRange("0", "-10", "-1")', () => {
    expect(isInRange('0', '-10', '-1')).toBe(false)
  })
  it('isInRange("-Infinity", "-Infinity", "-1")', () => {
    expect(isInRange('-Infinity', '-Infinity', '-1')).toBe(true)
  })
  it('isInRange("5", "-Infinity", "Infinity")', () => {
    expect(isInRange('5', '-Infinity', 'Infinity')).toBe(true)
  })
})
