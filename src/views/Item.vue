<template>
  <div>
    <v-app-bar app flat color="primary" dark prominent hide-on-scroll >
      <v-btn icon @click="back">
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
        <v-list-item-group v-model="selectedFlatmateIndex" color="primary">
          <FlatmateListItem v-for="flatmate in flatmatesThatShareThis" :flatmate="flatmate" :key="flatmate.id" />
        </v-list-item-group>
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

      <!-- TODO: Create component -->
      <div v-if="pastFlatmatesThatSharedThis.length">
        <v-divider/>
        <v-list>
          <v-subheader class="font-weight-medium">Past flatmates that shared this</v-subheader>
          <v-list-item v-for="flatmate in pastFlatmatesThatSharedThis" :key="flatmate.id">
            <v-list-item-avatar>
              <Avatar :user="flatmate" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ flatmate.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>

      <v-divider/>

      <div class="d-flex justify-center ma-5">
        <v-btn color="warning" text @click="deleteItem">
          <v-icon left>mdi-trash-can-outline</v-icon>
          Delete item
        </v-btn>
      </div>

    </v-main>
  </div>
</template>

<script>
import { calculateDaysBetween, calculateItemValueOnDate } from '@/utils/utils'

import Avatar from '@/components/Avatar.vue'
import FlatmateListItem from '@/components/FlatmateListItem.vue'

export default {
  components: {
    Avatar,
    FlatmateListItem
  },
  props: [
    'flatId',
    'itemId',
    'backButtonCallback'
  ],
  data: () => {
    return {
      flat: {},
      item: {},
      today: new Date().toJSON().slice(0, 10),
      selectedFlatmateIndex: null
    }
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
    },
    flatmatesThatShareThis () {
      return this.$store.getters.currentFlatmates.filter(flatmate => {
        return this.item.idsOfFlatmatesThatShareThis.includes(flatmate.id)
      })
    },
    pastFlatmatesThatSharedThis () {
      return this.$store.getters.pastFlatmates.filter(flatmate => {
        return this.item.idsOfFlatmatesThatShareThis.includes(flatmate.id)
      })
    }
  },
  watch: {
    selectedFlatmateIndex (flatmateIndex) {
      const flatmateId = this.flatmatesThatShareThis[flatmateIndex].id
      this.$router.push({ name: 'Edit Flatmate', params: { flatId: this.flatId, flatmateId } })
    }
  },
  async created () {
    this.flat = this.$store.getters.currentFlat
    if (!this.flat.items) {
      await this.$store.dispatch('fetchCurrentFlatItems')
    }
    this.item = this.flat.items.find(item => item.id === this.itemId)
  },
  methods: {
    back () {
      this.backButtonCallback ? this.backButtonCallback() : this.goToFlat()
    },
    goToFlat () {
      this.$router.push({ name: 'Flat', params: { flatId: this.flatId } })
    },
    deleteItem () {
      if (confirm(`Are you sure you wanna delete the "${this.item.name}"?`)) {
        this.$store.dispatch('deleteItem', this.item).then(this.goToFlat)
      }
    }
  }
}
</script>
