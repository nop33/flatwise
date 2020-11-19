<template>
  <div>
    <AppBarThin :backButtonCallback="back" title="Add item" :actionButtonCallback="save" actionButtonText="Save" />
    <v-main>
      <ItemForm v-model="item" :allFlatmates="allFlatmates" />
    </v-main>
  </div>
</template>

<script>
import ItemForm from '@/components/ItemForm.vue'
import AppBarThin from '@/components/AppBarThin.vue'

export default {
  components: {
    ItemForm,
    AppBarThin
  },
  props: [
    'flatId'
  ],
  data: () => {
    return {
      flat: {},
      allFlatmates: [],
      item: {
        name: '',
        price: '',
        date: '',
        idsOfFlatmatesThatShareThis: [],
        depreciationRate: 0,
        lowestPriceRate: 0
      }
    }
  },
  async created () {
    this.flat = this.$store.getters.currentFlat
    if (!this.flat.items) {
      await this.$store.dispatch('fetchCurrentFlatItems')
    }
    this.allFlatmates = this.$store.getters.currentFlatmates
    this.item.idsOfFlatmatesThatShareThis = this.allFlatmates.map(flatmate => flatmate.id)
    this.item.depreciationRate = this.flat.depreciationRate
    this.item.lowestPriceRate = this.flat.lowestPriceRate
  },
  methods: {
    goToFlat () {
      this.$router.push({ name: 'Flat', params: { flatId: this.flatId } })
    },
    back () {
      this.goToFlat()
    },
    save () {
      this.$store.dispatch('addItem', this.item).then(this.goToFlat)
    }
  }
}
</script>
