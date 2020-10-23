<template>
  <div>
    <v-toolbar flat color="primary" dark fixed>
      <v-btn icon @click="goToFlat">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Add item</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text large @click="save">Save</v-btn>
    </v-toolbar>
    <v-main>
      <ItemForm v-model="item" :allFlatmates="allFlatmates" />
    </v-main>
  </div>
</template>

<script>
import { getFlatFromStateById, fetchFlatItemsAndStoreInFlatWithId } from '@/utils/getters'

import ItemForm from '@/components/ItemForm.vue'

export default {
  components: {
    ItemForm
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
  created () {
    this.flat = getFlatFromStateById(this.flatId)
    this.allFlatmates = this.flat.flatmates
    this.item.idsOfFlatmatesThatShareThis = this.flat.flatmates.map(flatmate => flatmate.id)
    this.item.depreciationRate = this.flat.depreciationRate
    this.item.lowestPriceRate = this.flat.lowestPriceRate
    fetchFlatItemsAndStoreInFlatWithId(this.flatId)
  },
  methods: {
    goToFlat () {
      this.$router.push({ name: 'Flat', params: { flatId: this.flatId } })
    },
    save () {
      this.$store.dispatch('addItem', this.item).then(() => {
        this.$router.push({ name: 'Flat', params: { flatId: this.flatId } })
      })
    }
  }
}
</script>
