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
      </v-row>
    </v-container>
    <v-sheet color="grey lighten-3 py-1 px-5 text-caption">Default settings</v-sheet>
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            :value="value.depreciationRate"
            @input="depreciationRateChanged($event)"
            :rules="rateRules"
            label="Annual depreciation rate"
            hint="The rate by which the items of this flat lose their value, per year"
            required
            suffix="%"
          />
        </v-col>
        <v-col>
          <v-text-field
            :value="value.lowestPriceRate"
            @input="lowestPriceRateChanged($event)"
            :rules="rateRules"
            label="Lowest price rate"
            hint="The value of the items of this flat should not fall lower than this rate"
            required
            suffix="%"
          />
        </v-col>
      </v-row>
    </v-container>
    <div v-if="!isInEditMode">
      <v-sheet color="grey lighten-3 py-1 px-5 text-caption">Your move in date</v-sheet>
      <v-container>
        <v-row>
          <v-col>
            <v-dialog ref="dialog" :return-value.sync="value.initialMoveInDate" width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  :value="value.initialMoveInDate"
                  @input="initialMoveInDateChanged($event)"
                  label="Your move in date"
                  append-icon="mdi-calendar"
                  :rules="dateRules"
                  required
                  v-bind="attrs"
                  v-on="on"
                  readonly
                ></v-text-field>
              </template>
              <v-date-picker
                :value="value.initialMoveInDate"
                @input="initialMoveInDateChanged($event)"
                scrollable
              ></v-date-picker>
            </v-dialog>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-form>
</template>

<script>
export default {
  props: ['value', 'edit'],
  data: () => {
    return {
      flat: {},
      isFormValid: false,
      nameRules: [(v) => !!v || 'Name is required'],
      priceRules: [(v) => !!v || 'Price is required', (v) => v > 0 || 'Price cannot be 0 or below'],
      rateRules: [(v) => !!v || 'Rate is required', (v) => (v >= 0 && v <= 100) || 'Rate must be between 0 and 100'],
      dateRules: [(v) => !!v || 'Date is required']
    }
  },
  computed: {
    isInEditMode() {
      return this.edit !== undefined
    },
    hint() {
      return this.isInEditMode ? "You can yet modify users, sorry :/ It'll come in the future!" : ''
    }
  },
  watch: {
    flat(newValue) {
      if (Object.keys(this.flat).length === 0 && this.item.constructor === Object) {
        this.flat = newValue
      }
    },
    isFormValid(newValue) {
      this.$store.commit('SET_PAGE_FORM_VALIDITY', newValue)
    }
  },
  created() {
    this.flat = { ...this.value }
  },
  methods: {
    nameChanged($event) {
      this.flat.name = $event
      this.$emit('input', this.flat)
    },
    depreciationRateChanged($event) {
      this.flat.depreciationRate = $event
      this.$emit('input', this.flat)
    },
    lowestPriceRateChanged($event) {
      this.flat.lowestPriceRate = $event
      this.$emit('input', this.flat)
    },
    initialMoveInDateChanged($event) {
      this.$refs.dialog.save($event)
      this.flat.initialMoveInDate = $event
      this.$emit('input', this.flat)
    }
  }
}
</script>
