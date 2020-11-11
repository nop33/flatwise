<template>
  <div>
    <AppBarThin
      :backButtonCallback="back"
      title="Create new flat"
      :actionButtonCallback="save"
      actionButtonText="Save"
    />
    <v-main>
      <FlatForm v-model="flat" />
    </v-main>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import FlatForm from '@/components/FlatForm.vue'
import AppBarThin from '@/components/AppBarThin.vue'

export default {
  components: {
    FlatForm,
    AppBarThin
  },
  data: () => {
    return {
      flat: {
        name: '',
        items: [],
        depreciationRate: 20,
        lowestPriceRate: 20,
        initialMoveInDate: null
      }
    }
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  methods: {
    back () {
      this.$router.push({ name: 'Home' })
    },
    save () {
      this.$store.dispatch('createFlat', this.flat).then(flatId => {
        this.$router.push({ name: 'Flat', params: { flatId } })
      })
    }
  }
}
</script>
