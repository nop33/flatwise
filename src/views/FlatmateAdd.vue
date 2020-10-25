<template>
  <div>
    <v-toolbar flat color="primary" dark fixed>
      <v-btn icon @click="goToFlatSettings">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Add flatmate</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text large @click="save">Save</v-btn>
    </v-toolbar>
    <v-main>
      <FlatmateForm v-model="flatmate" />
    </v-main>
  </div>
</template>

<script>
import { getFlatFromStateById } from '@/utils/getters'

import FlatmateForm from '@/components/FlatmateForm.vue'

export default {
  components: {
    FlatmateForm
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
        moveInDate: ''
      }
    }
  },
  created () {
    this.flat = getFlatFromStateById(this.flatId)
  },
  methods: {
    goToFlatSettings () {
      this.$router.push({ name: 'Edit Flat', params: { flatId: this.flatId } })
    },
    save () {
      this.$store.dispatch('addFlatmate', this.flatmate).then(() => {
        this.goToFlatSettings()
      })
    }
  }
}
</script>
