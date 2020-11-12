<template>
  <div>
    <AppBarThin
      :backButtonCallback="back"
      title="Add flatmate"
      :actionButtonCallback="save"
      actionButtonText="Save"
    />
    <v-main>
      <FlatmateForm v-model="flatmate" />
    </v-main>
  </div>
</template>

<script>
import { getFlatFromStateById } from '@/utils/getters'

import FlatmateForm from '@/components/FlatmateForm.vue'
import AppBarThin from '@/components/AppBarThin.vue'

export default {
  components: {
    FlatmateForm,
    AppBarThin
  },
  props: [
    'flatId'
  ],
  data: () => {
    return {
      flat: {},
      flatmate: {
        name: '',
        email: '',
        startDate: ''
      }
    }
  },
  created () {
    this.flat = getFlatFromStateById(this.flatId)
  },
  methods: {
    back () {
      this.$router.push({ name: 'Edit Flat', params: { flatId: this.flatId } })
    },
    save () {
      this.$store.dispatch('addFlatmate', { flatmateData: this.flatmate, flatId: this.flatId }).then((flatmate) => {
        this.$router.push({ name: 'Flatmate Items', params: { flatId: this.flatId, flatmateId: flatmate.id } })
      })
    }
  }
}
</script>
