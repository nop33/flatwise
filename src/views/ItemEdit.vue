<template>
  <div>
    <AppBarThin :backButtonCallback="back" title="Edit item" :actionButtonCallback="save" actionButtonText="Save" />
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
    'flatId',
    'itemId'
  ],
  data: () => {
    return {
      flat: {},
      item: {},
      allFlatmates: []
    }
  },
  async created () {
    this.flat = this.$store.getters.currentFlat
    if (!this.flat.items) {
      await this.$store.dispatch('fetchCurrentFlatItems')
    }
    this.allFlatmates = this.$store.getters.currentFlatmates
    this.item = this.flat.items.find(item => item.id === this.itemId)
  },
  methods: {
    goToItem () {
      return this.$router.push({ name: 'Item', params: { flatId: this.flatId, itemId: this.itemId } })
    },
    back () {
      this.goToItem()
    },
    save () {
      this.$store.dispatch('updateItem', this.item).then(this.goToItem)
    }
  }
}
</script>
