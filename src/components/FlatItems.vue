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
            <v-list-item-subtitle v-text="formatNames(item)"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="index + 1 < flat.items.length" :key="index"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import { namesFromIds } from '@/utils/utils'

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
      if (newValue >= 0) {
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
  methods: {
    formatNames (item) {
      return namesFromIds(this.flat, item.idsOfFlatmatesThatShareThis).join(', ')
    }
  }
}
</script>
