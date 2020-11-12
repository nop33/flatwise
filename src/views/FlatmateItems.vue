<template>
  <div>
    <AppBarThin
      :backButtonCallback="back"
      :title="pageTitle"
      :actionButtonCallback="save"
      actionButtonText="Save"
    />
    <v-main>
      <v-card flat>
        <v-card-text>
          <v-checkbox v-model="selectAll" color="secondary" label="Select all"></v-checkbox>
        </v-card-text>
      </v-card>

      <v-divider/>

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
import AppBarThin from '@/components/AppBarThin.vue'

export default {
  components: {
    FlatItemsListItemContent,
    AppBarThin
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
      initialItemIds: [],
      initialCheckedItems: [],
      selectAll: false
    }
  },
  computed: {
    sortedItems () {
      return this.flat.items ? [...this.flat.items].sort((a, b) => (a.date < b.date) ? 1 : -1) : []
    },
    pageTitle () {
      return `${getFirstName(this.flatmate.name)}'s items`
    }
  },
  watch: {
    selectAll (newValue) {
      if (newValue === true) {
        this.checkedItems = [...Array(this.flat.items.length).keys()]
      } else {
        this.checkedItems = this.initialCheckedItems
      }
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
    this.initialCheckedItems = [...this.checkedItems]
    // page form is always valid here
    this.$store.dispatch('setPageFormValidity', true)
  },
  methods: {
    back () {
      this.$router.push({ name: 'Edit Flatmate', params: { flatId: this.flatId, flatmateId: this.flatmateId } })
    },
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
