<template>
  <div>
    <AppBarThin :backButtonCallback="back" title="Edit item" :actionButtonCallback="save" actionButtonText="Save" />
    <v-main>
      <ItemForm v-model="item" :allFlatmates="allFlatmates" />
    </v-main>
  </div>
</template>

<script>
import { initializeFlatAndItems } from '@/utils/mixins'

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
  watch: {
    'flat.items' (newValue) {
      if (!newValue) {
        return
      }
      this.item = this.flat.items.find(item => item.id === this.itemId)
      this.allFlatmates = this.$store.getters.currentFlatmates
    }
  },
  mixins: [
    initializeFlatAndItems
  ],
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
