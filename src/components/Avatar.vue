<template>
  <v-avatar :size="size" :left="left" :class="classes" :style="`background-color: ${color}`">
    <img v-if="user.photo" :src="user.photo" alt="Avatar" />
    <span v-else-if="user.name" class="white--text">{{ initials }}</span>
  </v-avatar>
</template>

<script>
import { stringToHslColor } from '@/utils/utils.js'

export default {
  props: ['user', 'size', 'left', 'border'],
  computed: {
    color() {
      return stringToHslColor(this.user.name)
    },
    initials() {
      const words = this.user.name.split(' ')
      const initials =
        words.length > 1 ? `${words[0].charAt(0)}${words[1].charAt(0)}` : `${words[0].charAt(0)}${words[0].charAt(1)}`
      return initials.toUpperCase()
    },
    classes() {
      return {
        'has-border': this.border !== undefined
      }
    }
  }
}
</script>

<style lang="scss">
.v-avatar img {
  object-fit: cover;
}

.has-border {
  border: 2px solid white;
}
</style>
