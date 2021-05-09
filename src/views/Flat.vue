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
          <v-btn :to="{name: 'Balances'}" color="secondary">
            <v-icon left>mdi-scale-balance</v-icon>
            Balances
          </v-btn>
          <v-btn :to="{ name: 'Flat Edit', params: { flatId } }" color="primary">
            <v-icon left>mdi-cog</v-icon>
            Settings</v-btn>
        </div>
      </div>
    </v-app-bar>
    <v-main>
      <FlatItems :flat="flat" v-if="flat.items && flat.items.length" />
      <v-container v-else>
        <v-row>
          <v-col>
            <div class="text--disabled">
              Your flat seems unfurnished. <router-link :to="{name: 'Item Add'}">Add items</router-link> you have purchased or <router-link :to="{ name: 'Flatmate Add' }">add your flatmates</router-link>.
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
        :to="{ name: 'Item Add', params: { flatId } }"
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
import { initializeFlatAndItems } from '@/utils/mixins'

export default {
  components: {
    FlatItems,
    Snackbar
  },
  props: [
    'flatId',
    'flatmateRemoved'
  ],
  mixins: [
    initializeFlatAndItems
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
  }
}
</script>
