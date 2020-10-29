<template>
  <v-avatar :color="color" :size="size" :left="left">
    <img v-if="user.photo" :src="user.photo" alt="Avatar"/>
    <span v-else-if="user.name" class="white--text">{{ user.name.substring(0, 2).toUpperCase() }}</span>
  </v-avatar>
</template>

<script>
import { stringToHslColor } from '@/utils/utils.js'

export default {
  props: [
    'user',
    'size',
    'left'
  ],
  computed: {
    color () {
      return stringToHslColor(this.user.name)
    }
  }
}
</script>

<style lang="scss">
.v-avatar img {
  object-fit: cover;
}
</style>
