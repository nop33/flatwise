import { shallowMount } from '@vue/test-utils'
import Item from '@/components/Item.vue'

describe('Item.vue', () => {
  test('sanity text', () => {
    const wrapper = shallowMount(Item)
    expect(wrapper.text()).toContain('item text')
  })
})
