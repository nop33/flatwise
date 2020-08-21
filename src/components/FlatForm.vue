<template>
  <v-form v-model="isFormValid">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="flat.name"
            :rules="nameRules"
            label="Flat
            name"
            required
            prepend-icon="mdi-home-city-outline"
          />
        </v-col>
        <v-col cols="12">
          <v-combobox
            v-if="isInEditMode"
            v-model="flatmatesNames"
            label="Flatmates"
            multiple
            chips
            prepend-icon="mdi-account-group"
            disabled
            :hint="hint"
            persistent-hint
          ></v-combobox>
          <v-combobox v-else
            v-model="flat.flatmatesEmails"
            label="Flatmates"
            multiple
            chips
            prepend-icon="mdi-account-group"
          ></v-combobox>
        </v-col>
      </v-row>
    </v-container>
    <v-sheet color="grey lighten-3 py-1 px-5">Settings</v-sheet>
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="flat.depreciationRate"
            :rules="rateRules"
            label="Default item depreciation rate"
            required
            suffix="%"
          />
        </v-col>
        <v-col>
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
    'flat',
    'edit',
    'flatmatesNames'
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
  },
  computed: {
    isInEditMode () {
      return this.edit !== undefined
    },
    hint () {
      return this.isInEditMode ? 'You can only add or remove flatmates from the previous screen' : ''
    }
  }
}
</script>
