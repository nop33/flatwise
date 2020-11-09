<template>
  <div>
    <v-toolbar flat color="primary" dark fixed>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Edit item</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text large @click="save" :disabled="!isButtonEnabled">Save</v-btn>
    </v-toolbar>
    <v-main>
      <ItemForm v-model="item" :allFlatmates="allFlatmates" @form-validity="isButtonEnabled = $event" />
    </v-main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getFlatFromStateById, fetchFlatItemsAndStoreInFlatWithId } from '@/utils/getters'

import ItemForm from '@/components/ItemForm.vue'

export default {
  components: {
    ItemForm
  },
  props: [
    'flatId',
    'itemId'
  ],
  data: () => {
    return {
      flat: {},
      item: {},
      allFlatmates: [],
      isButtonEnabled: false
    }
  },
  computed: {
    ...mapGetters([
      'currentFlatmates'
    ])
  },
  async created () {
    this.flat = getFlatFromStateById(this.flatId)
    this.allFlatmates = this.currentFlatmates(this.flatId)
    if (!this.flat.items) {
      await fetchFlatItemsAndStoreInFlatWithId(this.flatId)
    }
    this.item = this.flat.items.find(item => item.id === this.itemId)
  },
  methods: {
    save () {
      this.$store.dispatch('updateItem', this.item).then(this.$router.go(-1))
    }
  }
}
</script>
