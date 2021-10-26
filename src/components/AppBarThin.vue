<template>
  <v-toolbar flat color="primary" dark fixed>
    <v-btn icon @click="goBack">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn v-if="actionButtonText" text large @click="performAction" :disabled="!isPageFormValid">
      {{ actionButtonText }}
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['backButtonCallback', 'title', 'actionButtonCallback', 'actionButtonText'],
  computed: {
    ...mapState(['isPageFormValid'])
  },
  methods: {
    goBack() {
      this.backButtonCallback()
      this.invalidatePageForm()
    },
    performAction() {
      this.actionButtonCallback()
      this.invalidatePageForm()
    },
    invalidatePageForm() {
      this.$store.commit('SET_PAGE_FORM_VALIDITY', false)
    }
  }
}
</script>
