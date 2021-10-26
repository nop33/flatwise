<template>
  <div>
    <v-sheet color="grey lighten-3 py-1 px-5 text-caption">Flatmates</v-sheet>
    <v-list>
      <v-list-item-group v-model="selectedFlatmateIndex" color="primary">
        <v-list-item>
          <v-list-item-avatar>
            <v-icon class="primary--text">mdi-account-plus-outline</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="primary--text">Add new flatmate</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <FlatmateListItem v-for="flatmate in flatmates" :flatmate="flatmate" :key="flatmate.id" showInfo />
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import FlatmateListItem from '@/components/FlatmateListItem.vue'

export default {
  components: {
    FlatmateListItem
  },
  props: ['flatmates', 'flatId'],
  data: () => {
    return {
      selectedFlatmateIndex: null
    }
  },
  watch: {
    selectedFlatmateIndex(flatmateIndex) {
      if (flatmateIndex === 0) {
        this.$router.push({
          name: 'Flatmate Add',
          params: { flatId: this.flatId }
        })
      } else {
        const flatmateId = this.flatmates[flatmateIndex - 1].id
        this.$router.push({
          name: 'Flatmate Edit',
          params: { flatId: this.flatId, flatmateId }
        })
      }
    }
  }
}
</script>
