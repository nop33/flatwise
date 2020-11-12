<template>
  <div>
    <v-app-bar app flat color="primary" dark prominent hide-on-scroll>
      <v-btn icon @click="back">
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
                  label="Enter the move-out date"
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
                :min="flatmate.startDate"
              ></v-date-picker>
            </v-dialog>
          </v-col>
        </v-row>
      </v-container>

      <div v-if="moveOutDate">
        <v-divider />

        <FlatmateDebtCalculator
          v-if="flat.items"
          v-model="calculatorData"
          :flat="flat"
          :flatmate="flatmate"
          :date="moveOutDate"
        >
          <template #descriptionText="{ totalDebt }">
            When {{ flatmate.name }} moves out
            on {{ moveOutDate | humanReadable }},
            they should get back a total of <strong class="secondary--text">{{ totalDebt | round }}</strong> CHF
          </template>

          <template #balanceRowText="{ balance }">
            {{ balance.flatmate.name }} pays
            <strong class="secondary--text">
              {{ balance.share | round }}
            </strong>
            CHF
          </template>
        </FlatmateDebtCalculator>

        <v-divider />

        <div class="d-flex justify-center ma-5">
          <v-btn block color="primary" @click="downloadBreakdown">1. Download breakdown report</v-btn>
        </div>

        <div class="d-flex justify-center ma-5">
          <v-btn block color="warning" @click="removeFlatmate" :disabled="!isReportDownloaded">
            2. Remove flatmate
          </v-btn>
        </div>
      </div>
    </v-main>
    <!-- TODO: DRY -->
    <Snackbar v-model="isSnackbarVisible" icon="mdi-download" :text="snackbarText" color="success" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getFlatFromStateById, fetchFlatItemsAndStoreInFlatWithId } from '@/utils/getters'
import { generateMoveOutReport } from '@/utils/pdf'

import Avatar from '@/components/Avatar.vue'
import FlatmateDebtCalculator from '@/components/FlatmateDebtCalculator.vue'
import Snackbar from '@/components/Snackbar.vue'

export default {
  components: {
    Avatar,
    FlatmateDebtCalculator,
    Snackbar
  },
  props: [
    'flatId',
    'flatmateId'
  ],
  data: () => {
    return {
      flat: {},
      flatmate: {},
      moveOutDate: '',
      isReportDownloaded: false,
      isSnackbarVisible: false,
      snackbarText: 'Downloaded! Check your notification bar.',
      calculatorData: {}
    }
  },
  computed: {
    ...mapGetters([
      'currentFlatmates'
    ])
  },
  async created () {
    this.flat = getFlatFromStateById(this.flatId)
    this.flatmate = this.flat.flatmates.find(flatmate => flatmate.id === this.flatmateId)
    if (!this.flat.items) {
      await fetchFlatItemsAndStoreInFlatWithId(this.flatId)
    }
  },
  methods: {
    back () {
      this.$router.push({ name: 'Edit Flatmate', params: { flatId: this.flatId, flatmateId: this.flatmateId } })
    },
    async downloadBreakdown () {
      const data = this.calculatorData.sharePerItem.map(itemShare => {
        const item = itemShare.item
        const initialShare = Math.floor((item.price / item.idsOfFlatmatesThatShareThis.length) * 100) / 100
        const dataObject = {}
        dataObject.itemName = item.name
        dataObject.itemPurchaseDate = item.date
        dataObject.initialShare = `${initialShare} CHF`
        dataObject.annualDepreciationRate = `${item.depreciationRate}%`
        dataObject.share = `${Math.floor(itemShare.share * 100) / 100} CHF`
        return dataObject
      })

      const roundedTotal = Math.floor(this.calculatorData.totalDebt * 100) / 100
      generateMoveOutReport(this.flatmate, this.moveOutDate, roundedTotal, data, this.calculatorData.debt).then(() => {
        this.isReportDownloaded = true
        this.isSnackbarVisible = true
      })
    },
    removeFlatmate () {
      if (confirm(`Last confirmation before removing ${this.flatmate.name} from "${this.flat.name}"!`)) {
        this.$store.dispatch('removeFlatmate', {
          flatId: this.flatId,
          flatmate: this.flatmate,
          moveOutDate: this.moveOutDate
        }).then(() => {
          this.$router.push({ name: 'Flat', params: { flatId: this.flatId, flatmateRemoved: this.flatmate } })
        })
      }
    }
  }
}
</script>
