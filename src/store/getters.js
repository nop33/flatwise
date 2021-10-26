export default {
  currentFlat: (state) => state.flats.find((flat) => flat.id === state.currentFlatId),
  currentFlatmates: (state, getters) => getters.currentFlat.flatmates.filter((flatmate) => !flatmate.endDate),
  pastFlatmates: (state, getters) => getters.currentFlat.flatmates.filter((flatmate) => !!flatmate.endDate),
  currentFlatmatesOfFlat: (state) => (flatId) => {
    return state.flats.find((flat) => flat.id === flatId).flatmates.filter((flatmate) => !flatmate.endDate)
  }
}
