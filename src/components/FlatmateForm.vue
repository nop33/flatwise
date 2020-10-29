<template>
  <v-form v-model="isFormValid">
    <v-container>
      <v-row>
        <v-col cols="12" sm="12" md="6">
          <div class="d-flex">
            <Avatar :user="flatmate" class="mr-5" />
            <v-text-field
              :value="value.name"
              @input="nameChanged($event)"
              :rules="nameRules"
              label="Name"
              required
              :disabled="isNameDisabled"
              persistent-hint
              :hint="isNameDisabled ? 'Only themselves can change their name' : ''"
            />
          </div>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-text-field
            :value="value.email"
            @input="emailChanged($event)"
            type="email"
            :rules="emailRules"
            label="Email"
            prepend-icon="mdi-email-outline"
            required
            :disabled="isInEditMode"
            :hint="disabledEmailHint"
            persistent-hint
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6">
          <v-dialog ref="startDateDialog" :return-value.sync="value.startDate" width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="value.startDate"
                @input="startDateChanged($event)"
                label="Move in date"
                prepend-icon="mdi-calendar"
                :rules="dateRules"
                required
                v-bind="attrs"
                v-on="on"
                readonly
              ></v-text-field>
            </template>
            <v-date-picker
              :value="value.startDate"
              @input="startDateChanged($event)"
              scrollable
            ></v-date-picker>
          </v-dialog>
        </v-col>
        <v-col md="6" v-if="isInEditMode">
          <v-dialog ref="endDateDialog" :return-value.sync="value.endDate" width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="value.endDate"
                @input="endDateChanged($event)"
                label="Move out date"
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
                :disabled="!value.endDate"
                :hint="endDateHint"
                persistent-hint
                readonly
              ></v-text-field>
            </template>
            <v-date-picker
              :value="value.endDate"
              @input="endDateChanged($event)"
              scrollable
            ></v-date-picker>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { mapState } from 'vuex'

import Avatar from '@/components/Avatar.vue'

export default {
  components: {
    Avatar
  },
  props: [
    'value',
    'edit'
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
  computed: {
    ...mapState([
      'user'
    ]),
    isInEditMode () {
      return this.edit !== undefined
    },
    disabledEmailHint () {
      return this.isInEditMode ? 'I\'m still working on this feature, sry!' : ''
    },
    endDateHint () {
      return this.value.endDate ? '' : 'Remove flatmate to add move out date'
    },
    isNameDisabled () {
      return this.value.userRef && this.user.id !== this.value.userRef
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
      this.flatmate.email = $event.trim()
      this.$emit('input', this.flatmate)
    },
    startDateChanged ($event) {
      this.$refs.startDateDialog.save($event)
      this.flatmate.startDate = $event
      this.$emit('input', this.flatmate)
    },
    endDateChanged ($event) {
      this.$refs.endDateDialog.save($event)
      this.flatmate.endDate = $event
      this.$emit('input', this.flatmate)
    }
  }
}
</script>
