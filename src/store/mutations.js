export default {
  SET_CURRENT_FLAT_ID (state, id) {
    state.currentFlatId = id
  },
  SET_PAGE_FORM_VALIDITY (state, validity) {
    state.isPageFormValid = validity
  },
  SET_USER (state, user) {
    state.user = user
  },
  ADD_ITEM (state, { itemData, flat }) {
    flat.items.push(itemData)
  },
  UPDATE_ITEM (state, { itemData, flat }) {
    const item = flat.items.find(item => item.id === itemData.id)
    item.name = itemData.name
    item.price = itemData.price
    item.date = itemData.date
    item.idsOfFlatmatesThatShareThis = itemData.idsOfFlatmatesThatShareThis
    item.depreciationRate = itemData.depreciationRate
    item.lowestPriceRate = itemData.lowestPriceRate
  },
  DELETE_ITEM (state, { itemData, flat }) {
    flat.items.splice(flat.items.indexOf(flat.items.find(item => item.id === itemData.id)), 1)
  },
  TOGGLE_LOADER (state, toggle) {
    state.loading = toggle
  },
  CREATE_FLAT (state, flatData) {
    state.flats.push(flatData)
  },
  UPDATE_FLAT (state, flatData) {
    const flat = state.flats.find(flat => flat.id === flatData.id)
    flat.name = flatData.name
    flat.depreciationRate = flatData.depreciationRate
    flat.lowestPriceRate = flatData.lowestPriceRate
  },
  SET_FLATS (state, flats) {
    state.flats = flats
    state.isStoreInitialized = true
  },
  SET_FLAT_ITEMS (state, { flat, items }) {
    flat.items = items
  },
  ADD_FLATMATE (state, { flat, flatmateData }) {
    flat.flatmates.push(flatmateData)
  },
  UPDATE_FLATMATE (state, { flat, flatmateData }) {
    const flatmate = flat.flatmates.find(flatmate => flatmate.id === flatmateData.id)
    flatmate.name = flatmateData.name
    flatmate.startDate = flatmateData.startDate
    flatmate.endDate = flatmateData.endDate || null
  },
  SET_FLATMATE_MOVE_OUT_DATE (state, { flat, flatmateId, moveOutDate }) {
    const flatmate = flat.flatmates.find(flatmate => flatmate.id === flatmateId)
    flatmate.endDate = moveOutDate
  },
  UPDATE_FLAT_ITEMS_SHARING_INFO (state, { flat, flatmateId, itemIdsToBeRemovedFrom, itemIdsToBeAddedAt }) {
    flat.items.filter(item => itemIdsToBeRemovedFrom.includes(item.id)).forEach(item => {
      item.idsOfFlatmatesThatShareThis.splice(item.idsOfFlatmatesThatShareThis.indexOf(flatmateId), 1)
    })
    flat.items.filter(item => itemIdsToBeAddedAt.includes(item.id)).forEach(item => {
      item.idsOfFlatmatesThatShareThis.push(flatmateId)
    })
  }
}
