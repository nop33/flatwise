<template>
  <div>
    <AppBarThin :backButtonCallback="back" :title="pageTitle" :actionButtonCallback="save" actionButtonText="Save" />
    <v-main>
      <div class="d-flex justify-center ma-5">
        <v-btn color="primary" @click="selectAll = !selectAll">{{ selectAllLabel }}</v-btn>
      </div>

      <v-divider/>

      <v-list flat>
        <v-list-item-group v-model="checkedItems" multiple>
          <template v-for="(item, index) in sortedItems">
            <v-list-item :key="item.id">
              <template v-slot:default="{ active }">
                <v-list-item-action>
                  <v-checkbox :input-value="active" color="primary"></v-checkbox>
                </v-list-item-action>
                <FlatItemsListItemContent :item="item" />
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
import { getFirstName } from '@/utils/utils'
import { initializeFlatAndItems } from '@/utils/mixins'

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
    },
    selectAllLabel () {
      return this.selectAll ? 'Reset to current items' : 'Select all'
    }
  },
  watch: {
    selectAll (newValue) {
      if (newValue === true) {
        this.checkedItems = [...Array(this.flat.items.length).keys()]
      } else {
        this.checkedItems = this.initialCheckedItems
      }
    },
    'flat.items' (newValue) {
      if (!newValue) {
        return
      }
      this.initialItemIds = this.flat.items
        .filter(item => item.idsOfFlatmatesThatShareThis.includes(this.flatmate.id))
        .map(item => item.id)
      this.sortedItems.forEach((item, index) => {
        if (item.idsOfFlatmatesThatShareThis.includes(this.flatmate.id)) {
          this.checkedItems.push(index)
        }
      })
      this.initialCheckedItems = [...this.checkedItems]
      // page form is always valid here
      this.$store.commit('SET_PAGE_FORM_VALIDITY', true)
    }
  },
  mixins: [
    initializeFlatAndItems
  ],
  created () {
    this.flatmate = this.flat.flatmates.find(flatmate => flatmate.id === this.flatmateId)
  },
  methods: {
    back () {
      this.$router.push({ name: 'Flatmate Edit', params: { flatId: this.flatId, flatmateId: this.flatmateId } })
    },
    save () {
      const checkedItemIds = this.checkedItems.map(index => this.sortedItems[index].id)
      const itemIdsToBeRemovedFrom = this.initialItemIds.filter(itemId => !checkedItemIds.includes(itemId))
      const itemIdsToBeAddedAt = checkedItemIds.filter(itemId => !this.initialItemIds.includes(itemId))
      this.$store.dispatch('updateFlatmateItems', {
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
