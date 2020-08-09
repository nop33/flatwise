<template>
  <v-card v-if="!selectedFlatIndex" class="mx-auto" max-width="500" flat>
    <v-list>
      <v-list-item-group v-model="selectedFlatIndex">
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
      selectedFlatIndex: null
    }
  },
  computed: {
    ...mapState([
      'flats'
    ])
  },
  watch: {
    selectedFlatIndex (flatIndex) {
      this.$store.dispatch('selectFlat', flatIndex)
    },
    flats (newValue) {
      if (newValue.length === 1) {
        this.selectedFlatIndex = 0
      }
    }
  }
}
</script>
