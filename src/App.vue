<template>
  <v-app class="max-width">
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
    ...mapState(['loading'])
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

.max-width {
  max-width: 768px;
  margin: auto;
  // TODO: Find a better way to theme this
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
