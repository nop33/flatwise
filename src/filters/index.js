import Vue from 'vue'

Vue.filter('round', function (value) {
  if (value !== 0 && !value) return ''
  value = parseFloat(value)
  return Math.floor(value * 100) / 100
})

Vue.filter('humanReadable', function (value) {
  if (!value) return ''
  const date = new Date(value)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Intl.DateTimeFormat('en-GB', options).format(date)
})
