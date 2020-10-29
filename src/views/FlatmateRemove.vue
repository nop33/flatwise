<template>
  <div>
    <v-app-bar app flat color="primary" dark prominent hide-on-scroll>
      <v-btn icon @click="goToFlatSettings">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <div class="absolute-toolbar-content d-flex flex-column justify-space-between my-3">
        <div class="mx-10 text-truncate text-center text-h6 d-flex flex-column align-center">
          <Avatar :user="flatmate" border />
          <span class="mt-2">{{ flatmate.name }}</span>
        </div>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row>
          <v-col md="6">
            <v-dialog ref="endDateDialog" :return-value.sync="moveOutDate" width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="moveOutDate"
                  label="Move out date"
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
                  readonly
                  required
                  hide-details="auto"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="moveOutDate"
                @input="$refs.endDateDialog.save(moveOutDate)"
                scrollable
              ></v-date-picker>
            </v-dialog>
          </v-col>
        </v-row>
      </v-container>

      <v-divider/>

      <Sheet>
        When {{ flatmate.name }} moves out on {{ moveOutDate | humanReadable }}, they should get back a total of
        <strong class="secondary--text">{{ totalDebt | round }}</strong> CHF
      </Sheet>

      <v-divider/>

      <BalancesList :balances="debt" />

      <v-divider />
    </v-main>
  </div>
</template>

<script>
import { calculateItemValueOnDate } from '@/utils/utils'
import { getFlatFromStateById, fetchFlatItemsAndStoreInFlatWithId } from '@/utils/getters'

import Avatar from '@/components/Avatar.vue'
import Sheet from '@/components/Sheet.vue'
import BalancesList from '@/components/BalancesList.vue'

export default {
  components: {
    Avatar,
    Sheet,
    BalancesList
  },
  props: [
    'flatId',
    'flatmateId'
  ],
  data: () => {
    return {
      flat: {},
      flatmate: {},
      moveOutDate: new Date().toJSON().slice(0, 10),
      flatmatesDebtToPersonLeaving: {},
      debt: [],
      totalDebt: 0
    }
  },
  watch: {
    moveOutDate () {
      this.calculateDebt()
    }
  },
  async created () {
    this.flat = getFlatFromStateById(this.flatId)
    this.flatmate = this.flat.flatmates.find(flatmate => flatmate.id === this.flatmateId)
    if (!this.flat.items) {
      await fetchFlatItemsAndStoreInFlatWithId(this.flatId)
    }
    this.calculateDebt()
  },
  methods: {
    goToFlatSettings () {
      this.$router.push({ name: 'Edit Flat', params: { flatId: this.flatId } })
    },
    calculateDebt () {
      this.debt = []
      this.totalDebt = 0
      const remainingFlatmates = this.flat.flatmates.filter(flatmate => flatmate.id !== this.flatmate.id)
      remainingFlatmates.forEach(flatmate => {
        this.flatmatesDebtToPersonLeaving[flatmate.id] = 0
      })
      const items = this.flat.items.filter(item => item.idsOfFlatmatesThatShareThis.includes(this.flatmate.id) &&
                                                 item.date <= this.moveOutDate)
      items.forEach(item => {
        const valueOnDate = calculateItemValueOnDate(item, this.moveOutDate)
        item.idsOfFlatmatesThatShareThis.filter(id => id !== this.flatmate.id).forEach(id => {
          const numberOfFlatmatesSharingThis = item.idsOfFlatmatesThatShareThis.length
          const shareOfFlatmateLeaving = valueOnDate / numberOfFlatmatesSharingThis
          const shareSplitAmongstRemainingFlatmates = shareOfFlatmateLeaving / (numberOfFlatmatesSharingThis - 1)
          this.flatmatesDebtToPersonLeaving[id] += shareSplitAmongstRemainingFlatmates
          this.totalDebt += shareSplitAmongstRemainingFlatmates
        })
      })

      remainingFlatmates.forEach(flatmate => {
        this.debt.push({
          flatmate,
          share: this.flatmatesDebtToPersonLeaving[flatmate.id]
        })
      })
    }
  }
}
</script>
