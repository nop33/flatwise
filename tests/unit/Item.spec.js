import { shallowMount } from '@vue/test-utils'
import Item from '@/components/Item.vue'

describe('Item.vue', () => {
  test('renders a link to the item.url and a item.title as title', () => {
    const item = {
      url: 'https://google.com',
      title: 'Link text'
    }
    const wrapper = shallowMount(Item, {
      propsData: { item }
    })
    const a = wrapper.find('a')
    expect(a.text()).toBe(item.title)
    expect(a.attributes().href).toBe(item.url)
  })
})
