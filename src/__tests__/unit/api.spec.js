import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiRequest, DanceService, API_BASE_URL } from '../../services/api'

describe('api service', () => {
	beforeEach(() => {
		global.fetch = vi.fn()
	})

	it('apiRequest собирает URL и дефолтные заголовки', async () => {
		global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ result: 'ok' }) })

		await apiRequest('/test', { method: 'POST', body: JSON.stringify({ foo: 'bar' }) })

		expect(global.fetch).toHaveBeenCalledWith(
			`${API_BASE_URL}/test`,
			expect.objectContaining({
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: '{"foo":"bar"}',
			})
		)
	})

	it('DanceService.getDance вызывает API с lang и signal', async () => {
		const signal = new AbortController().signal
		global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })

		await DanceService.getDance(42, 'en', signal)

		expect(global.fetch).toHaveBeenCalledWith(
			`${API_BASE_URL}/dances/42?lang=en`,
			expect.objectContaining({ signal })
		)
	})

	it('DanceService.searchDances отправляет POST с body', async () => {
		global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })

		await DanceService.searchDances({
			lang: 'ru',
			page: 2,
			size: 10,
			body: { genres: ['WAR'] },
		})

		expect(global.fetch).toHaveBeenCalledWith(
			`${API_BASE_URL}/dances/search?lang=ru&page=2&size=10`,
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify({ genres: ['WAR'] }),
			})
		)
	})

	it('apiRequest выбрасывает ошибку со статусом при неуспешном ответе', async () => {
		global.fetch.mockResolvedValue({
			ok: false,
			status: 404,
			json: () => Promise.resolve({ message: 'Resource not found' }),
		})

		await expect(apiRequest('/fail')).rejects.toThrow('404')
	})

	it('apiRequest передает signal в fetch', async () => {
		const controller = new AbortController()
		global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })

		await apiRequest('/test', { signal: controller.signal })

		expect(global.fetch).toHaveBeenCalledWith(
			expect.stringContaining('/test'),
			expect.objectContaining({ signal: controller.signal })
		)
	})
})
