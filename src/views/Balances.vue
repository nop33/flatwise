<template>
  <div>
    <v-toolbar flat color="primary" dark fixed>
      <v-btn icon @click="goToFlat">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Balances</v-toolbar-title>
    </v-toolbar>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <!-- TODO: Make new component to share with FlatmateRemove.vue -->
            <v-dialog ref="dialog" :return-value.sync="balanceOnDate" width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="balanceOnDate"
                  label="As of"
                  prepend-icon="mdi-calendar"
                  :rules="dateRules"
                  readonly
                  required
                  v-bind="attrs"
                  v-on="on"
                  flat
                  hide-details="auto"
                ></v-text-field>
              </template>
              <v-date-picker v-model="balanceOnDate" scrollable @input="$refs.dialog.save(balanceOnDate)"></v-date-picker>
            </v-dialog>
          </v-col>
        </v-row>
      </v-container>

      <v-divider />

      <Sheet>
        As of {{ balanceOnDate | humanReadable }}, the total worth of all items (after applying the depreciation rate of each)
        is <strong class="secondary--text">{{ totalValue | round }}</strong> CHF
      </Sheet>

      <v-divider />

      <BalancesList :balances="balances" />

      <v-divider />
    </v-main>
  </div>
</template>

<script>
import { calculateDaysBetween, calculateItemValueOnDate } from '@/utils/utils'
import { getFlatFromStateById, fetchFlatItemsAndStoreInFlatWithId } from '@/utils/getters'

import Sheet from '@/components/Sheet.vue'
import BalancesList from '@/components/BalancesList.vue'

export default {
  components: {
    Sheet,
    BalancesList
  },
  props: [
    'flatId'
  ],
  data: () => {
    return {
      balanceOnDate: new Date().toJSON().slice(0, 10),
      dateRules: [
        v => !!v || 'Date is required'
      ],
      flat: {},
      balances: [],
      totalValue: 0
    }
  },
  watch: {
    balanceOnDate () {
      this.calculateBalances()
    }
  },
  async created () {
    this.flat = getFlatFromStateById(this.flatId)
    if (!this.flat.items) {
      await fetchFlatItemsAndStoreInFlatWithId(this.flatId)
    }
    this.calculateBalances()
  },
  methods: {
    goToFlat () {
      this.$router.push({ name: 'Flat', params: { flatId: this.flatId } })
    },
    calculateNumberOfDaysOwned (date) {
      return Math.floor(calculateDaysBetween(date, this.balanceOnDate))
    },
    calculateBalances () {
      const balances = []
      this.totalValue = 0
      if (this.flat && this.flat.items) {
        const flatmatesBalances = {}
        this.flat.flatmates.map(flatmate => flatmate.id).forEach(id => {
          flatmatesBalances[id] = 0
        })

        this.flat.items.filter(item => item.date <= this.balanceOnDate).forEach(item => {
          const valueOnDate = calculateItemValueOnDate(item, this.balanceOnDate)
          const flatmatesMovedInByChosenDate = item.idsOfFlatmatesThatShareThis.filter(id => {
            const flatmate = this.flat.flatmates.find(flatmate => flatmate.id === id)
            return flatmate.startDate <= this.balanceOnDate
          })

          flatmatesMovedInByChosenDate.forEach(flatmateId => {
            flatmatesBalances[flatmateId] += valueOnDate / flatmatesMovedInByChosenDate.length
          })
          this.totalValue += valueOnDate
        })

        this.flat.flatmates.forEach(flatmate => {
          balances.push({
            flatmate,
            share: flatmatesBalances[flatmate.id]
          })
        })
      }

      this.balances = balances
    }
  }
}
</script>

<style lang="scss">
.balances-list .v-list-item__title {
  overflow: visible;
  white-space: normal;
}
</style>
