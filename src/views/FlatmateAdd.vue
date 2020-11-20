<template>
  <div>
    <AppBarThin :backButtonCallback="back" title="Add flatmate" :actionButtonCallback="save" actionButtonText="Save" />
    <v-main>
      <FlatmateForm v-model="flatmate" />
    </v-main>
  </div>
</template>

<script>
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
    this.flat = this.$store.getters.currentFlat
  },
  methods: {
    back () {
      this.$router.push({ name: 'Flat Edit', params: { flatId: this.flatId } })
    },
    save () {
      this.$store.dispatch('addFlatmate', this.flatmate).then(flatmateId => {
        this.$router.push({ name: 'Flatmate Items', params: { flatId: this.flatId, flatmateId } })
      })
    }
  }
}
</script>
