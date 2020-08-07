<template>
  <v-card>
    <v-card-title>{{ flat.name }}</v-card-title>
    <v-list>
      <v-list-item-group v-model="selectedItem">
        <v-list-item v-for="item in flat.items" :key="item.id">
          <v-list-item-icon>
            <v-icon>mdi-seat-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-btn fab color="red white--text" bottom right fixed :to="{ name: 'AddItem', params: { flatId: flat.id } }">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-card>
</template>

<script>
export default {
  props: [
    'flat'
  ],
  data: () => {
    return {
      selectedItem: null
    }
  },
  created () {
    this.$store.dispatch('fetchFlatItems', this.flat)
  }
}
</script>
