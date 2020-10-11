<template>
  <v-app>
    <router-view v-if="!loading"></router-view>
    <Loader v-else />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

import Loader from '@/views/Loader.vue'

export default {
  components: {
    Loader
  },
  computed: {
    ...mapState([
      'loading'
    ])
  }
}
</script>

<style lang="scss">
.v-avatar img {
  object-fit: cover;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
