import { describe, it, expect, vi } from 'vitest'
import { useApi } from '../../composables/useApi'
import { flushPromises } from '@vue/test-utils'

describe('useApi', () => {
	it('должен инициализироваться с дефолтными значениями', () => {
		const apiCall = vi.fn()
		const { data, error, loading } = useApi(apiCall)

		expect(data.value).toBeNull()
		expect(error.value).toBeNull()
		expect(loading.value).toBe(false)
	})

	it('должен успешно получать данные', async () => {
		const mockData = { id: 1, name: 'Kochari' }
		const apiCall = vi.fn().mockResolvedValue(mockData)
		const { data, loading, execute } = useApi(apiCall)

		const promise = execute()
		expect(loading.value).toBe(true)

		await promise

		expect(loading.value).toBe(false)
		expect(data.value).toEqual(mockData)
	})

	it('должен обрабатывать ошибки', async () => {
		const mockError = new Error('Network Error')
		const apiCall = vi.fn().mockRejectedValue(mockError)
		const { data, error, loading, execute } = useApi(apiCall)

		try {
			await execute()
		} catch (e) { } // Игнорируем выброс в тесте, так как useApi ловит его внутри или выбрасывает

		expect(loading.value).toBe(false)
		expect(data.value).toBeNull()
		expect(error.value).toEqual(mockError)
	})
})