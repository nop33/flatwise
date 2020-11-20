import { calculateDaysBetween, calculateItemValueOnDate, getFirstName } from '@/utils/utils.js'

describe('utils.js', () => {
  test('getFirstName returns the first string segment', () => {
    expect(getFirstName('John Doe Doe')).toBe('John')
    expect(getFirstName('John Doe')).toBe('John')
    expect(getFirstName('John')).toBe('John')
    expect(getFirstName('')).toBe('')
    expect(getFirstName(' ')).toBe('')
  })

  test('calculateDaysBetween returns the number of days between 2 days', () => {
    expect(calculateDaysBetween('2020-01-01', '2020-01-01')).toBe(0)
    expect(calculateDaysBetween('2020-01-01', '2020-01-02')).toBe(1)
    expect(calculateDaysBetween('2020-02-28', '2020-03-01')).toBe(2)
    expect(calculateDaysBetween('2020-01-02', '2020-01-01')).toBe(-1)
    expect(calculateDaysBetween('2019-01-01', '2020-01-01')).toBe(365)

    // Leap years should be taken into account
    expect(calculateDaysBetween('2020-01-01', '2021-01-01')).toBe(366)
  })

  test('calculateItemValueOnDate calculates the correct value', () => {
    const fakeItem = {
      date: '2021-01-01',
      depreciationRate: 20,
      price: 1000,
      lowestPriceRate: 50
    }

    expect(calculateItemValueOnDate(fakeItem, '2022-01-01')).toBe(800)
    expect(calculateItemValueOnDate(fakeItem, '2023-01-01')).toBe(600)

    // The item's lowest worth should be respected
    expect(calculateItemValueOnDate(fakeItem, '2024-01-01')).toBe(500)
    expect(calculateItemValueOnDate(fakeItem, '2030-01-01')).toBe(500)

    fakeItem.depreciationRate = 100
    expect(calculateItemValueOnDate(fakeItem, '2022-01-01')).toBe(500)

    fakeItem.lowestPriceRate = 0
    expect(calculateItemValueOnDate(fakeItem, '2022-01-01')).toBe(0)
    expect(calculateItemValueOnDate(fakeItem, '2030-01-01')).toBe(0)

    // The item's worth should be 0 if a date previous to the item's purchase date is given
    expect(calculateItemValueOnDate(fakeItem, '2020-01-01')).toBe(0)
  })
})
