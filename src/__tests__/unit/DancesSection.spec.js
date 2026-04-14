import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import DancesSection from '@/components/dances/DancesSection.vue'
import { DanceService } from '@/services/api'

const { intersectionObserverMock } = vi.hoisted(() => ({
	intersectionObserverMock: vi.fn(),
}))

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
}))

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (key) => key,
		locale: ref('en'),
	}),
}))

vi.mock('@vueuse/core', async () => {
	const actual = await vi.importActual('@vueuse/core')
	return {
		...actual,
		refDebounced: (value) => value,
		useIntersectionObserver: intersectionObserverMock,
	}
})

const globalOptions = {
	stubs: {
		RouterLink: { template: '<a><slot /></a>' },
		DanceCard: {
			props: ['dance'],
			template: '<div class="dance-item"><div class="dance-item__title">{{ dance.name }}</div></div>',
		},
		DancesFilters: {
			props: ['params', 'isOpen', 'regions', 'filterButtonRef'],
			template: '<div class="dances-filters" :class="{ open: isOpen }"></div>',
		},
	},
}

describe('DancesSection.vue', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		DanceService.getRegions.mockResolvedValue([{ id: 1, name: 'Lori' }])
		DanceService.searchDances.mockResolvedValue([])
		sessionStorage.clear()
	})

	it('загружает регионы и танцы при монтировании', async () => {
		mount(DancesSection, { global: globalOptions })
		await flushPromises()

		expect(DanceService.getRegions).toHaveBeenCalledWith('en', expect.any(AbortSignal))
		expect(DanceService.searchDances).toHaveBeenCalledWith(
			expect.objectContaining({
				lang: 'en',
				page: 1,
				size: 12,
			}),
			expect.any(AbortSignal)
		)
	})

	it('отображает карточки после загрузки данных', async () => {
		DanceService.searchDances.mockResolvedValue([
			{
				id: 1,
				name: 'Dance 1',
			},
		])

		const wrapper = mount(DancesSection, { global: globalOptions })
		await flushPromises()

		expect(wrapper.findAll('.dance-item')).toHaveLength(1)
		expect(wrapper.find('.dance-item__title').text()).toBe('Dance 1')
	})

	it('открывает и закрывает фильтр по клику на кнопку', async () => {
		const wrapper = mount(DancesSection, { global: globalOptions })
		const filterButton = wrapper.find('.actions-dances__filter-button')

		expect(wrapper.find('.actions-dances__filter-button').classes()).not.toContain('open')
		await filterButton.trigger('click')
		expect(wrapper.find('.actions-dances__filter-button').classes()).toContain('open')
		await filterButton.trigger('click')
		expect(wrapper.find('.actions-dances__filter-button').classes()).not.toContain('open')
	})

	it('обновляет поиск и повторно загружает танцы', async () => {
		const wrapper = mount(DancesSection, { global: globalOptions })
		await flushPromises()
		DanceService.searchDances.mockClear()

		await wrapper.find('input[name="search-input"]').setValue('kochari')
		await flushPromises()

		expect(DanceService.searchDances).toHaveBeenCalledWith(
			expect.objectContaining({
				body: expect.objectContaining({ searchText: 'kochari' }),
			}),
			expect.any(AbortSignal)
		)
	})

	it('сохраняет параметры фильтра в sessionStorage после изменения сортировки', async () => {
		const wrapper = mount(DancesSection, { global: globalOptions })
		await flushPromises()

		await wrapper.findAll('select')[1].setValue('DESC')
		await flushPromises()

		expect(JSON.parse(sessionStorage.getItem('dancesFilter'))).toMatchObject({
			sortType: 'DESC',
			searchText: '',
		})
	})
})
