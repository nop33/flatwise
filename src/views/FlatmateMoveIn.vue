<template>
  <div>
    <v-app-bar app flat color="primary" dark prominent hide-on-scroll>
      <v-btn icon @click="back">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <div v-if="flatmate.name" class="absolute-toolbar-content d-flex flex-column justify-space-between my-3">
        <div class="mx-10 text-truncate text-center text-h6 d-flex flex-column align-center">
          <Avatar :user="flatmate" border />
          <span class="mt-2">{{ flatmate.name }}</span>
        </div>
      </div>
    </v-app-bar>
    <v-main>
      <FlatmateDebtCalculator
        v-if="flat.items"
        v-model="calculatorData"
        :flat="flat"
        :flatmate="flatmate"
        :date="flatmate.startDate"
      >
        <template #descriptionText="{ totalDebt }">
          {{ flatmate.name }} has to pay a total of
          <strong class="secondary--text">{{ totalDebt | round }}</strong> CHF
          before moving in on {{ flatmate.startDate | humanReadable }}
        </template>

        <template #balanceRowText="{ balance }">
          {{ balance.flatmate.name }} gets back
          <strong class="secondary--text">
            {{ balance.share | round }}
          </strong>
          CHF
        </template>
      </FlatmateDebtCalculator>

      <v-divider />

      <div class="d-flex justify-center ma-5">
        <v-btn block color="primary" @click="downloadBreakdown">Download breakdown report</v-btn>
      </div>
    </v-main>
    <!-- TODO: DRY -->
    <Snackbar v-model="isSnackbarVisible" icon="mdi-download" :text="snackbarText" color="success" />
  </div>
</template>

<script>

import { generateMoveInReport } from '@/utils/pdf'

import Avatar from '@/components/Avatar.vue'
import Snackbar from '@/components/Snackbar.vue'
import FlatmateDebtCalculator from '@/components/FlatmateDebtCalculator.vue'

export default {
  components: {
    Avatar,
    Snackbar,
    FlatmateDebtCalculator
  },
  props: [
    'flatId',
    'flatmateId'
  ],
  data: () => {
    return {
      flat: {},
      flatmate: {},
      flatmatesDebtToPersonLeaving: {},
      isReportDownloaded: false,
      isSnackbarVisible: false,
      snackbarText: 'Downloaded! Check your notification bar.',
      calculatorData: {}
    }
  },
  async created () {
    this.flat = this.$store.getters.currentFlat
    if (!this.flat.items) {
      await this.$store.dispatch('fetchCurrentFlatItems')
    }
    this.flatmate = this.flat.flatmates.find(flatmate => flatmate.id === this.flatmateId)
  },
  methods: {
    back () {
      this.$router.push({ name: 'Edit Flatmate', params: { flatId: this.flatId, flatmateId: this.flatmateId } })
    },
    async downloadBreakdown () {
      const data = this.calculatorData.sharePerItem.map(itemShare => {
        const item = itemShare.item
        const dataObject = {}
        dataObject.itemName = item.name
        dataObject.itemPurchaseDate = item.date
        dataObject.initialPrice = `${item.price} CHF`
        dataObject.annualDepreciationRate = `${item.depreciationRate}%`
        dataObject.share = `${Math.floor(itemShare.share * 100) / 100} CHF`
        return dataObject
      })

      const roundedTotal = Math.floor(this.calculatorData.totalDebt * 100) / 100
      generateMoveInReport(this.flatmate, roundedTotal, data, this.calculatorData.debt).then(() => {
        this.isReportDownloaded = true
        this.isSnackbarVisible = true
      })
    }
  }
}
</script>
