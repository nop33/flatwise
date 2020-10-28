<template>
  <div>
    <v-toolbar flat color="primary" dark fixed>
      <v-btn icon @click="goToFlatSettings">
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
        <v-btn color="warning" @click="removeFlatmate">Remove flatmate</v-btn>
      </div>
      <v-snackbar v-model="snackbar.enabled" :multi-line="snackbar.multiLine" timeout="-1">
        <div class="d-flex">
          <v-icon class="mr-3">mdi-account-clock-outline</v-icon>
          <span v-html="invitationText"></span>
        </div>
        <template v-slot:action="{ attrs }">
          <v-btn icon text v-bind="attrs" @click="snackbar.enabled = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </div>
</template>

<script>
import { getFlatFromStateById } from '@/utils/getters'

import { mapState } from 'vuex'

import FlatmateForm from '@/components/FlatmateForm.vue'

export default {
  components: {
    FlatmateForm
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
      const body = encodeURI(`Hey ${this.flatmate.name}!

I'd like to invite you to Flatwise where we calculate the depreciation of our furniture.

I added you as a flatmate to our "${this.flat.name}" flat using your email: ${this.flatmate.email}

If you'd prefer to use a different one let me know!

You can access the app here: ${process.env.VUE_APP_FLATWISE_URL}

Thanks,
${this.user.name}`)
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
    goToFlatSettings () {
      this.$router.push({ name: 'Edit Flat', params: { flatId: this.flatId } })
    },
    save () {
      this.$store.dispatch('updateFlatmate', { flatmateData: this.flatmate, flatId: this.flatId }).then(() => {
        this.goToFlatSettings()
      })
    },
    removeFlatmate () {
      // TODO
    }
  }
}
</script>
