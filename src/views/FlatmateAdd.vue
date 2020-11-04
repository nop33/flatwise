<template>
  <div>
    <v-toolbar flat color="primary" dark fixed>
      <v-btn icon @click="$router.go(-1)">
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
        startDate: ''
      }
    }
  },
  created () {
    this.flat = getFlatFromStateById(this.flatId)
  },
  methods: {
    save () {
      this.$store.dispatch('addFlatmate', { flatmateData: this.flatmate, flatId: this.flatId }).then(() => {
        this.goToFlatSettings()
      })
    }
  }
}
</script>
