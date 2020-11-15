import Item from '@/components/Item.vue'
import Vue from 'vue'

describe('Item.vue', () => {
  test('sanity text', () => {
    const Ctor = Vue.extend(Item)
    const vm = new Ctor().$mount()
    expect(vm.$el.textContent).toContain('item text')
  })
})
