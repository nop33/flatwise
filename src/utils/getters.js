import store from '../store/index.js'

export function getFlatFromStateById (flatId) {
  let flat = store.selectedFlat
  if (!flat) {
    flat = store.getters.flatById(flatId)
    store.dispatch('selectFlat', flat)
  }
  return flat
}

export function fetchFlatItemsAndStoreInFlatWithId (flatId) {
  return new Promise((resolve) => {
    const flat = getFlatFromStateById(flatId)
    store.dispatch('fetchFlatItems', flat).then(() => {
      resolve()
    })
  })
}