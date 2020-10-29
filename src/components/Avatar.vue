<template>
  <v-avatar :color="color" :size="size" :left="left">
    <img v-if="user.photo" :src="user.photo" alt="Avatar"/>
    <span v-else-if="user.name" class="white--text">{{ initials }}</span>
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
    },
    initials () {
      const words = this.user.name.split(' ')
      const initials = words.length > 1 ? `${words[0].charAt(0)}${words[1].charAt(0)}` : `${words[0].charAt(0)}${words[0].charAt(1)}`
      return initials.toUpperCase()
    }
  }
}
</script>

<style lang="scss">
.v-avatar img {
  object-fit: cover;
}
</style>
