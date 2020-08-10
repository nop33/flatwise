<template>
  <div v-if="flat">
    <v-app-bar app flat color="primary" dark prominent hide-on-scroll >
      <v-btn icon @click="goHome">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer />
      <v-toolbar-title>
        <div class="d-flex flex-column">
          <span>{{ flat.name }}</span>
          <v-btn class="mt-5" color="red">Calculate costs</v-btn>
        </div>
      </v-toolbar-title>
      <v-spacer />
      <v-menu origin="top right">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item link :to="{ name: 'Edit Flat', params: { flatId } }">
            <v-list-item-title>Edit flat settings</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <FlatItems :flat="flat" />
      <v-btn
        fab
        color="red white--text"
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
import { mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters([
      'selectedFlat',
      'flatById'
    ])
  },
  created () {
    if (!this.selectedFlat) {
      this.flat = this.flatById(this.flatId)
    } else {
      this.flat = this.selectedFlat
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
