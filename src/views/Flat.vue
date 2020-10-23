<template>
  <div v-if="flat">
    <v-app-bar app flat color="primary" dark prominent hide-on-scroll>
      <v-btn icon @click="goHome">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <div class="absolute-content d-flex flex-column justify-space-between my-3">
        <div class="mx-10 text-truncate text-center text-h6">
          {{ flat.name }}
        </div>
        <div class="d-flex justify-space-around">
          <v-btn :to="{name: 'Balances'}" color="secondary">Balances</v-btn>
          <v-btn :to="{ name: 'Edit Flat', params: { flatId } }" color="primary">Settings</v-btn>
        </div>
      </div>
    </v-app-bar>
    <v-main>
      <FlatItems :flat="flat" />
      <v-btn
        fab
        color="secondary white--text"
        bottom
        right
        fixed
        :to="{ name: 'Add Item', params: { flatId: flat.id } }"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-main>
  </div>
</template>

<script>
import { getFlatFromStateById, fetchFlatItemsAndStoreInFlatWithId } from '@/utils/getters'

import FlatItems from '@/components/FlatItems.vue'

export default {
  components: {
    FlatItems
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
    if (!this.flat.items) {
      fetchFlatItemsAndStoreInFlatWithId(this.flat.id)
    }
  },
  methods: {
    goHome () {
      this.$router.push({ name: 'Home' })
      this.$store.dispatch('selectFlat', null)
    }
  }
}
</script>

<style lang="scss">
.absolute-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  padding: inherit;
  z-index: -1;
}
</style>
