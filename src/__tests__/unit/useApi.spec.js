import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useApi } from '../../composables/useApi'

describe('useApi', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('инициализируется с дефолтными значениями', () => {
		const apiCall = vi.fn()
		const { data, error, loading } = useApi(apiCall)

		expect(data.value).toBeNull()
		expect(error.value).toBeNull()
		expect(loading.value).toBe(false)
	})

	it('успешно получает данные', async () => {
		const mockData = { id: 1, name: 'Kochari' }
		const apiCall = vi.fn().mockResolvedValue(mockData)
		const { data, loading, execute } = useApi(apiCall)

		const promise = execute()
		expect(loading.value).toBe(true)

		await promise

		expect(loading.value).toBe(false)
		expect(data.value).toEqual(mockData)
	})

	it('сохраняет ошибку и пробрасывает ее дальше', async () => {
		const mockError = new Error('Network Error')
		const apiCall = vi.fn().mockRejectedValue(mockError)
		const { data, error, loading, execute } = useApi(apiCall)

		await expect(execute()).rejects.toThrow('Network Error')
		expect(loading.value).toBe(false)
		expect(data.value).toBeNull()
		expect(error.value).toEqual(mockError)
	})

	it('отменяет предыдущий запрос при повторном вызове', async () => {
		const abortFirstSpy = vi.fn()
		class MockAbortController {
			constructor() {
				this.abort = vi.fn()
				this.signal = { aborted: false }
				if (!MockAbortController.firstInstance) {
					MockAbortController.firstInstance = this
					this.abort = abortFirstSpy
				}
			}
		}
		MockAbortController.firstInstance = null
		vi.stubGlobal('AbortController', MockAbortController)

		const pending = new Promise(() => {})
		const apiCall = vi.fn().mockReturnValue(pending)
		const { execute } = useApi(apiCall)

		void execute()
		void execute()

		expect(abortFirstSpy).toHaveBeenCalledTimes(1)
		expect(apiCall).toHaveBeenCalledTimes(2)
	})

	it('игнорирует AbortError и не записывает его в error', async () => {
		const apiCall = vi
			.fn()
			.mockRejectedValueOnce(Object.assign(new Error('aborted'), { name: 'AbortError' }))
			.mockResolvedValueOnce({ ok: true })
		const { data, error, execute } = useApi(apiCall)

		await expect(execute()).resolves.toBeUndefined()
		await expect(execute()).resolves.toEqual({ ok: true })

		expect(error.value).toBeNull()
		expect(data.value).toEqual({ ok: true })
	})
})
