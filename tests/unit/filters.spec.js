import { round, humanReadable } from '@/utils/filters'

describe('filters.js', () => {
  test('round filter rounds the input number to 2 decimals', () => {
    expect(round(10.129)).toBe(10.13)
    expect(round(10.125)).toBe(10.13)
    expect(round(10.124)).toBe(10.12)
    expect(round(10.0449)).toBe(10.04)
    expect(round(10)).toBe(10)
  })

  test('humanReadable filter converts a string date to human readable format', () => {
    expect(humanReadable('2020-01-01')).toBe('1 January 2020')
  })
})
