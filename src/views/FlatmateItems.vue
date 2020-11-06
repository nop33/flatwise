<template>
  <div>
    <v-toolbar flat color="primary" dark fixed>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{ firstName }}'s items</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text large @click="save">Save</v-btn>
    </v-toolbar>
    <v-main>
      <v-list flat>
        <v-list-item-group v-model="checkedItems" multiple>
          <template v-for="(item, index) in sortedItems">
            <v-list-item :key="item.id">
              <template v-slot:default="{ active }">
                <v-list-item-action>
                  <v-checkbox :input-value="active" color="primary"></v-checkbox>
                </v-list-item-action>
                <FlatItemsListItemContent :item="item" :flatId="flat.id" />
                <!-- TODO: Go to item details, but save state when going back -->
                <!-- <v-list-item-icon @click.stop="iconClicked">
                  <v-icon>mdi-information-outline</v-icon>
                </v-list-item-icon> -->
              </template>
            </v-list-item>
            <v-divider :key="index"></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </v-main>
  </div>
</template>

<script>
import { getFlatFromStateById, fetchFlatItemsAndStoreInFlatWithId } from '@/utils/getters'
import { getFirstName } from '@/utils/utils'

import FlatItemsListItemContent from '@/components/FlatItemsListItemContent.vue'

export default {
  components: {
    FlatItemsListItemContent
  },
  props: [
    'flatId',
    'flatmateId'
  ],
  data: () => {
    return {
      flat: {},
      flatmate: {},
      checkedItems: [],
      initialItemIds: []
    }
  },
  computed: {
    firstName () {
      return getFirstName(this.flatmate.name)
    },
    sortedItems () {
      return this.flat.items ? [...this.flat.items].sort((a, b) => (a.date < b.date) ? 1 : -1) : []
    }
  },
  async created () {
    this.flat = getFlatFromStateById(this.flatId)
    this.flatmate = this.flat.flatmates.find(flatmate => flatmate.id === this.flatmateId)
    if (!this.flat.items) {
      await fetchFlatItemsAndStoreInFlatWithId(this.flat.id)
    }
    this.initialItemIds = this.flat.items.filter(item => item.idsOfFlatmatesThatShareThis.includes(this.flatmate.id))
      .map(item => item.id)
    this.sortedItems.forEach((item, index) => {
      if (item.idsOfFlatmatesThatShareThis.includes(this.flatmate.id)) {
        this.checkedItems.push(index)
      }
    })
  },
  methods: {
    save () {
      const checkedItemIds = this.checkedItems.map(index => this.sortedItems[index].id)
      const itemIdsToBeRemovedFrom = this.initialItemIds.filter(itemId => !checkedItemIds.includes(itemId))
      const itemIdsToBeAddedAt = checkedItemIds.filter(itemId => !this.initialItemIds.includes(itemId))
      this.$store.dispatch('updateFlatmateItems', {
        flatId: this.flatId,
        flatmate: this.flatmate,
        itemIdsToBeRemovedFrom,
        itemIdsToBeAddedAt
      }).then(() => {
        this.$router.push({ name: 'Flat', params: { flatId: this.flatId } })
      })
    }
  }
}
</script>
