<template>
  <div>
    <h1>Add a new item</h1>
    <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="name"
            :rules="nameRules"
            label="Item name"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="price"
            :rules="priceRules"
            label="Purchace price"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-dialog
            ref="dialog"
            :return-value.sync="date"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Purchace date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" scrollable @input="$refs.dialog.save(date)"></v-date-picker>
          </v-dialog>
        </v-col>
      </v-row>
      <v-row>
        <v-btn
          color="warning"
          @click="save"
        >
          Save
        </v-btn>
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
      price: 0,
      date: new Date().toISOString().substr(0, 10),
      nameRules: [
        v => !!v || 'Name is required'
      ],
      priceRules: [
        v => !!v || 'Price is required',
        v => v > 0 || 'Price cannot be 0 or below'
      ]
    }
  },
  methods: {
    save () {
      alert('Saved! NOT!')
    }
  }
}
</script>
