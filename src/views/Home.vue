<template>
  <div class="home">
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="depreciationRate"
              :rules="rateRules"
              type="number"
              label="Annual depreciation rate (%)"
              required
            ></v-text-field>
          </v-col>

        <v-col
            cols="12"
            md="4"
          >
            <v-dialog
              ref="dialog"
              :return-value.sync="date"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Move out date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" scrollable @input="$refs.dialog.save(date)"></v-date-picker>
            </v-dialog>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="total"
              label="Total"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-container>
      <v-row justify="center">
        <v-col md="8">
          <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page="20"
            class="elevation-1"
          ></v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  data () {
    return {
      // table data
      headers: [
        {
          text: 'Item',
          align: 'start',
          sortable: false,
          value: 'name'
        },
        { text: 'Price', value: 'price' },
        { text: 'Purchace Date', value: 'date' },
        { text: 'Number of days since purchace', value: 'noDaysBetween' },
        { text: 'Price on move out date', value: 'priceOnMoveOutDate' }
      ],
      // form data
      valid: false,
      depreciationRate: 20,
      lastname: '',
      rateRules: [
        v => !!v || 'Rate is required',
        v => (v >= 0 && v <= 100) || 'Rate must be between 0 and 100'
      ],
      date: new Date().toISOString().substr(0, 10),
      dateRules: [
        v => !!v || 'Date is required'
        // TODO: Add rule to not allow past dates
      ]
    }
  },
  computed: {
    items () {
      const items = [...this.$store.state.items]
      items.forEach(item => {
        item.noDaysBetween = this.calculateNumberOfDaysOwned(item.date)
        item.priceOnMoveOutDate = this.calculatePriceOnMoveOutDate(item)
      })
      return items
    },
    total () {
      let total = 0
      this.items.forEach(item => {
        total += item.priceOnMoveOutDate
      })
      return total
    }
  },
  methods: {
    calculatePriceOnMoveOutDate (item, rate) {
      return Math.floor(item.price - (item.noDaysBetween * (this.depreciationRate / 100 / 365) * item.price))
    },
    calculateNumberOfDaysOwned (date) {
      return Math.floor(daysBetween(date, this.date))
    }
  }
}

function treatAsUTC (date) {
  var result = new Date(date)
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset())
  return result
}

function daysBetween (startDate, endDate) {
  var millisecondsPerDay = 24 * 60 * 60 * 1000
  return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay
}
</script>
