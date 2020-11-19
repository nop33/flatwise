<template>
  <div v-if="flat">
    <v-app-bar app flat color="primary" dark prominent hide-on-scroll>
      <v-btn icon @click="$router.push({name: 'Home'})">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <div class="absolute-toolbar-content d-flex flex-column justify-space-between my-3">
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
      <v-container v-if="flat.items && flat.items.length === 0">
        <v-row>
          <v-col>
            <div class="text--disabled">
              Your flat seems unfurnished. Add some items with the button below!
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-btn
        fab
        color="secondary white--text"
        bottom
        right
        fixed
        :to="{ name: 'Add Item', params: { flatId } }"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-main>
    <Snackbar v-model="isSnackbarVisible" icon="mdi-account-arrow-right-outline" :text="snackbarText" color="success" />
  </div>
</template>

<script>
import FlatItems from '@/components/FlatItems.vue'
import Snackbar from '@/components/Snackbar.vue'

export default {
  components: {
    FlatItems,
    Snackbar
  },
  props: [
    'flatId',
    'flatmateRemoved'
  ],
  data: () => {
    return {
      flat: {},
      isSnackbarVisible: false
    }
  },
  computed: {
    snackbarText () {
      return this.flatmateRemoved ? `Successfully removed ${this.flatmateRemoved.name}.` : ''
    }
  },
  async created () {
    this.flat = this.$store.getters.currentFlat
    if (!this.flat.items) {
      this.$store.dispatch('fetchCurrentFlatItems')
    }
  }
}
</script>
