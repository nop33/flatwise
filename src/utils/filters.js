import Vue from 'vue'

function round (value) {
  if (value !== 0 && !value) return ''
  value = parseFloat(value)
  return Math.round(value * 100) / 100
}

function humanReadable (value) {
  if (!value) return ''
  const date = new Date(value)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Intl.DateTimeFormat('en-GB', options).format(date)
}

Vue.filter('round', round)
Vue.filter('humanReadable', humanReadable)

export {
  round,
  humanReadable
}
