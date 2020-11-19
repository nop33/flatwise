<template>
  <div>
    <AppBarThin
      :backButtonCallback="goToFlat"
      title="Edit flat settings"
      :actionButtonCallback="save"
      actionButtonText="Save"
    />
    <v-main>
    <FlatForm v-model="flat" edit />
    <FlatmateGroupList :flatmates="currentFlatmates" :flatId="flatId" />
    <v-divider />
    <div class="d-flex justify-center ma-5">
      <v-btn color="warning" text @click="deleteFlat">
        <v-icon left>mdi-trash-can-outline</v-icon>
        Delete flat
      </v-btn>
    </div>
    </v-main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import FlatForm from '@/components/FlatForm.vue'
import FlatmateGroupList from '@/components/FlatmateGroupList.vue'
import AppBarThin from '@/components/AppBarThin.vue'

export default {
  components: {
    FlatForm,
    FlatmateGroupList,
    AppBarThin
  },
  props: [
    'flatId'
  ],
  data: () => {
    return {
      flat: {}
    }
  },
  computed: {
    ...mapGetters([
      'currentFlatmates'
    ])
  },
  created () {
    this.flat = this.$store.getters.currentFlat
  },
  methods: {
    goToFlat () {
      this.$router.push({ name: 'Flat', params: { flatId: this.flatId } })
    },
    save () {
      this.$store.dispatch('updateFlat', this.flat).then(this.goToFlat)
    },
    deleteFlat () {
      // TODO
      alert('This feature is coming soon, sry!')
    }
  }
}
</script>
