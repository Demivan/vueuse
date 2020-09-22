import { renderHook } from '../../_docs/tests'
import { useStorage } from '../useStorage'
import { createGlobalState } from '.'

const KEY = 'custom-key'

describe('createGlobalState', () => {
  afterEach(() => {
    localStorage.clear()
    // @ts-ignore
    localStorage.setItem.mockClear()
  })

  it('should work after dispose 1', async() => {
    const useGlobalState = createGlobalState(() => useStorage(KEY, 'a'))

    const instance1 = renderHook(() => {
      const ref = useGlobalState()

      expect(ref.value).toBe('a')
      expect(localStorage.setItem).toBeCalledWith(KEY, 'a')
      // @ts-ignore
      localStorage.setItem.mockClear()

      return {
        ref,
      }
    })

    const vm1 = instance1.vm

    vm1.ref = 'b'
    await vm1.$nextTick()

    expect(vm1.ref).toBe('b')
    expect(localStorage.setItem).toBeCalledWith(KEY, 'b')
    // @ts-ignore
    localStorage.setItem.mockClear()

    instance1.destroy()

    const instance2 = renderHook(() => {
      const ref = useGlobalState()

      expect(ref.value).toBe('b')

      return {
        ref,
      }
    })

    const vm2 = instance2.vm

    vm2.ref = 'c'
    await vm2.$nextTick()

    expect(vm2.ref).toBe('c')
    expect(localStorage.setItem).toBeCalledWith(KEY, 'c')
  })

  it('should work after dispose 2', async() => {
    const ref = createGlobalState(() => useStorage(KEY, 'a'))()

    const instance1 = renderHook(() => {
      expect(ref.value).toBe('a')
      expect(localStorage.setItem).toBeCalledWith(KEY, 'a')
      // @ts-ignore
      localStorage.setItem.mockClear()

      return {
        ref,
      }
    })

    const vm1 = instance1.vm

    vm1.ref = 'b'
    await vm1.$nextTick()

    expect(vm1.ref).toBe('b')
    expect(localStorage.setItem).toBeCalledWith(KEY, 'b')
    // @ts-ignore
    localStorage.setItem.mockClear()

    instance1.destroy()

    const instance2 = renderHook(() => {
      expect(ref.value).toBe('b')

      return {
        ref,
      }
    })

    const vm2 = instance2.vm

    vm2.ref = 'c'
    await vm2.$nextTick()

    expect(vm2.ref).toBe('c')
    expect(localStorage.setItem).toBeCalledWith(KEY, 'c')
  })
})
