import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        // Stollen from no.12: https://vanschneider.com/colors
        primary: '#0dbcd6',
        secondary: '#e6625e'
      }
    }
  }
})
