import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HelloWorld from '../FileManager.vue'

describe('FileManager', () => {
  it('renders properly', () => {
    const wrapper = mount(FileManager, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
