<template>
  <div>
    <v-sheet color="grey lighten-3 py-1 px-5 text-caption">Flatmates</v-sheet>
    <v-list>
      <v-list-item-group
        v-model="selectedFlatmateIndex"
        color="primary"
      >
        <v-list-item>
          <v-list-item-avatar>
            <v-icon class="primary--text">mdi-account-plus-outline</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="primary--text">Add new flatmate</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-for="flatmate in flatmates" :key="flatmate.id">
          <v-list-item-avatar>
            <Avatar :user="flatmate" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ flatmate.name || flatmate.email }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon v-if="!flatmate.userRef">
            <v-icon>mdi-account-clock-outline</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar.vue'

export default {
  components: {
    Avatar
  },
  props: [
    'flatmates',
    'flatId'
  ],
  data: () => {
    return {
      selectedFlatmateIndex: null
    }
  },
  watch: {
    selectedFlatmateIndex (flatmateIndex) {
      if (flatmateIndex === 0) {
        this.$router.push({ name: 'Add Flatmate', params: { flatId: this.flatId } })
      } else {
        const flatmateId = this.flatmates[flatmateIndex - 1].id
        this.$router.push({ name: 'Edit Flatmate', params: { flatId: this.flatId, flatmateId } })
      }
    }
  }
}
</script>
