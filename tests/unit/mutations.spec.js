import mutations from '@/store/mutations.js'
import state from '@/store/state.js'

describe('mutations.js', () => {
  const flat = {
    id: 'abc',
    name: 'Test Flat 1',
    depreciationRate: '20',
    lowestPriceRate: '20',
    emailsOfUninitializedUsers: [],
    flatmates: [],
    items: []
  }

  const item = {
    name: 'Test Item 1',
    price: '1000',
    date: '2020-01-01',
    depreciationRate: '20',
    lowestPrice: '20',
    idsOfFlatmatesThatShareThis: []
  }

  let fakeState

  beforeEach(() => {
    fakeState = { ...state }
  })

  test('SET_CURRENT_FLAT_ID sets the state.currentFlatId', () => {
    const fakeId = 'abc'
    mutations.SET_CURRENT_FLAT_ID(fakeState, fakeId)
    expect(fakeState.currentFlatId).toBe(fakeId)
  })

  test('SET_PAGE_FORM_VALIDITY sets the state.isPageFormValid', () => {
    const fakeValidity = true
    mutations.SET_PAGE_FORM_VALIDITY(fakeState, fakeValidity)
    expect(fakeState.isPageFormValid).toBe(fakeValidity)
  })

  test('SET_USER sets the state.user', () => {
    const fakeUser = {
      id: 'abc',
      name: 'John Doe',
      email: 'john.doe@testemail.com',
      photo: 'https://randomuser.me/api/portraits/lego/2.jpg'
    }
    mutations.SET_USER(fakeState, fakeUser)
    expect(fakeState.user).toBe(fakeUser)
  })

  test('CREATE_FLAT adds a flat object to the state.flats', () => {
    const fakeFlat = { ...flat }
    mutations.CREATE_FLAT(fakeState, fakeFlat)
    expect(fakeState.flats.length).toBe(1)
    expect(fakeState.flats[0]).toBe(fakeFlat)
  })

  test('SET_FLATS sets the state.flats array', () => {
    const fakeFlats = [{ ...flat }, { ...flat }]
    mutations.SET_FLATS(fakeState, fakeFlats)
    expect(fakeState.flats.length).toBe(2)
  })

  test('SET_FLAT_ITEMS sets the flat.items', () => {
    const fakeFlat = { ...flat }
    const fakeItems = [{ ...item }, { ...item }]

    fakeState.flats = [fakeFlat]
    mutations.SET_FLAT_ITEMS(fakeState, { flat: fakeFlat, items: fakeItems })
    expect(fakeState.flats[0].items).toBe(fakeItems)
  })
})
