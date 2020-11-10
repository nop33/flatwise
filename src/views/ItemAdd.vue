<template>
  <div>
    <AppBarThin
      :backButtonCallback="back"
      title="Add item"
      :actionButtonCallback="save"
      actionButtonText="Save"
    />
    <v-main>
      <ItemForm v-model="item" :allFlatmates="allFlatmates" />
    </v-main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getFlatFromStateById, fetchFlatItemsAndStoreInFlatWithId } from '@/utils/getters'

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
  computed: {
    ...mapGetters([
      'currentFlatmates'
    ])
  },
  created () {
    this.flat = getFlatFromStateById(this.flatId)
    this.allFlatmates = this.currentFlatmates(this.flatId)
    this.item.idsOfFlatmatesThatShareThis = this.allFlatmates.map(flatmate => flatmate.id)
    this.item.depreciationRate = this.flat.depreciationRate
    this.item.lowestPriceRate = this.flat.lowestPriceRate
    fetchFlatItemsAndStoreInFlatWithId(this.flatId)
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
