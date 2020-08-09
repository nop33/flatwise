<template>
  <v-card flat>
    <v-list two-line>
      <v-list-item-group v-model="selectedItemIndex">
        <template v-for="(item, index) in flat.items">
        <v-list-item :key="item.id">
          <v-list-item-icon>
            <v-icon>mdi-seat-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
            <v-list-item-subtitle v-text="item.shareAmongst.join(', ')"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="index + 1 < flat.items.length" :key="index"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: [
    'flat'
  ],
  data: () => {
    return {
      selectedItemIndex: null
    }
  },
  watch: {
    selectedItemIndex (newValue) {
      if (newValue) {
        this.$router.push({
          name: 'Item',
          params: {
            flatId: this.flat.id,
            itemId: this.flat.items[newValue].id
          }
        })
      }
    }
  },
  created () {
    if (!this.flat.items.length) {
      this.$store.dispatch('fetchFlatItems', this.flat)
    }
  }
}
</script>
