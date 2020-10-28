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
      <div class="d-flex justify-center ma-5">
        <v-btn color="warning" @click="removeFlatmate">Remove flatmate</v-btn>
      </div>
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
    'flatId',
    'flatmateId'
  ],
  data: () => {
    return {
      flat: {},
      flatmate: {}
    }
  },
  created () {
    this.flat = getFlatFromStateById(this.flatId)
    this.flatmate = this.flat.flatmates.find(flatmate => flatmate.id === this.flatmateId)
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
