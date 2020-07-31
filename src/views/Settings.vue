<template>
  <div>
    <v-form v-model="valid">
      <v-container>
        <h1>Settings</h1>
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model.number="depreciationRate"
              :rules="rateRules"
              type="number"
              label="Annual depreciation rate (%)"
              min="0"
              max="100"
              required
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model.number="lowestPriceRate"
              :rules="rateRules"
              type="number"
              label="Lowest price (%)"
              min="0"
              max="100"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-combobox
              v-model="flatmatesSelect"
              :items="flatmates"
              label="Flatmates"
              multiple
              chips
            ></v-combobox>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              class="mr-2"
              color="primary"
              @click="save"
            >
              Save
            </v-btn>
            <v-btn
              color="warning"
              to="/"
            >
              Cancel
            </v-btn>
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
      valid: false,
      flatmatesSelect: [],
      rateRules: [
        v => !!v || 'Rate is required',
        v => (v >= 0 && v <= 100) || 'Rate must be between 0 and 100'
      ]
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
      this.flatmatesSelect = newValue
    }
  },
  methods: {
    save () {
      this.$store.dispatch('updateSettings', {
        depreciationRate: this.depreciationRate,
        lowestPriceRate: this.lowestPriceRate,
        flatmates: this.flatmatesSelect
      }).then(() => {
        this.$router.push('/')
      })
    }
  }
}
</script>
