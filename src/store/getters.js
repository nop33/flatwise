export default {
  flatById: state => flatId => state.flats.find(flat => flat.id === flatId),
  flatItemById: state => (flatId, itemId) => {
    const flat = state.flats.find(flat => flat.id === flatId)
    if (flat.items && flat.items.length >= 0) {
      return flat.items.find(item => item.id === itemId)
    }
    return null
  },
  currentFlatmates: state => (flatId) => {
    return state.flats.find(flat => flat.id === flatId).flatmates.filter(flatmate => !flatmate.endDate)
  },
  pastFlatmates: state => (flatId) => {
    return state.flats.find(flat => flat.id === flatId).flatmates.filter(flatmate => !!flatmate.endDate)
  }
}
