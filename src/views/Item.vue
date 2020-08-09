<template>
  <div>
    <v-toolbar flat color="primary" dark>
      <v-btn icon @click="goToFlat">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{ item.name }}</v-toolbar-title>
      <template v-slot:extension>
        <v-btn color="red" dark absolute bottom right fab @click="edit">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </template>
    </v-toolbar>
    <v-main>
      <!-- <Item :item="item" /> -->
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
