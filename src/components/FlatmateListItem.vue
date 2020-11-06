<template>
  <v-list-item>
    <v-list-item-avatar>
      <Avatar :user="flatmate" />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>{{ flatmate.name }}</v-list-item-title>
    </v-list-item-content>
    <v-list-item-icon v-if="showInfo !== undefined && !flatmate.userRef">
      <v-icon>mdi-account-clock-outline</v-icon>
    </v-list-item-icon>
  </v-list-item>
</template>

<script>
import Avatar from '@/components/Avatar.vue'

export default {
  components: {
    Avatar
  },
  props: [
    'flatmate',
    'showInfo'
  ]
}
</script>
