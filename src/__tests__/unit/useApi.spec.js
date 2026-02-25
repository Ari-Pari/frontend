import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApi } from '../../composables/useApi';
import { flushPromises } from '@vue/test-utils';

describe('useApi', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('должен инициализироваться с дефолтными значениями', () => {
		const apiCall = vi.fn();
		const { data, error, loading } = useApi(apiCall);
		expect(data.value).toBeNull();
		expect(error.value).toBeNull();
		expect(loading.value).toBe(false);
	});

	it('должен успешно получать данные', async () => {
		const mockData = { id: 1, name: 'Kochari' };
		const apiCall = vi.fn().mockResolvedValue(mockData);
		const { data, loading, execute } = useApi(apiCall);
		const promise = execute();
		expect(loading.value).toBe(true);
		await promise;
		expect(loading.value).toBe(false);
		expect(data.value).toEqual(mockData);
	});

	it('должен обрабатывать ошибки', async () => {
		const mockError = new Error('Network Error');
		const apiCall = vi.fn().mockRejectedValue(mockError);
		const { data, error, loading, execute } = useApi(apiCall);
		try {
			await execute();
		} catch (e) { }
		expect(loading.value).toBe(false);
		expect(data.value).toBeNull();
		expect(error.value).toEqual(mockError);
	});

	it('отменяет предыдущий запрос при повторном вызове', async () => {
		const abortSpy = vi.fn();
		// Важно: возвращаем конструктор, а не объект
		const MockAbortController = vi.fn(() => ({
			abort: abortSpy,
			signal: {},
		}));
		vi.stubGlobal('AbortController', MockAbortController);

		const apiCall = vi.fn().mockImplementation(() => new Promise(res => setTimeout(res, 100)));
		const { execute } = useApi(apiCall);
		execute();
		await flushPromises(); // даём микротаскам выполниться
		execute(); // второй вызов должен отменить первый
		expect(abortSpy).toHaveBeenCalledTimes(1);
		vi.unstubAllGlobals();
	});

	it('не обновляет состояние после отмены', async () => {
		const MockAbortController = vi.fn(() => ({
			abort: vi.fn(),
			signal: {},
		}));
		vi.stubGlobal('AbortController', MockAbortController);

		const apiCall = vi.fn().mockImplementation(() => new Promise(res => setTimeout(res, 50)));
		const { execute, data, loading } = useApi(apiCall);

		const promise1 = execute();
		const promise2 = execute(); // отменяет первый

		await promise1.catch(() => { });
		await promise2;

		expect(data.value).toBeNull();
		expect(loading.value).toBe(false);
		vi.unstubAllGlobals();
	});
});