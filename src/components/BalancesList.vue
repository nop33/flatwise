<template>
  <v-list class="balances-list">
    <v-list-item-group v-model="selectedFlatmateIndex">
      <template v-for="(balance, index) in balances">
        <v-list-item :key="index">
          <v-list-item-avatar>
            <Avatar :user="balance.flatmate" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ balance.flatmate.name }} share is
              <strong class="secondary--text">
                {{ balance.share | round }}
              </strong>
              CHF
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list-item-group>
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
  ],
  data: () => {
    return {
      selectedFlatmateIndex: null
    }
  }
}
</script>
