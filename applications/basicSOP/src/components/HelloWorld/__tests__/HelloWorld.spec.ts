import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from '../HelloWorld.vue'

describe('HelloWorld', () => {
  it('render', () => {
    const wrapper = mount(HelloWorld)
    expect(wrapper.text()).toBe('Hello World')
  })
})
