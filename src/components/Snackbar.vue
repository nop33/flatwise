<template>
  <v-snackbar :value="value" @input="changed($event)" :color="color">
    <div class="d-flex">
      <v-icon class="mr-3" v-html="icon"></v-icon>
      <span v-html="text"></span>
    </div>
    <template v-slot:action="{ attrs }">
      <v-btn icon text v-bind="attrs" @click="changed(false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  props: [
    'value',
    'icon',
    'text',
    'color'
  ],
  data: () => {
    return {
      isVisible: false
    }
  },
  methods: {
    changed ($event) {
      this.isVisible = $event
      this.$emit('input', this.isVisible)
    }
  }
}
</script>
