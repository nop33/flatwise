<template>
  <div>
    <v-app-bar app flat color="primary" dark prominent hide-on-scroll >
      <v-btn icon @click="goToFlat">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>
        <div>{{ item.name }}</div>
        <div class="mt-2">{{ item.price }} CHF</div>
        <div class="text-caption mt-1">Bought on {{ item.date }}</div>
      </v-toolbar-title>
      <v-btn color="red" dark absolute bottom right fab :to="{ name: 'Edit Item', params: { flatId, itemId } }">
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main v-if="item.idsOfFlatmatesThatShareThis">
      <v-list>
        <v-subheader>Shared amongst</v-subheader>
        <v-list-item v-for="flatmate in getFlatmatesThatShareThis(item)" :key="flatmate.id">
          <v-list-item-avatar>
            <v-avatar color="primary">
              <img v-if="flatmate.photo" :src="flatmate.photo" alt="Avatar"/>
              <span v-else-if="flatmate.name" class="white--text">{{ flatmate.name.substring(0, 2).toUpperCase() }}</span>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ flatmate.name || flatmate.email }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div class="d-flex justify-center ma-5">
        <v-btn color="warning" @click="deleteItem">Delete item</v-btn>
      </div>
    </v-main>
  </div>
</template>

<script>
import { getFlatmatesFromIds } from '@/utils/utils'

export default {
  props: [
    'flatId',
    'itemId',
    'getFlat',
    'getFlatItems'
  ],
  data: () => {
    return {
      flat: {},
      item: {}
    }
  },
  async created () {
    this.flat = this.getFlat(this.flatId)
    if (!this.flat.items) {
      await this.getFlatItems(this.flatId)
    }
    this.item = this.flat.items.find(item => item.id === this.itemId)
  },
  methods: {
    goToFlat () {
      this.$router.push({ name: 'Flat', params: { flatId: this.flatId } })
    },
    deleteItem () {
      if (confirm(`Are you sure you wanna delete the "${this.item.name}"?`)) {
        this.$store.dispatch('deleteItem', this.item).then(this.goToFlat)
      }
    },
    getFlatmatesThatShareThis (item) {
      return getFlatmatesFromIds(this.flat, item.idsOfFlatmatesThatShareThis)
    }
  }
}
</script>
