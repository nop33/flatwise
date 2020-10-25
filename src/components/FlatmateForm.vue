<template>
  <v-form v-model="isFormValid">
    <v-container>
      <v-row>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            :value="value.name"
            @input="nameChanged($event)"
            :rules="nameRules"
            label="Name"
            required
          />
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            :value="value.email"
            @input="emailChanged($event)"
            type="email"
            :rules="emailRules"
            label="Email"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-dialog ref="dialog" :return-value.sync="value.moveInDate" width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="value.moveInDate"
                @input="dateChanged($event)"
                label="Move in date"
                append-icon="mdi-calendar"
                :rules="dateRules"
                required
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :value="value.moveInDate"
              @input="dateChanged($event)"
              scrollable
            ></v-date-picker>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  props: [
    'value'
  ],
  data () {
    return {
      flatmate: {},
      isFormValid: false,
      nameRules: [
        v => !!v || 'Name is required'
      ],
      dateRules: [
        v => !!v || 'Date is required'
      ],
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+/.test(v) || 'Email must be valid'
      ]
    }
  },
  watch: {
    value (newValue) {
      if (Object.keys(this.flatmate).length === 0 && this.flatmate.constructor === Object) {
        this.flatmate = newValue
      }
    }
  },
  created () {
    this.flatmate = { ...this.value }
  },
  methods: {
    nameChanged ($event) {
      this.flatmate.name = $event
      this.$emit('input', this.flatmate)
    },
    emailChanged ($event) {
      this.flatmate.email = $event
      this.$emit('input', this.flatmate)
    },
    dateChanged ($event) {
      this.$refs.dialog.save($event)
      this.flatmate.moveInDate = $event
      this.$emit('input', this.flatmate)
    }
  }
}
</script>
