<template>
  <div>
    <AppBarHome />
    <v-main>
      <FlatsList :flats="flats" />
      <div class="d-flex justify-center ma-5">
        <v-btn :to="{name: 'Flat Add'}">Create new flat</v-btn>
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
      'flats'
    ])
  }
}
</script>
