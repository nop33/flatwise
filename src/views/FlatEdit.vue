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
      <FlatForm :flat="flat" edit />
    </v-main>
  </div>
</template>

<script>
import FlatForm from '@/components/FlatForm.vue'

export default {
  components: {
    FlatForm
  },
  props: [
    'flatId',
    'getFlat'
  ],
  data: () => {
    return {
      flat: {}
    }
  },
  created () {
    this.flat = this.getFlat(this.flatId)
  },
  methods: {
    goToFlat () {
      this.$router.push({ name: 'Flat', params: { flatId: this.flatId } })
    },
    save () {
      this.$store.dispatch('updateFlat', this.flat).then(() => {
        this.$router.push({ name: 'Flat', params: { flatId: this.flatId } })
      })
    }
  }
}
</script>
