<template>
  <div>
    <v-form v-model="valid">
      <v-container>
        <h1>Add a new item</h1>
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="item.name"
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
              v-model="item.price"
              type="number"
              :rules="priceRules"
              label="Purchace price"
              suffix="CHF"
              required
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-dialog
              ref="dialog"
              :return-value.sync="item.date"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="item.date"
                  label="Purchace date"
                  append-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="item.date" scrollable @input="$refs.dialog.save(item.date)"></v-date-picker>
            </v-dialog>
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
export default {
  props: ['id'],
  data () {
    return {
      valid: false,
      item: {
        name: '',
        price: '',
        date: ''
      },
      nameRules: [
        v => !!v || 'Name is required'
      ],
      priceRules: [
        v => !!v || 'Price is required',
        v => v > 0 || 'Price cannot be 0 or below'
      ]
    }
  },
  created () {
    if (this.$props.id) {
      this.item = { ...this.$store.getters.itemById(this.$props.id) }
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
