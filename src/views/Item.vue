<template>
  <div>
    <v-app-bar app flat color="primary" dark prominent hide-on-scroll >
      <v-btn icon @click="goToFlat">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>
        <div class="">{{ item.name }}</div>
        <div class="mt-2">{{ item.price }} CHF</div>
        <div class="text-caption mt-1">Bought on {{ item.date }}</div>
      </v-toolbar-title>
      <v-btn color="red" dark absolute bottom right fab @click="edit">
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-list>
        <v-subheader>Shared amongst</v-subheader>
        <v-list-item v-for="flatmate in item.shareAmongst" :key="flatmate">
          <v-list-item-avatar>
            <v-avatar color="primary">
              <span class="white--text">XY</span>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ flatmate }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: [
    'flatId',
    'itemId'
  ],
  data: () => {
    return {
      item: null
    }
  },
  computed: {
    ...mapGetters([
      'flatItemById'
    ])
  },
  created () {
    this.item = this.flatItemById(this.flatId, this.itemId)
  },
  methods: {
    edit () {
      // todo
    },
    goToFlat () {
      this.$router.push({ name: 'Flat', params: { flatId: this.flatId } })
    }
  }
}
</script>
