<template>
  <v-form v-model="isFormValid">
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="item.name" :rules="nameRules" label="Item name" required />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="item.price"
            type="number"
            :rules="priceRules"
            label="Purchace price"
            suffix="CHF"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-dialog ref="dialog" :return-value.sync="item.date" width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="item.date"
                label="Purchace date"
                append-icon="mdi-calendar"
                :rules="dateRules"
                required
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="item.date" scrollable @input="$refs.dialog.save(item.date)"></v-date-picker>
          </v-dialog>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model.number="item.depreciationRate"
            :rules="rateRules"
            type="number"
            label="Annual depreciation rate"
            min="0"
            max="100"
            required
            suffix="%"
          />
        </v-col>
        <v-col cols="12" sm="6" v-show="item.depreciationRate < 100">
          <v-text-field
            v-model.number="item.lowestPriceRate"
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
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="item.idsOfFlatmatesThatShareThis"
            :items="allFlatmates"
            item-text="name"
            item-value="id"
            chips
            label="Share amongst"
            multiple
          ></v-autocomplete>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  props: [
    'item',
    'allFlatmates'
  ],
  data () {
    return {
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
    'item.depreciationRate' (newValue) {
      if (newValue === 100) {
        this.item.lowestPriceRate = 0
      }
    }
  }
}
</script>
