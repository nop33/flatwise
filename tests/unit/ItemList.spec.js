import { shallowMount } from '@vue/test-utils'
import ItemList from '@/components/ItemList.vue'
import Item from '@/components/Item.vue'

describe('ItemList.vue', () => {
  test('renders an Item for each item in window.items', () => {
    window.items = [{}, {}, {}]
    const wrapper = shallowMount(ItemList)
    const items = wrapper.findAllComponents(Item)
    expect(items).toHaveLength(window.items.length)
    items.wrappers.forEach((wrapper, index) => {
      expect(wrapper.props().item).toBe(window.items[index])
    })
  })
})
