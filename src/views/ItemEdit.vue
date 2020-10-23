<template>
  <div>
    <v-toolbar flat color="primary" dark fixed>
      <v-btn icon @click="goToItem">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Edit item</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text large @click="save">Save</v-btn>
    </v-toolbar>
    <v-main>
      <ItemForm v-model="item" :allFlatmates="allFlatmates" />
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
    'itemId',
    'getFlat',
    'getFlatItems'
  ],
  data: () => {
    return {
      flat: {},
      item: {},
      allFlatmates: []
    }
  },
  async created () {
    this.flat = this.getFlat(this.flatId)
    this.allFlatmates = this.flat.flatmates
    if (!this.flat.items) {
      await this.getFlatItems(this.flatId)
    }
    this.item = this.flat.items.find(item => item.id === this.itemId)
  },
  methods: {
    goToItem () {
      this.$router.push({ name: 'Item', params: { flatId: this.flatId, itemId: this.itemId } })
    },
    save () {
      this.$store.dispatch('updateItem', this.item).then(this.goToItem)
    }
  }
}
</script>
