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
      <ItemForm :item="item" :flatmates="selectedFlat.flatmates" />
    </v-main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

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
      item: {
        name: '',
        price: '',
        date: '',
        shareAmongst: [],
        depreciationRate: 0,
        lowestPriceRate: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'selectedFlat'
    ])
  },
  created () {
    this.item.shareAmongst = [...this.selectedFlat.flatmates]
    this.item.depreciationRate = this.selectedFlat.depreciationRate
    this.item.lowestPriceRate = this.selectedFlat.lowestPriceRate
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
