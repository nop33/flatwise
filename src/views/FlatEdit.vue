<template>
  <div>
    <v-toolbar flat color="primary" dark fixed>
      <v-btn icon @click="goToFlat">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Edit flat settings</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text large @click="save">Save</v-btn>
    </v-toolbar>
    <v-main>
    <FlatForm v-model="flat" edit />
    <FlatmateGroupList :flat="flat" />
    <v-divider />
    <div class="d-flex justify-center ma-5">
      <v-btn color="warning" text @click="deleteFlat">Delete flat</v-btn>
    </div>
    </v-main>
  </div>
</template>

<script>
import { getFlatFromStateById } from '@/utils/getters'

import FlatForm from '@/components/FlatForm.vue'
import FlatmateGroupList from '@/components/FlatmateGroupList.vue'

export default {
  components: {
    FlatForm,
    FlatmateGroupList
  },
  props: [
    'flatId'
  ],
  data: () => {
    return {
      flat: {}
    }
  },
  created () {
    this.flat = getFlatFromStateById(this.flatId)
  },
  methods: {
    goToFlat () {
      this.$router.push({ name: 'Flat', params: { flatId: this.flatId } })
    },
    save () {
      this.$store.dispatch('updateFlat', this.flat).then(() => {
        this.$router.push({ name: 'Flat', params: { flatId: this.flatId } })
      })
    },
    deleteFlat () {
      // TODO
      alert('This feature is coming soon, sry!')
    }
  }
}
</script>
