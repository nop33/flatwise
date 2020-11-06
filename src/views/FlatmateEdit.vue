<template>
  <div>
    <v-toolbar flat color="primary" dark fixed>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Edit flatmate settings</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text large @click="save">Save</v-btn>
    </v-toolbar>
    <v-main>
      <FlatmateForm v-model="flatmate" edit />
      <v-divider />
      <div class="d-flex justify-center ma-5">
        <v-btn block color="primary" :to="{ name: 'Flatmate Items', params: { flatId, flatmateId } }">
          <v-icon left>mdi-format-list-checks</v-icon>
          See flatmate items
        </v-btn>
      </div>
      <div class="d-flex justify-center ma-5">
        <v-btn block color="secondary" :to="{ name: 'Flatmate Move In', params: { flatId, flatmateId } }">
          <v-icon left>mdi-currency-usd</v-icon>
          Move in payment
        </v-btn>
      </div>
      <v-divider />
      <div class="d-flex justify-center ma-5">
        <v-btn color="warning" text :to="{ name: 'Remove Flatmate', params: { flatId, flatmateId } }">
          <v-icon left>mdi-account-arrow-right-outline</v-icon>
          Remove flatmate
        </v-btn>
      </div>
      <Snackbar v-model="snackbar.enabled" timeout="-1" icon="mdi-account-clock-outline" :text="invitationText" />
    </v-main>
  </div>
</template>

<script>
import { getFlatFromStateById } from '@/utils/getters'
import { getFirstName } from '@/utils/utils'

import { mapState } from 'vuex'

import FlatmateForm from '@/components/FlatmateForm.vue'
import Snackbar from '@/components/Snackbar.vue'

export default {
  components: {
    FlatmateForm,
    Snackbar
  },
  props: [
    'flatId',
    'flatmateId'
  ],
  data: () => {
    return {
      flat: {},
      flatmate: {},
      snackbar: {
        multiLine: true,
        enabled: false
      }
    }
  },
  computed: {
    ...mapState([
      'user'
    ]),
    invitationText () {
      const subject = encodeURI('Join me on Flatwise!')
      const body = encodeURI(`Hey ${getFirstName(this.flatmate.name)}!

I'd like to invite you to Flatwise where we calculate the depreciation of our furniture.

I added you as a flatmate to our "${this.flat.name}" flat using your email: ${this.flatmate.email}

If you'd prefer to use a different one let me know!

You can access the app here: ${process.env.VUE_APP_FLATWISE_URL}

Thanks,
${getFirstName(this.user.name)}`)
      const href = `mailto:${this.flatmate.email}?subject=${subject}&body=${body}`
      return `${this.flatmate.name} did not yet check out the app, but you can <a href="${href}">send an invite</a>!`
    }
  },
  created () {
    this.flat = getFlatFromStateById(this.flatId)
    this.flatmate = this.flat.flatmates.find(flatmate => flatmate.id === this.flatmateId)
    if (!this.flatmate.userRef) {
      this.snackbar.enabled = true
    }
  },
  methods: {
    save () {
      this.$store.dispatch('updateFlatmate', { flatmateData: this.flatmate, flatId: this.flatId }).then(() => {
        this.$router.push({ name: 'Edit Flat', params: { flatId: this.flatId } })
      })
    }
  }
}
</script>
