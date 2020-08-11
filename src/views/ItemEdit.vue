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
      <ItemForm :item="item" />
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
    'flatId',
    'itemId',
    'getFlatItems'
  ],
  data: () => {
    return {
      item: {}
    }
  },
  computed: {
    ...mapGetters([
      'flatItemById'
    ])
  },
  created () {
    const item = this.flatItemById(this.flatId, this.itemId)
    if (!item) {
      this.getFlatItems(this.flatId).then(() => {
        this.item = this.flatItemById(this.flatId, this.itemId)
      })
    } else {
      this.item = item
    }
  },
  methods: {
    goToItem () {
      this.$router.push({ name: 'Item', params: { flatId: this.flatId, itemId: this.itemId } })
    },
    save () {
      // todo
    }
  }
}
</script>
