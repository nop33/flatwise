<template>
  <div>
    <v-toolbar extended flat color="primary" dark>
      <v-btn icon @click="goHome">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{ selectedFlat.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
    <v-main>
      <FlatItems :flat="selectedFlat" />
      <v-btn
        fab
        color="red white--text"
        bottom
        right
        fixed
        :to="{ name: 'Add Item', params: { flatId: selectedFlat.id } }"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import FlatItems from '@/components/FlatItems.vue'

export default {
  components: {
    FlatItems
  },
  props: [
    'flatId'
  ],
  computed: {
    ...mapGetters([
      'selectedFlat'
    ])
  },
  methods: {
    goHome () {
      this.$router.push({ name: 'Home' })
      this.$store.dispatch('selectFlat', null)
    }
  }
}
</script>
