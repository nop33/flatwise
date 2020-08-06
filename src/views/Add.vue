<template>
  <div>
    <v-form v-model="isFormValid">
      <v-container>
        <h1>Add a new item</h1>
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
            <v-dialog ref="dialog" :return-value.sync="item.date" persistent width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="item.date"
                  label="Purchace date"
                  append-icon="mdi-calendar"
                  :rules="dateRules"
                  readonly
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
              v-model="item.shareAmongst"
              :disabled="isUpdating"
              :items="flatmates"
              chips
              label="Share amongst"
              multiple
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn class="mr-2" color="primary" @click="save" :disabled="!isFormValid">Save</v-btn>
            <v-btn color="warning" to="/">Cancel</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['id'],
  data () {
    return {
      isFormValid: false,
      item: {
        name: '',
        price: '',
        date: '',
        shareAmongst: [],
        depreciationRate: 0,
        lowestPriceRate: 0
      },
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
      ],
      isUpdating: false
    }
  },
  computed: {
    ...mapState([
      'flatmates',
      'depreciationRate',
      'lowestPriceRate'
    ])
  },
  watch: {
    flatmates (newValue) {
      if (!this.id) {
        this.item.shareAmongst = [...newValue]
      }
    },
    depreciationRate (newValue) {
      if (!this.id) {
        this.item.depreciationRate = newValue
      }
    },
    lowestPriceRate (newValue) {
      if (!this.id) {
        this.item.lowestPriceRate = newValue
      }
    }
  },
  created () {
    if (this.$props.id) {
      this.item = { ...this.$store.getters.itemById(this.$props.id) }
      this.item.lowestPriceRate = this.item.lowestPriceRate === undefined ? this.lowestPriceRate : this.item.lowestPriceRate
      this.item.depreciationRate = this.item.depreciationRate === undefined ? this.depreciationRate : this.item.depreciationRate
    } else {
      this.item.shareAmongst = [...this.flatmates]
      this.item.depreciationRate = this.depreciationRate
      this.item.lowestPriceRate = this.lowestPriceRate
    }
  },
  methods: {
    save () {
      const action = Object.prototype.hasOwnProperty.call(this.item, 'id') ? 'updateItem' : 'addItem'
      this.$store.dispatch(action, this.item).then(() => {
        this.$router.push('/')
      })
    }
  }
}
</script>
