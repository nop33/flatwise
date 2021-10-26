<template>
  <v-card flat class="mb-16">
    <v-text-field
      v-if="sortedItems.length > 0"
      solo
      flat
      hide-details
      placeholder="Search..."
      v-model="searchInput"
      prepend-inner-icon="mdi-magnify"
    />
    <v-divider />
    <v-list>
      <v-list-item-group v-model="selectedItemIndex">
        <template v-for="(item, index) in sortedItems">
          <v-list-item :key="item.id">
            <v-list-item-icon>
              <v-icon>mdi-seat-outline</v-icon>
            </v-list-item-icon>
            <FlatItemsListItemContent :item="item" />
          </v-list-item>
          <v-divider :key="index"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import FlatItemsListItemContent from '@/components/FlatItemsListItemContent.vue'

export default {
  components: {
    FlatItemsListItemContent
  },
  props: ['flat'],
  data: () => {
    return {
      selectedItemIndex: null,
      searchInput: ''
    }
  },
  computed: {
    sortedItems() {
      let items = []
      if (this.flat.items) {
        items = [...this.flat.items].sort((a, b) => (a.date < b.date ? 1 : -1))
      }
      if (this.searchInput.length >= 2) {
        items = items.filter((item) => item.name.toLowerCase().includes(this.searchInput.toLowerCase()))
      }
      return items
    }
  },
  watch: {
    selectedItemIndex(newValue) {
      if (newValue >= 0) {
        this.$router.push({
          name: 'Item',
          params: {
            flatId: this.flat.id,
            itemId: this.sortedItems[newValue].id
          }
        })
      }
    }
  }
}
</script>
