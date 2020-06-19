<template>
  <div class="home mb-15">
    <v-container>
      <v-row>
        <v-col>
          <v-card
            class="mx-auto blue lighten-5"
          >
            <v-card-text>
              <blockquote
                class="blockquote"
              >
                If you move out on <strong>{{ humanReadableMoveOutDate }}</strong> you'll get back <strong>{{ total }} CHF</strong>
              </blockquote>
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
            hide-default-footer
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
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  data () {
    return {
      // table data
      items: [],
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
      moveOutDate: new Date().toISOString().substr(0, 10),
      dateRules: [
        v => !!v || 'Date is required'
        // TODO: Add rule to not allow past dates
      ]
    }
  },
  computed: {
    ...mapState(['depreciationRate', 'lowestPriceRate']),
    total () {
      let total = 0
      this.items.forEach(item => {
        total += this.calculatePriceOnMoveOutDate(item)
      })
      return total
    },
    humanReadableMoveOutDate () {
      const date = new Date(this.moveOutDate)
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      return new Intl.DateTimeFormat('en-GB', options).format(date)
    }
  },
  created () {
    this.items = this.$store.state.items.map(item => ({ ...item }))
  },
  methods: {
    deleteItem (item) {
      if (confirm(`Are you sure you wanna delete the ${item.name}?`)) {
        this.items.splice(this.items.indexOf(this.items.find(i => i.id === item.id)), 1)
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
