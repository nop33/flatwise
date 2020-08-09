<template>
  <div>
    <AppBarHome />
    <v-main>
      <FlatsList :flats="flats" />
    </v-main>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

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
    ]),
    ...mapGetters([
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
