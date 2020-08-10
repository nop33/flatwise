<template>
  <div>
    <AppBarHome />
    <v-main>
      <FlatsList :flats="flats" />
      <div class="d-flex justify-center ma-5">
        <v-btn :to="{name: 'Add Flat'}">Create new flat</v-btn>
      </div>
    </v-main>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import FlatsList from '@/components/FlatsList.vue'
import AppBarHome from '@/components/AppBarHome.vue'

export default {
  components: {
    FlatsList,
    AppBarHome
  },
  computed: {
    ...mapState([
      'flats',
      'selectedFlat'
    ])
  },
  watch: {
    selectedFlat (newValue) {
      if (newValue) {
        this.$router.push({ name: 'Flat', params: { flatId: newValue.id } })
      }
    }
  }
}
</script>
