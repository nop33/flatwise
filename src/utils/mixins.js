const initializeFlatAndItems = {
  created() {
    this.flat = this.$store.getters.currentFlat

    if (!this.flat.items) {
      this.$store.dispatch('fetchCurrentFlatItems')
    }
  }
}

export { initializeFlatAndItems }
