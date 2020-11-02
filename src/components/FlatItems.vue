<template>
  <v-card flat class="mb-16">
    <v-list>
      <v-list-item-group v-model="selectedItemIndex">
        <template v-for="(item, index) in sortedItems">
        <v-list-item :key="item.id">
          <v-list-item-icon>
            <v-icon>mdi-seat-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <div class="d-flex justify-space-between align-center">
              <span>{{ item.name }}</span>
              <div class="flex-shrink-0 ml-3">
                <Avatar
                  v-for="flatmate in getFlatmatesThatShareThis(item)"
                  :key="flatmate.id"
                  size="24"
                  class="text-caption ml-1"
                  :user="flatmate"
                />
              </div>
            </div>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="index"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import Avatar from '@/components/Avatar.vue'

export default {
  components: {
    Avatar
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
    ...mapGetters([
      'currentFlatmates'
    ]),
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
