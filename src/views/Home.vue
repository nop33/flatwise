<template>
  <div class="home">
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
      depreciationValue: 0.2,
      headers: [
        {
          text: 'Item',
          align: 'start',
          sortable: false,
          value: 'name'
        },
        { text: 'Price', value: 'price' },
        { text: 'Purchace Date', value: 'date' },
        { text: 'Number of days since purchace', value: 'noDaysBetween' }
      ],
      items: [
        {
          name: 'Sofa',
          price: 1250,
          date: '2019-08-01',
          noDaysBetween: 0
        },
        {
          name: 'Balcony rug',
          price: 70,
          date: '2020-06-01',
          noDaysBetween: 0
        }
      ]
    }
  },
  created () {
    this.items.forEach(element => {
      element.noDaysBetween = numberOfDaysOwned(element.date)
    })
  }
}

function numberOfDaysOwned (date) {
  return Math.floor(daysBetween(date, new Date()))
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
