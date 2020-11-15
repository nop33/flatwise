import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'

import Avatar from '@/components/Avatar.vue'

describe('Avatar.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => { vuetify = new Vuetify() })

  function wrapperGenerator (user) {
    return shallowMount(Avatar, {
      localVue,
      vuetify,
      propsData: {
        user
      }
    })
  }

  test('renders an avatar with an image', () => {
    const user = {
      photo: 'https://randomuser.me/api/portraits/lego/2.jpg',
      name: 'Lego figure'
    }
    const wrapper = wrapperGenerator(user)
    expect(wrapper.find('img').attributes().src).toBe(user.photo)
  })

  test('renders an avatar with initials', () => {
    const user = {
      photo: '',
      name: 'Lego figure'
    }
    const wrapper = wrapperGenerator(user)
    expect(wrapper.text()).toBe('LF')
  })
})
