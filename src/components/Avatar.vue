<template>
  <v-avatar color="primary" :size="size">
    <img v-if="user.photo" :src="user.photo" alt="Avatar"/>
    <span v-else-if="user.name" class="white--text">{{ user.name.substring(0, 2).toUpperCase() }}</span>
  </v-avatar>
</template>

<script>
export default {
  props: [
    'user',
    'size'
  ]
}
</script>

<style lang="scss">
.v-avatar img {
  object-fit: cover;
}
</style>
