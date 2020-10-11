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

      <v-divider/>

      <v-sheet color="grey lighten-3">
        <v-container>
          <v-row>
            <v-col>
              As of {{ humanReadableDate }}, the total worth of all items is
              <span class="warning--text">{{ totalValue | round }}</span>
              CHF
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>

      <v-divider/>

      <v-list class="balances-list">
        <v-list-item-group v-model="selectedFlatmateIndex">
          <template v-for="(balance, index) in balances">
            <v-list-item :key="index">
              <v-list-item-avatar>
                <v-avatar color="primary">
                  <span class="white--text">{{ balance.flatmateName.substring(0, 2).toUpperCase() }}</span>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ balance.flatmateName }} share is
                  <span class="warning--text">
                    {{ balance.share | round }}
                  </span>
                  CHF
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-main>
  </div>
</template>

<script>
import { flatmateIdsOrEmails, calculateDaysBetween } from '@/utils/utils'

export default {
  props: [
    'flatId',
    'getFlat',
    'getFlatItems'
  ],
  data: () => {
    return {
      balanceOnDate: new Date().toJSON().slice(0, 10),
      dateRules: [
        v => !!v || 'Date is required'
      ],
      selectedFlatmateIndex: null,
      flat: {},
      balances: [],
      totalValue: 0
    }
  },
  computed: {
    humanReadableDate () {
      const date = new Date(this.balanceOnDate)
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      return new Intl.DateTimeFormat('en-GB', options).format(date)
    }
  },
  watch: {
    balanceOnDate () {
      this.calculateBalances()
    }
  },
  async created () {
    this.flat = this.getFlat(this.flatId)
    if (!this.flat.items) {
      await this.getFlatItems(this.flatId)
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
        flatmateIdsOrEmails(this.flat).forEach(id => {
          flatmatesBalances[id] = 0
        })

        this.totalValue = 0
        this.flat.items.forEach(item => {
          const daysSincePurchase = this.calculateNumberOfDaysOwned(item.date)
          const dailyDepreciationRate = item.depreciationRate / 100 / 365
          const depreciation = daysSincePurchase * dailyDepreciationRate * item.price
          const lowestPrice = item.price * item.lowestPriceRate / 100
          const valueAfterDepreciation = item.price - depreciation
          const valueOnDate = Math.max(valueAfterDepreciation, lowestPrice)
          this.totalValue += valueOnDate

          item.idsOfFlatmatesThatShareThis.forEach(flatmateId => {
            flatmatesBalances[flatmateId] += valueOnDate / item.idsOfFlatmatesThatShareThis.length
          })
        })

        for (const [flatmateId, share] of Object.entries(flatmatesBalances)) {
          const flatmate = this.flat.flatmates.find(flatmate => flatmate.id === flatmateId)
          balances.push({
            flatmateName: flatmate ? flatmate.name : flatmateId,
            share
          })
        }
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
