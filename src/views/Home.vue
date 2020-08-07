<template>
  <v-container>
    <v-row>
      <v-col>
        <FlatsList v-if="!selectedFlat" :flats="flats" />
        <FlatItems v-else-if="selectedFlat" :flat="selectedFlat" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import FlatsList from '@/components/FlatsList.vue'
import FlatItems from '@/components/FlatItems.vue'

export default {
  components: {
    FlatsList,
    FlatItems
  },
  computed: {
    ...mapState([
      'flats'
    ]),
    ...mapGetters([
      'selectedFlat'
    ])
  }
}
</script>
