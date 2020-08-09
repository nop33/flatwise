<template>
  <v-form v-model="isFormValid">
    <v-container>
      <h1>Add a new item</h1>
      <h2>Flat details</h2>
      <v-row>
        <v-col md="3">
          <v-text-field v-model="flat.name" :rules="nameRules" label="Flat name" required />
        </v-col>
        <v-col md="3">
          <v-combobox
            v-model="flat.flatmates"
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
            v-model="flat.depreciationRate"
            :rules="rateRules"
            label="Default item depreciation rate"
            required
            suffix="%"
          />
        </v-col>
        <v-col md="3">
          <v-text-field
            v-model="flat.lowestPriceRate"
            :rules="rateRules"
            label="Default item lowest price rate"
            required
            suffix="%"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  props: [
    'flat'
  ],
  data: () => {
    return {
      isFormValid: false,
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
  }
}
</script>
