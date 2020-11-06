<template>
  <div>
    <v-app-bar app flat color="primary" dark prominent hide-on-scroll>
      <v-btn icon @click="$router.go(-1)">
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

      <div v-show="moveOutDate">
        <v-divider />

        <Sheet>
          When {{ flatmate.name }} moves out on {{ moveOutDate | humanReadable }}, they should get back a total of
          <strong class="secondary--text">{{ totalDebt | round }}</strong> CHF
        </Sheet>

        <v-divider/>

        <BalancesList :balances="debt">
          <template #rowText="{ balance }">
            {{ balance.flatmate.name }} pays
            <strong class="secondary--text">
              {{ balance.share | round }}
            </strong>
            CHF
          </template>
        </BalancesList>

        <v-divider />

        <div class="d-flex justify-center ma-5">
          <v-btn color="primary" @click="downloadBreakdown">1. Download breakdown report</v-btn>
        </div>

        <v-divider />

        <div class="d-flex justify-center ma-5">
          <v-btn color="warning" @click="removeFlatmate" :disabled="!isReportDownloaded">2. Remove flatmate</v-btn>
        </div>
      </div>
    </v-main>
    <Snackbar v-model="isSnackbarVisible" icon="mdi-download" :text="snackbarText" color="success" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { calculateItemValueOnDate } from '@/utils/utils'
import { getFlatFromStateById, fetchFlatItemsAndStoreInFlatWithId } from '@/utils/getters'
import { generateBreakdown } from '@/utils/pdf'

import Avatar from '@/components/Avatar.vue'
import Sheet from '@/components/Sheet.vue'
import BalancesList from '@/components/BalancesList.vue'
import Snackbar from '@/components/Snackbar.vue'

export default {
  components: {
    Avatar,
    Sheet,
    BalancesList,
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
      flatmatesDebtToPersonLeaving: {},
      debt: [],
      totalDebt: 0,
      sharePerItem: [],
      isReportDownloaded: false,
      isSnackbarVisible: false,
      snackbarText: 'Downloaded! Check your notification bar.'
    }
  },
  computed: {
    ...mapGetters([
      'currentFlatmates'
    ])
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
  },
  methods: {
    calculateDebt () {
      this.debt = []
      this.sharePerItem = []
      this.totalDebt = 0
      const remainingFlatmates = this.currentFlatmates(this.flatId).filter(flatmate => flatmate.id !== this.flatmate.id)
      remainingFlatmates.forEach(flatmate => {
        this.flatmatesDebtToPersonLeaving[flatmate.id] = 0
      })
      const items = this.flat.items.filter(item => item.idsOfFlatmatesThatShareThis.includes(this.flatmate.id) &&
                                                 item.date <= this.moveOutDate)
      items.forEach(item => {
        const valueOnDate = calculateItemValueOnDate(item, this.moveOutDate)
        const idsOfFlatmatesMovedInByChosenDate = item.idsOfFlatmatesThatShareThis.filter(id => {
          const flatmate = this.currentFlatmates(this.flatId).find(flatmate => flatmate.id === id)
          return !!flatmate && flatmate.startDate <= this.moveOutDate
        })
        const numberOfFlatmatesSharingThisOnMoveOutDate = idsOfFlatmatesMovedInByChosenDate.length
        const shareOfFlatmateLeaving = valueOnDate / numberOfFlatmatesSharingThisOnMoveOutDate
        const shareSplitAmongstRemainingFlatmates = shareOfFlatmateLeaving / (numberOfFlatmatesSharingThisOnMoveOutDate - 1)

        idsOfFlatmatesMovedInByChosenDate.filter(id => id !== this.flatmate.id).forEach(id => {
          this.flatmatesDebtToPersonLeaving[id] += shareSplitAmongstRemainingFlatmates
          this.totalDebt += shareSplitAmongstRemainingFlatmates
        })

        this.sharePerItem.push({
          item: item,
          share: shareOfFlatmateLeaving
        })
      })

      remainingFlatmates.forEach(flatmate => {
        this.debt.push({
          flatmate,
          share: this.flatmatesDebtToPersonLeaving[flatmate.id]
        })
      })
    },
    async downloadBreakdown () {
      const data = this.sharePerItem.map(itemShare => {
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
      generateBreakdown(this.flatmate, this.moveOutDate, Math.floor(this.totalDebt * 100) / 100, data).then(() => {
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
