<template>
  <div>
    <v-app-bar app flat color="primary" dark prominent hide-on-scroll >
      <v-btn icon @click="goToFlat">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>
        <div class="text-truncate">{{ item.name }}</div>
        <div class="mt-2">{{ item.price }} CHF</div>
        <div class="text-caption mt-1">Bought on {{ item.date | humanReadable }}</div>
      </v-toolbar-title>
      <v-btn color="secondary" dark absolute bottom right fab :to="{ name: 'Edit Item', params: { flatId, itemId } }">
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main v-if="item.idsOfFlatmatesThatShareThis">
      <v-list>
        <v-subheader class="font-weight-medium">Shared amongst</v-subheader>
        <v-list-item v-for="flatmate in getFlatmatesThatShareThis(item)" :key="flatmate.id">
          <v-list-item-avatar>
            <Avatar :user="flatmate" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ flatmate.name || flatmate.email }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider/>

      <v-card flat>

        <v-card-subtitle class="font-weight-medium">Price details</v-card-subtitle>
        <v-card-text>
          <div>Loses its value by <strong>{{ item.depreciationRate }}%</strong> each year</div>
          <div class="mt-2">
            It was bought
            <strong>{{ numberOfDaysOwned }}</strong>
            days ago, so it has lost its value by
            <strong>{{ 100 - currentValuePercentage | round }}%</strong>
            so far and its current value is
            <strong>{{ currentValue | round }} CHF</strong>
          </div>
          <v-progress-linear class="mt-2" :value="currentValuePercentage" rounded></v-progress-linear>
        </v-card-text>

      </v-card>

      <v-divider/>

      <div class="d-flex justify-center ma-5">
        <v-btn color="warning" @click="deleteItem">Delete item</v-btn>
      </div>
    </v-main>
  </div>
</template>

<script>
import { calculateDaysBetween, calculateItemValueOnDate } from '@/utils/utils'

import { getFlatFromStateById, fetchFlatItemsAndStoreInFlatWithId } from '@/utils/getters'

import Avatar from '@/components/Avatar.vue'

export default {
  components: {
    Avatar
  },
  props: [
    'flatId',
    'itemId'
  ],
  data: () => {
    return {
      flat: {},
      item: {},
      today: new Date().toJSON().slice(0, 10)
    }
  },
  async created () {
    this.flat = getFlatFromStateById(this.flatId)
    if (!this.flat.items) {
      await fetchFlatItemsAndStoreInFlatWithId(this.flatId)
    }
    this.item = this.flat.items.find(item => item.id === this.itemId)
  },
  computed: {
    numberOfDaysOwned () {
      return Math.floor(calculateDaysBetween(this.item.date, this.today))
    },
    currentValue () {
      return calculateItemValueOnDate(this.item, this.today)
    },
    currentValuePercentage () {
      return (this.currentValue / this.item.price) * 100
    }
  },
  methods: {
    goToFlat () {
      this.$router.push({ name: 'Flat', params: { flatId: this.flatId } })
    },
    deleteItem () {
      if (confirm(`Are you sure you wanna delete the "${this.item.name}"?`)) {
        this.$store.dispatch('deleteItem', this.item).then(this.goToFlat)
      }
    },
    getFlatmatesThatShareThis (item) {
      return this.flat.flatmates.filter(flatmate => item.idsOfFlatmatesThatShareThis.includes(flatmate.id))
    }
  }
}
</script>
