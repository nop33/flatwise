<template>
  <div>
    <v-form v-model="valid">
      <v-container>
        <h1>Add a new item</h1>
        <h2>Flat details</h2>
        <v-row>
          <v-col md="3">
            <v-text-field v-model="name" :rules="nameRules" label="Flat name" required />
          </v-col>
          <v-col md="3">
            <v-combobox
              v-model="flatmates"
              label="Flatmates"
              multiple
              chips
            ></v-combobox>
          </v-col>
        </v-row>
        <h2>Flat settings</h2>
        <v-row>
          <v-col md="3">
            <v-text-field
              v-model="depreciationRate"
              :rules="rateRules"
              label="Default item depreciation rate"
              required
              suffix="%"
            />
          </v-col>
          <v-col md="3">
            <v-text-field
              v-model="lowestPriceRate"
              :rules="rateRules"
              label="Default item lowest price rate"
              required
              suffix="%"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn class="mr-2" color="primary" @click="save" :disabled="!valid">Save</v-btn>
            <v-btn color="warning" to="/">Cancel</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      valid: false,
      name: '',
      flatmates: [],
      depreciationRate: 20,
      lowestPriceRate: 20,
      nameRules: [
        v => !!v || 'Name is required'
      ],
      priceRules: [
        v => !!v || 'Price is required',
        v => v > 0 || 'Price cannot be 0 or below'
      ],
      rateRules: [
        v => !!v || 'Rate is required',
        v => (v >= 0 && v <= 100) || 'Rate must be between 0 and 100'
      ]
    }
  },
  methods: {
    save () {
      this.$store.dispatch('createFlat', {
        name: this.name,
        flatmates: this.flatmates,
        depreciationRate: this.depreciationRate,
        lowestPriceRate: this.lowestPriceRate
      }).then(() => {
        this.$router.push('/')
      })
    }
  }
}
</script>
