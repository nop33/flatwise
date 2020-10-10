<template>
  <v-form v-model="isFormValid">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field
            :value="value.name"
            @input="nameChanged($event)"
            :rules="nameRules"
            label="Flat name"
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
            :value="value.flatmatesEmails"
            @input="flatmatesEmailsChanged($event)"
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
            :value="value.depreciationRate"
            @input="depreciationRateChanged($event)"
            :rules="rateRules"
            label="Default item depreciation rate"
            required
            suffix="%"
          />
        </v-col>
        <v-col>
          <v-text-field
            :value="value.lowestPriceRate"
            @input="lowestPriceRateChanged($event)"
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
import { flatmateNamesOrEmails } from '@/utils/utils'

export default {
  props: [
    'value',
    'edit'
  ],
  data: () => {
    return {
      flat: {},
      flatmatesNames: [],
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
      return this.isInEditMode ? 'You can yet modify users, sorry :/ It\'ll come in the future!' : ''
    }
  },
  watch: {
    flat (newValue) {
      if (Object.keys(this.flat).length === 0 && this.item.constructor === Object) {
        this.flat = newValue
        this.flatmatesNames = flatmateNamesOrEmails(this.flat)
      }
    }
  },
  created () {
    this.flat = { ...this.value }
    this.flatmatesNames = flatmateNamesOrEmails(this.flat)
  },
  methods: {
    nameChanged ($event) {
      this.flat.name = $event
      this.$emit('input', this.flat)
    },
    depreciationRateChanged ($event) {
      this.flat.depreciationRate = $event
      this.$emit('input', this.flat)
    },
    lowestPriceRateChanged ($event) {
      this.flat.lowestPriceRate = $event
      this.$emit('input', this.flat)
    },
    flatmatesEmailsChanged ($event) {
      this.flat.flatmatesEmails = $event
      this.$emit('input', this.flat)
    }
  }
}
</script>
