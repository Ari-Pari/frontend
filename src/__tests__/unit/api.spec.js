import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiRequest, DanceService, API_BASE_URL } from '../../services/api'

describe('api service', () => {
	beforeEach(() => {
		global.fetch = vi.fn()
	})

	it('apiRequest constructs correct URL and headers', async () => {
		const mockResponse = { ok: true, json: () => Promise.resolve({ result: 'ok' }) }
		global.fetch.mockResolvedValue(mockResponse)

		await apiRequest('/test', { method: 'POST', body: JSON.stringify({ foo: 'bar' }) })

		expect(global.fetch).toHaveBeenCalledWith(
			`${API_BASE_URL}/test`,
			expect.objectContaining({
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: '{"foo":"bar"}'
			})
		)
	})

	it('DanceService.getDance calls apiRequest with correct params', async () => {
		const spy = vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: () => ({}) })
		await DanceService.getDance(42, 'en')
		expect(spy).toHaveBeenCalledWith(
			`${API_BASE_URL}/dances/42?lang=en`,
			expect.any(Object)
		)
	})

	it('DanceService.searchDances sends POST with body', async () => {
		const spy = vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: () => ({}) })
		const params = {
			lang: 'ru',
			page: 2,
			size: 10,
			body: { genres: ['WAR'] }
		}
		await DanceService.searchDances(params)
		expect(spy).toHaveBeenCalledWith(
			`${API_BASE_URL}/dances/search?lang=ru&page=2&size=10`,
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify({ genres: ['WAR'] })
			})
		)
	})
})