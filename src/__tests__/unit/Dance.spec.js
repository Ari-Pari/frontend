import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { ref } from 'vue'
import Dance from '@/views/Dance.vue'
import { DanceService } from '@/services/api'
import { usePlayer } from '@/composables/usePlayer'

vi.mock('@/services/api', () => ({
	DanceService: {
		getDance: vi.fn(),
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

vi.mock('@/composables/usePlayer', () => ({
	usePlayer: vi.fn(),
}))

vi.mock('@/composables/useClipboard', () => ({
	useClipboard: () => ({
		copiedField: ref(null),
		copyText: vi.fn(),
	}),
}))

vi.mock('@vueuse/core', () => ({
	useShare: () => ({
		share: vi.fn(),
		isSupported: ref(false),
	}),
}))

vi.mock('vue-i18n', () => ({
	useI18n: () => ({ t: (key) => key, locale: ref('en') }),
}))

vi.mock('vue-lite-youtube-embed', () => ({
	default: { template: '<div class="youtube-embed" />' },
}))

vi.mock('swiper/vue', () => ({
	Swiper: { template: '<div class="swiper"><slot /></div>' },
	SwiperSlide: { template: '<div class="swiper-slide"><slot /></div>' },
}))

describe('Dance.vue', () => {
	let router
	let mockPlayer

	beforeEach(async () => {
		router = createRouter({
			history: createMemoryHistory(),
			routes: [
				{ path: '/:locale', name: 'home', component: { template: '<div>Home</div>' } },
				{ path: '/:locale/dances/:id', name: 'dance', component: { template: '<div>Dance</div>' } },
			],
		})
		await router.push('/en')
		await router.isReady()

		mockPlayer = {
			currentTrack: ref(null),
			isPlaying: ref(false),
			handleTrackClick: vi.fn(),
			playlist: ref([]),
			setPlaylist: vi.fn((tracks) => {
				mockPlayer.playlist.value = tracks
				mockPlayer.currentTrack.value = tracks[0] || null
			}),
			togglePlay: vi.fn(),
		}
		usePlayer.mockReturnValue(mockPlayer)

		DanceService.getDance.mockResolvedValue({
			id: 1,
			name: 'Kochari',
			regions: [{ id: 1, name: 'Lori' }],
			genres: ['WAR'],
			complexity: [2],
			paces: [2],
			gender: ['MULTY'],
			handshakes: ['FREE'],
			photo_link: 'photo.jpg',
			songs: [{ id: 1, name: 'Song', link: 'song.mp3', ensembles: [] }],
			sourceVideos: [{ id: 1, name: 'Source', link: 'https://youtu.be/abc' }],
			performanceVideos: [],
			lessonVideos: [],
		})
		sessionStorage.clear()
	})

	it('загружает данные танца при монтировании', async () => {
		const wrapper = mount(Dance, {
			props: { id: '1' },
			global: {
				plugins: [router],
				stubs: { AudioPlayerControls: true },
			},
		})

		await flushPromises()

		expect(DanceService.getDance).toHaveBeenCalledWith('1', 'en', expect.any(AbortSignal))
		expect(wrapper.find('.dance-top__title').text()).toBe('Kochari')
	})

	it('устанавливает плейлист из songs после загрузки', async () => {
		mount(Dance, {
			props: { id: '1' },
			global: {
				plugins: [router],
				stubs: { AudioPlayerControls: true },
			},
		})

		await flushPromises()

		expect(mockPlayer.setPlaylist).toHaveBeenCalledWith([{ id: 1, name: 'Song', link: 'song.mp3', ensembles: [] }])
	})

	it('по клику на регион сохраняет фильтр и редиректит на главную', async () => {
		const pushSpy = vi.spyOn(router, 'push')
		const wrapper = mount(Dance, {
			props: { id: '1' },
			global: {
				plugins: [router],
				stubs: { AudioPlayerControls: true },
			},
		})

		await flushPromises()
		await wrapper.find('.dance-top__category').trigger('click')

		expect(JSON.parse(sessionStorage.getItem('dancesFilter'))).toMatchObject({ regions: [1] })
		expect(pushSpy).toHaveBeenCalledWith({ name: 'home', hash: '#dances' })
	})

	it('собирает все видео в единый список', async () => {
		const wrapper = mount(Dance, {
			props: { id: '1' },
			global: {
				plugins: [router],
				stubs: { AudioPlayerControls: true },
			},
		})

		await flushPromises()

		expect(wrapper.vm.allVideos).toEqual([
			{ id: 1, name: 'Source', link: 'https://youtu.be/abc', category: 'source' },
		])
	})
})
