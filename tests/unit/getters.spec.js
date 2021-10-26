import getters from '@/store/getters.js'
import state from '@/store/state.js'

const flat = {
  id: 'abc',
  name: 'Test Flat 1',
  depreciationRate: '20',
  lowestPriceRate: '20',
  emailsOfUninitializedUsers: [],
  flatmates: [],
  items: []
}

const flatmate = {
  id: 'abc',
  name: 'John Doe',
  email: 'john.doe@testemail.com',
  photo: 'https://randomuser.me/api/portraits/lego/2.jpg',
  userRef: 'xyz',
  startDate: '2020-01-01',
  endDate: null
}

describe('getters.js', () => {
  test('currentFlat returns the flat with id state.currentFlatId', () => {
    const fakeState = { ...state }
    fakeState.currentFlatId = 'def'
    fakeState.flats = [{ ...flat }, { ...flat }]
    fakeState.flats[1].id = 'def'
    const flatResult = getters.currentFlat(fakeState)
    expect(flatResult).toBeDefined()
    expect(flatResult.id).toBe('def')
  })

  test('currentFlatmates returns the flatmates of the flat that have not moved out yet', () => {
    const fakeState = { ...state }
    const fakeFlat = { ...flat }
    fakeFlat.flatmates = [{ ...flatmate }, { ...flatmate }]
    fakeFlat.flatmates[0].endDate = '2020-07-31'
    fakeState.flats = [fakeFlat]

    const fakeGetters = { currentFlat: fakeFlat }
    const flatmatesResult = getters.currentFlatmates(fakeState, fakeGetters)
    expect(flatmatesResult).toBeDefined()
    expect(flatmatesResult.length).toBe(1)
    expect(flatmatesResult[0].endDate).toBe(null)
  })

  test('pastFlatmates returns the flatmates of the flat that have moved out', () => {
    const fakeState = { ...state }
    const fakeFlat = { ...flat }
    fakeFlat.flatmates = [{ ...flatmate }, { ...flatmate }]
    fakeFlat.flatmates[0].endDate = '2020-07-31'
    fakeState.flats = [fakeFlat]

    const fakeGetters = { currentFlat: fakeFlat }
    const flatmatesResult = getters.pastFlatmates(fakeState, fakeGetters)
    expect(flatmatesResult).toBeDefined()
    expect(flatmatesResult.length).toBe(1)
    expect(flatmatesResult[0].endDate).toBe('2020-07-31')
  })
})
