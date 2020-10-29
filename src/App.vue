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
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
}

.absolute-toolbar-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  padding: inherit;
  z-index: -1;
}
</style>
