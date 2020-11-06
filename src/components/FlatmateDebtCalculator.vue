<template>
  <div>
    <Sheet>
      <slot name="descriptionText" v-bind:totalDebt="totalDebt">
        Total debt of {{ flatmate.name }}
        on {{ flatmate.startDate | humanReadable }}
        is <strong class="secondary--text">{{ totalDebt | round }}</strong> CHF
      </slot>
    </Sheet>

    <v-divider/>

    <BalancesList :balances="debt">
      <template #rowText="{ balance }">
        <slot name="balanceRowText" v-bind:balance="balance"></slot>
      </template>
    </BalancesList>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { calculateItemValueOnDate } from '@/utils/utils'

import Sheet from '@/components/Sheet.vue'
import BalancesList from '@/components/BalancesList.vue'

export default {
  components: {
    Sheet,
    BalancesList
  },
  props: [
    'flat',
    'flatmate',
    'date',
    'value'
  ],
  data: () => {
    return {
      totalDebt: 0,
      debt: [],
      sharePerItem: []
    }
  },
  computed: {
    ...mapGetters([
      'currentFlatmates'
    ])
  },
  created () {
    this.calculateDebt()
  },
  methods: {
    calculateDebt () {
      const amountsPerFlatmate = {}

      this.debt = []
      this.sharePerItem = []
      this.totalDebt = 0

      const remainingFlatmates = this.currentFlatmates(this.flat.id).filter(flatmate => flatmate.id !== this.flatmate.id)
      remainingFlatmates.forEach(flatmate => {
        amountsPerFlatmate[flatmate.id] = 0
      })
      const items = this.flat.items.filter(item => item.idsOfFlatmatesThatShareThis.includes(this.flatmate.id) &&
                                                   item.date <= this.date)
      items.forEach(item => {
        const valueOnDate = calculateItemValueOnDate(item, this.date)
        const idsOfFlatmatesMovedInByDate = item.idsOfFlatmatesThatShareThis.filter(id => {
          const flatmate = this.currentFlatmates(this.flat.id).find(flatmate => flatmate.id === id)
          return !!flatmate && flatmate.startDate <= this.date
        })
        const numberOfFlatmatesSharingThisOnDate = idsOfFlatmatesMovedInByDate.length
        const shareOfFlatmateOfInterest = valueOnDate / numberOfFlatmatesSharingThisOnDate
        const shareSplitBetweenRemainingFlatmates = shareOfFlatmateOfInterest / (numberOfFlatmatesSharingThisOnDate - 1)

        idsOfFlatmatesMovedInByDate.filter(id => id !== this.flatmate.id).forEach(id => {
          amountsPerFlatmate[id] += shareSplitBetweenRemainingFlatmates
          this.totalDebt += shareSplitBetweenRemainingFlatmates
        })

        this.sharePerItem.push({
          item: item,
          share: shareOfFlatmateOfInterest
        })
      })

      remainingFlatmates.forEach(flatmate => {
        this.debt.push({
          flatmate,
          share: amountsPerFlatmate[flatmate.id]
        })
      })

      this.$emit('input', {
        debt: this.debt,
        totalDebt: this.totalDebt,
        sharePerItem: this.sharePerItem
      })
    }
  }
}
</script>
