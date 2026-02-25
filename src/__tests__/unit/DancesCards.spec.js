import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import DancesCards from '@/components/dances/DancesCards.vue';
import { DanceService, defaultDancesParams } from '@/services/api';
import { refDebounced } from '@vueuse/core';

// Мокаем API
vi.mock('@/services/api', () => ({
	DanceService: {
		searchDances: vi.fn(),
		getRegions: vi.fn(),
	},
	defaultDancesParams: {
		searchText: '',
		genres: [],
		regions: [],
		complexities: [],
		genders: [],
		paces: [],
		handshakes: [],
		sortedBy: 'createdBy',
		sortType: 'ASC',
	},
}));

// Мокаем useI18n
vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (key) => key,
		locale: { value: 'en' },
	}),
}));

// Мокаем @vueuse/core для refDebounced
vi.mock('@vueuse/core', () => ({
	refDebounced: (val, delay) => val,
	useInfiniteScroll: vi.fn(),
}));

// Мокаем RouterLink
const globalOptions = {
	stubs: {
		RouterLink: { template: '<a><slot /></a>' },
	},
};

describe('DancesCards.vue', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		DanceService.getRegions.mockResolvedValue([{ id: '1', name: 'Lori' }]);
		DanceService.searchDances.mockResolvedValue([]);
		sessionStorage.clear();
	});

	it('загружает регионы и танцы при монтировании', async () => {
		mount(DancesCards, { global: globalOptions });
		await flushPromises();
		expect(DanceService.getRegions).toHaveBeenCalledWith('en');
		expect(DanceService.searchDances).toHaveBeenCalled();
	});

	it('отображает скелетоны во время загрузки', () => {
		DanceService.searchDances.mockReturnValue(new Promise(() => { })); // бесконечное ожидание
		const wrapper = mount(DancesCards, { global: globalOptions });
		expect(wrapper.findAll('.skeleton').length).toBe(12);
	});

	it('отображает карточки после загрузки данных', async () => {
		const mockDances = [{
			id: 1,
			name: 'Dance 1',
			photo_link: 'img.jpg',
			regions: [],
			genres: [],
			complexity: [],
			paces: [],
			gender: [],
			handshakes: [],
		}];
		DanceService.searchDances.mockResolvedValue(mockDances);
		const wrapper = mount(DancesCards, { global: globalOptions });
		await flushPromises();
		expect(wrapper.findAll('.dance-item').length).toBe(1);
		expect(wrapper.find('.dance-item__title').text()).toBe('Dance 1');
	});

	it('открывает и закрывает фильтр по клику', async () => {
		const wrapper = mount(DancesCards, { global: globalOptions });
		const filterButton = wrapper.find('.actions-dances__filter-button');
		expect(wrapper.find('.dances-filters.open').exists()).toBe(false);
		await filterButton.trigger('click');
		expect(wrapper.find('.dances-filters.open').exists()).toBe(true);
		await filterButton.trigger('click');
		expect(wrapper.find('.dances-filters.open').exists()).toBe(false);
	});

	it('выбирает чекбокс жанра и вызывает API', async () => {
		const wrapper = mount(DancesCards, { global: globalOptions });
		await flushPromises(); // ждём начальную загрузку
		DanceService.searchDances.mockClear();

		// Открыть фильтр
		await wrapper.find('.actions-dances__filter-button').trigger('click');
		// Найти чекбокс жанра "WAR" (первый в списке)
		const warCheckbox = wrapper.find('input[type="checkbox"][value="WAR"]');
		await warCheckbox.setValue(true);

		// Должен вызваться API с обновлёнными параметрами
		await flushPromises();
		expect(DanceService.searchDances).toHaveBeenCalledWith(
			expect.objectContaining({
				body: expect.objectContaining({ genres: ['WAR'] })
			})
		);
	});

	it('debounce поиска срабатывает через 1 секунду', async () => {
		vi.useFakeTimers();
		const wrapper = mount(DancesCards, { global: globalOptions });
		const searchInput = wrapper.find('input[name="search-input"]');
		await searchInput.setValue('test');
		expect(DanceService.searchDances).not.toHaveBeenCalled(); // не сразу
		vi.advanceTimersByTime(1000);
		await flushPromises();
		expect(DanceService.searchDances).toHaveBeenCalledWith(
			expect.objectContaining({
				body: expect.objectContaining({ searchText: 'test' })
			})
		);
		vi.useRealTimers();
	});

	it('сбрасывает фильтры по кнопке "Reset filters"', async () => {
		const wrapper = mount(DancesCards, { global: globalOptions });
		await flushPromises();
		// Открыть фильтр и выбрать жанр
		await wrapper.find('.actions-dances__filter-button').trigger('click');
		await wrapper.find('input[type="checkbox"][value="WAR"]').setValue(true);
		await flushPromises();
		expect(DanceService.searchDances).toHaveBeenLastCalledWith(
			expect.objectContaining({ body: expect.objectContaining({ genres: ['WAR'] }) })
		);

		// Нажать "Reset filters"
		const resetButton = wrapper.find('.dances-filters__current-item');
		await resetButton.trigger('click');
		await flushPromises();

		expect(DanceService.searchDances).toHaveBeenLastCalledWith(
			expect.objectContaining({ body: expect.objectContaining({ genres: [] }) })
		);
	});
});