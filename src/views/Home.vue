<template>
  <div>
    <AppBarHome />
    <v-main>
      <FlatsList v-if="flats.length" :flats="flats" />
      <v-banner v-else two-line>
        <v-icon icon="mdi-lock" slot="icon"> mdi-hand-peace-variant </v-icon>

        <strong>Welcome to Flatwise!</strong><br />
        Start by creating and setting up your flat.
      </v-banner>

      <div class="d-flex justify-center ma-5">
        <v-btn :to="{ name: 'Flat Add' }">Create new flat</v-btn>
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
    ...mapState(['flats'])
  }
}
</script>
