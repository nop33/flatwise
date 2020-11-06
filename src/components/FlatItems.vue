<template>
  <v-card flat class="mb-16">
    <v-list>
      <v-list-item-group v-model="selectedItemIndex">
        <template v-for="(item, index) in sortedItems">
          <v-list-item :key="item.id">
            <v-list-item-icon>
              <v-icon>mdi-seat-outline</v-icon>
            </v-list-item-icon>
            <FlatItemsListItemContent :item="item" :flatId="flat.id" />
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
  props: [
    'flat'
  ],
  data: () => {
    return {
      selectedItemIndex: null
    }
  },
  computed: {
    sortedItems () {
      return this.flat.items ? [...this.flat.items].sort((a, b) => (a.date < b.date) ? 1 : -1) : []
    }
  },
  watch: {
    selectedItemIndex (newValue) {
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
  },
  methods: {
    getFlatmatesThatShareThis (item) {
      return this.currentFlatmates(this.flat.id).filter(flatmate => item.idsOfFlatmatesThatShareThis.includes(flatmate.id))
    }
  }
}
</script>
