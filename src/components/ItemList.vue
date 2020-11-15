<template>
  <div>
    <Item v-for="item in displayItems" :item="item" :key="item.id" />
  </div>
</template>

<script>
import Item from '@/components/Item.vue'

export default {
  components: {
    Item
  },
  data: () => {
    return {
      displayItems: window.items
    }
  }
}
</script>
