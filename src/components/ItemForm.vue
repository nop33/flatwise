<template>
  <v-form v-model="isFormValid">
    <v-container>
      <v-row>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            :value="value.name"
            @input="nameChanged($event)"
            :rules="nameRules"
            label="Item name"
            required
          />
        </v-col>
        <v-col cols="6" sm="6" md="4">
          <v-text-field
            :value="value.price"
            @input="priceChanged($event)"
            type="number"
            :rules="priceRules"
            label="Purchace price"
            suffix="CHF"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="6" sm="6" md="4">
          <v-dialog ref="dialog" :return-value.sync="value.date" width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="value.date"
                @input="dateChanged($event)"
                label="Purchace date"
                append-icon="mdi-calendar"
                :rules="dateRules"
                required
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :value="value.date"
              @input="dateChanged($event)"
              scrollable
            ></v-date-picker>
          </v-dialog>
        </v-col>
        <v-col>
          <v-autocomplete
            :value="value.idsOfFlatmatesThatShareThis"
            @input="idsOfFlatmatesThatShareThisChanged($event)"
            :items="allFlatmates"
            item-text="name"
            item-value="id"
            chips
            label="Shared amongst"
            multiple
          >
            <template v-slot:selection="data">
              <v-chip v-bind="data.attrs">
                <v-avatar left>
                  <v-img :src="data.item.photo"></v-img>
                </v-avatar>
                {{ data.item.name }}
              </v-chip>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" sm="6">
          <v-text-field
            :value="value.depreciationRate"
            @input="depreciationRateChanged($event)"
            :rules="rateRules"
            type="number"
            label="Annual depreciation rate"
            min="0"
            max="100"
            required
            suffix="%"
          />
        </v-col>
        <v-col cols="6" sm="6" v-show="value.depreciationRate < 100">
          <v-text-field
            :value="value.lowestPriceRate"
            @input="lowestPriceRateChanged($event)"
            :rules="rateRules"
            type="number"
            label="Lowest price rate"
            min="0"
            max="100"
            suffix="%"
            required
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  props: [
    'value',
    'allFlatmates'
  ],
  data () {
    return {
      item: {},
      isFormValid: false,
      nameRules: [
        v => !!v || 'Name is required'
      ],
      dateRules: [
        v => !!v || 'Date is required'
      ],
      priceRules: [
        v => v > 0 || 'Price cannot be 0 or below'
      ],
      rateRules: [
        v => (v >= 0 && v <= 100) || 'Rate must be between 0 and 100'
      ]
    }
  },
  watch: {
    value (newValue) {
      if (Object.keys(this.item).length === 0 && this.item.constructor === Object) {
        this.item = newValue
      }
    },
    'value.depreciationRate' (newValue) {
      if (newValue === 100) {
        this.lowestPriceRateChanged(0)
      }
    }
  },
  created () {
    this.item = { ...this.value }
  },
  methods: {
    nameChanged ($event) {
      this.item.name = $event
      this.$emit('input', this.item)
    },
    priceChanged ($event) {
      this.item.price = parseFloat($event)
      this.$emit('input', this.item)
    },
    dateChanged ($event) {
      this.$refs.dialog.save($event)
      this.item.date = $event
      this.$emit('input', this.item)
    },
    depreciationRateChanged ($event) {
      this.item.depreciationRate = parseFloat($event)
      this.$emit('input', this.item)
    },
    lowestPriceRateChanged ($event) {
      this.item.lowestPriceRate = parseFloat($event)
      this.$emit('input', this.item)
    },
    idsOfFlatmatesThatShareThisChanged ($event) {
      this.item.idsOfFlatmatesThatShareThis = $event
      this.$emit('input', this.item)
    }
  }
}
</script>
