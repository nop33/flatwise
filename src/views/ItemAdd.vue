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
      <ItemForm :item="item" :flatmates="flat.flatmates" />
    </v-main>
  </div>
</template>

<script>
import ItemForm from '@/components/ItemForm.vue'

export default {
  components: {
    ItemForm
  },
  props: [
    'flatId',
    'getFlat',
    'getFlatItems'
  ],
  data: () => {
    return {
      flat: {},
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
  created () {
    this.flat = this.getFlat(this.flatId)
    this.item.shareAmongst = [...this.flat.flatmates]
    this.item.depreciationRate = this.flat.depreciationRate
    this.item.lowestPriceRate = this.flat.lowestPriceRate
    this.getFlatItems(this.flatId)
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
