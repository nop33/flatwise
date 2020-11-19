<template>
  <v-list-item-content>
    <div class="d-flex justify-space-between align-center">
      <span>{{ item.name }}</span>
      <div class="flex-shrink-0 ml-3">
        <Avatar
          v-for="flatmate in flatmatesThatShareThis"
          :key="flatmate.id"
          size="24"
          class="text-caption ml-1"
          :user="flatmate"
        />
      </div>
    </div>
  </v-list-item-content>
</template>

<script>
import Avatar from '@/components/Avatar.vue'

export default {
  components: {
    Avatar
  },
  props: [
    'item'
  ],
  computed: {
    flatmatesThatShareThis () {
      const currentFlatmates = this.$store.getters.currentFlatmates
      return currentFlatmates.filter(flatmate => this.item.idsOfFlatmatesThatShareThis.includes(flatmate.id))
    }
  }
}
</script>
