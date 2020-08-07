<template>
  <v-card v-if="!selectedFlat" class="mx-auto" max-width="500">
    <v-list>
      <v-list-item-group v-model="selectedFlat">
        <v-list-item v-for="(flat, i) in flats" :key="i">
          <v-list-item-icon>
            <v-icon>mdi-home-city-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="flat.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => {
    return {
      selectedFlat: null
    }
  },
  computed: {
    ...mapState([
      'flats'
    ])
  },
  watch: {
    selectedFlat (flatIndex) {
      this.$store.dispatch('selectFlat', flatIndex)
    }
  }
}
</script>
