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
	it('apiRequest выбрасывает ошибку при неудачном ответе', async () => {
		const mockResponse = {
			ok: false,
			status: 404,
			json: () => Promise.resolve({ message: 'Resource not found' }),
			headers: { get: () => 'application/json' },
		};
		global.fetch.mockResolvedValue(mockResponse);
		await expect(apiRequest('/fail')).rejects.toThrow('Resource not found');
	});

	it('apiRequest корректно обрабатывает текстовый ответ ошибки', async () => {
		const mockResponse = {
			ok: false,
			status: 500,
			text: () => Promise.resolve('Internal Server Error'),
			headers: { get: () => 'text/plain' },
		};
		global.fetch.mockResolvedValue(mockResponse);
		await expect(apiRequest('/error')).rejects.toThrow('Internal Server Error');
	});

	it('apiRequest передаёт signal в fetch', async () => {
		const controller = new AbortController();
		const mockResponse = { ok: true, json: () => Promise.resolve({}) };
		global.fetch.mockResolvedValue(mockResponse);
		await apiRequest('/test', { signal: controller.signal });
		expect(global.fetch).toHaveBeenCalledWith(
			expect.stringContaining('/test'),
			expect.objectContaining({ signal: controller.signal })
		);
	});
	it('apiRequest выбрасывает ошибку при неудачном ответе', async () => {
		const mockResponse = {
			ok: false,
			status: 404,
			json: () => Promise.resolve({ message: 'Resource not found' }),
			headers: { get: () => 'application/json' },
		};
		global.fetch.mockResolvedValue(mockResponse);
		await expect(apiRequest('/fail')).rejects.toThrow('Resource not found');
	});

	it('apiRequest корректно обрабатывает текстовый ответ ошибки', async () => {
		const mockResponse = {
			ok: false,
			status: 500,
			text: () => Promise.resolve('Internal Server Error'),
			headers: { get: () => 'text/plain' },
		};
		global.fetch.mockResolvedValue(mockResponse);
		await expect(apiRequest('/error')).rejects.toThrow('Internal Server Error');
	});
})