<template>
  <v-card flat>
    <v-list>
      <v-list-item-group v-model="selectedItemIndex">
        <v-list-item v-for="item in flat.items" :key="item.id">
          <v-list-item-icon>
            <v-icon>mdi-seat-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
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
