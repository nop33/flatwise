<template>
  <div class="home mb-15">
    <v-container v-if="flatmateMovingOut">
      <v-row>
        <v-col v-for="flatmate in flatmates" :key="flatmate">
          <v-card
            class="mx-auto blue lighten-5"
          >
            <v-card-text>
              {{ flatmate }} gets back <strong>{{ totalReimbursementFor[flatmate] }}</strong> CHF
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card
            class="mx-auto blue lighten-5"
          >
            <v-card-text>
              The new flatmate pays <strong>{{ totalForNewFlatmate }}</strong> CHF
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <v-dialog
              ref="dialog"
              :return-value.sync="moveOutDate"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="moveOutDate"
                  label="Move out date"
                  append-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="moveOutDate" scrollable @input="$refs.dialog.save(moveOutDate)"></v-date-picker>
            </v-dialog>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-select
              :items="flatmates"
              label="Who is leaving?"
              v-model="flatmateMovingOut"
            ></v-select>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-container>
      <v-row justify="center">
        <v-col>
          <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page="20"
            show-expand
            class="elevation-1"
          >
            <template v-slot:item.name="{ item }">
              <strong>{{ item.name }}</strong>
            </template>
            <template v-slot:item.noDaysBetween="{ item }">
              {{ calculateNumberOfDaysOwned(item.date) }}
            </template>
            <template v-slot:item.priceOnMoveOutDate="{ item }">
              {{ calculatePriceOnMoveOutDate(item) }}
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length" class="text-right">
                <v-btn
                  class="mr-5 my-5 primary white--text"
                  :to="`edit/${item.id}`"
                >
                  <v-icon left>mdi-pencil</v-icon> Edit
                </v-btn>
                <v-btn
                  class="my-5 red white--text"
                  @click="deleteItem(item)"
                >
                  <v-icon left>mdi-delete</v-icon> Delete
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
    <v-btn
      fab
      color="red white--text"
      bottom
      right
      fixed
      to="/add"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'

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
        { text: 'Price (CHF)', value: 'price' },
        { text: 'Purchace date', value: 'date' },
        { text: 'Days since purchace', value: 'noDaysBetween' },
        { text: 'Price on move out date (CHF)', value: 'priceOnMoveOutDate' },
        { value: 'data-table-expand' }
      ],

      // form data
      valid: false,
      dateRules: [
        v => !!v || 'Date is required'
        // TODO: Add rule to not allow past dates
      ]
    }
  },
  computed: {
    ...mapState([
      'depreciationRate',
      'lowestPriceRate',
      'items',
      'flatmates',
      'flatmateMovingOut',
      'moveOutDate'
    ]),
    flatmateMovingOut: {
      get () {
        return this.$store.state.flatmateMovingOut
      },
      set (value) {
        this.$store.dispatch('setFlatmateMovingOut', value)
      }
    },
    moveOutDate: {
      get () {
        return this.$store.state.moveOutDate
      },
      set (value) {
        this.$store.dispatch('setMoveOutDate', value)
      }
    },
    totalReimbursementFor () {
      const reimbursements = {}

      this.flatmates.forEach(flatmate => {
        reimbursements[flatmate] = 0
      })

      this.items.forEach(item => {
        const depreciatedPrice = this.calculatePriceOnMoveOutDate(item)
        if (item.shareAmongst.includes(this.flatmateMovingOut)) {
          reimbursements[this.flatmateMovingOut] += depreciatedPrice / item.shareAmongst.length
        } else {
          item.shareAmongst.forEach(flatmateRemaining => {
            reimbursements[flatmateRemaining] += (depreciatedPrice / item.shareAmongst.length) - (depreciatedPrice / (item.shareAmongst.length + 1))
          })
        }
      })
      for (const [key, value] of Object.entries(reimbursements)) {
        reimbursements[key] = Math.floor(value * 100) / 100
      }
      return reimbursements
    },
    totalForNewFlatmate () {
      let total = 0
      for (const keyValuePair of Object.entries(this.totalReimbursementFor)) {
        total += keyValuePair[1]
      }
      return total
    },
    humanReadableMoveOutDate () {
      const date = new Date(this.moveOutDate)
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      return new Intl.DateTimeFormat('en-GB', options).format(date)
    }
  },
  methods: {
    deleteItem (item) {
      if (confirm(`Are you sure you wanna delete the ${item.name}?`)) {
        this.$store.dispatch('deleteItem', item)
      }
    },
    calculatePriceOnMoveOutDate (item) {
      const lowestPrice = Math.floor(item.price * this.lowestPriceRate / 100)
      const priceOnDate = Math.floor(item.price - (this.calculateNumberOfDaysOwned(item.date) * (this.depreciationRate / 100 / 365) * item.price))
      return Math.max(priceOnDate, lowestPrice)
    },
    calculateNumberOfDaysOwned (date) {
      return Math.floor(daysBetween(date, this.moveOutDate))
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
