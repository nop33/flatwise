<template>
  <div>
    <v-toolbar flat color="primary" dark fixed>
      <v-btn icon @click="goHome">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Create new flat</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text large @click="save">Save</v-btn>
    </v-toolbar>
    <v-main>
      <FlatForm :flat="flat" />
    </v-main>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import FlatForm from '@/components/FlatForm.vue'

export default {
  components: {
    FlatForm
  },
  data: () => {
    return {
      flat: {
        name: '',
        flatmates: [],
        flatmatesUids: [],
        items: [],
        depreciationRate: 20,
        lowestPriceRate: 20
      }
    }
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  created () {
    this.flat.flatmates.push(this.user.displayName)
    this.flat.flatmatesUids.push(this.user.id)
  },
  methods: {
    goHome () {
      this.$router.push({ name: 'Home' })
    },
    save () {
      this.$store.dispatch('createFlat', this.flat).then(flatId => {
        this.$router.push({ name: 'Flat', params: { flatId } })
      })
    }
  }
}
</script>
