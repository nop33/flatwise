<template>
  <div>
    <AppBarThin
      :backButtonCallback="back"
      title="Edit flatmate settings"
      :actionButtonCallback="save"
      actionButtonText="Save"
    />
    <v-main>
      <FlatmateForm v-model="flatmate" edit />
      <v-divider />
      <div class="d-flex justify-center ma-5">
        <v-btn block color="primary" :to="{ name: 'Flatmate Items', params: { flatId, flatmateId } }">
          <v-icon left>mdi-format-list-checks</v-icon>
          See items shared with {{ flatmateFirstName }}
        </v-btn>
      </div>
      <div class="d-flex justify-center ma-5">
        <v-btn block color="secondary" :to="{ name: 'Flatmate Move In', params: { flatId, flatmateId } }">
          <v-icon left>mdi-currency-usd</v-icon>
          Calculate {{ flatmateFirstName }}'s moving in payment
        </v-btn>
      </div>
      <v-divider />
      <div class="d-flex justify-center ma-5">
        <v-btn color="warning" text :to="{ name: 'Flatmate Move Out', params: { flatId, flatmateId } }">
          <v-icon left>mdi-account-arrow-right-outline</v-icon>
          Remove flatmate
        </v-btn>
      </div>
      <Snackbar v-model="snackbar.enabled" timeout="-1" icon="mdi-account-clock-outline" :text="invitationText" />
    </v-main>
  </div>
</template>

<script>
import { getFirstName } from '@/utils/utils'

import { mapState } from 'vuex'

import FlatmateForm from '@/components/FlatmateForm.vue'
import Snackbar from '@/components/Snackbar.vue'
import AppBarThin from '@/components/AppBarThin.vue'

export default {
  components: {
    FlatmateForm,
    Snackbar,
    AppBarThin
  },
  props: [
    'flatId',
    'flatmateId',
    'backButtonCallback' // TODO: Use it wherever this view is called from
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
    ...mapState(['user']),
    flatmateFirstName() {
      return getFirstName(this.flatmate.name)
    },
    invitationText() {
      const subject = encodeURI('Join me on Flatwise!')
      const body = encodeURI(`Hey ${this.flatmateFirstName}!

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
  created() {
    this.flat = this.$store.getters.currentFlat
    this.flatmate = this.flat.flatmates.find((flatmate) => flatmate.id === this.flatmateId)
    if (!this.flatmate.userRef) {
      this.snackbar.enabled = true
    }
  },
  methods: {
    goToFlatEdit() {
      this.$router.push({ name: 'Flat Edit', params: { flatId: this.flatId } })
    },
    back() {
      this.backButtonCallback ? this.backButtonCallback() : this.goToFlatEdit()
    },
    save() {
      this.$store.dispatch('updateFlatmate', this.flatmate).then(this.goToFlatEdit)
    }
  }
}
</script>
