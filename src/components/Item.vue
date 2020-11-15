<template>
  <div>
    <a :href="item.url">{{ item.title }}</a>
  </div>
</template>

<script>
export default {
  props: [
    'item'
  ]
}
</script>
