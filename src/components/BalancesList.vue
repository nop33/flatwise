<template>
  <v-list class="balances-list">
    <v-list-item v-for="(balance, index) in balances" :key="index">
      <v-list-item-avatar>
        <Avatar :user="balance.flatmate" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          <slot name="rowText" v-bind:balance="balance">
            {{ balance.flatmate.name }} share is
            <strong class="secondary--text">
              {{ balance.share | round }}
            </strong>
            CHF
          </slot>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import Avatar from '@/components/Avatar.vue'

export default {
  components: {
    Avatar
  },
  props: [
    'balances'
  ]
}
</script>

<style lang="scss">
.balances-list .v-list-item__title {
  overflow: visible;
  white-space: normal;
}
</style>
