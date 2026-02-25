import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import Dance from '@/views/Dance.vue';
import { DanceService } from '@/services/api';
import { usePlayer } from '@/composables/usePlayer';

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
}));

vi.mock('@/composables/usePlayer', () => ({
	usePlayer: vi.fn(),
}));

vi.mock('vue-i18n', () => ({
	useI18n: () => ({ t: (key) => key, locale: { value: 'en' } }),
}));

// Мок для LiteYouTubeEmbed
vi.mock('vue-lite-youtube-embed', () => ({
	default: { template: '<div></div>' },
}));

// Мок для swiper
vi.mock('swiper/vue', () => ({
	Swiper: { template: '<div><slot /></div>' },
	SwiperSlide: { template: '<div><slot /></div>' },
}));

const router = createRouter({
	history: createWebHistory(),
	routes: [{ path: '/', name: 'home' }],
});

describe('Dance.vue', () => {
	let wrapper;
	let mockPlayer;

	beforeEach(() => {
		mockPlayer = {
			currentTrack: { value: null },
			isPlaying: { value: false },
			handleTrackClick: vi.fn(),
			playlist: { value: [] },
			setPlaylist: vi.fn(),
		};
		usePlayer.mockReturnValue(mockPlayer);

		DanceService.getDance.mockResolvedValue({
			id: 1,
			name: 'Kochari',
			regions: [{ id: 1, name: 'Lori' }],
			genres: ['WAR'],
			complexity: [2],
			paces: [2],
			gender: ['multi'],
			handshakes: ['FREE'],
			photo_link: 'photo.jpg',
			songs: [{ id: 1, name: 'Song', ensembles: [] }],
			sourceVideos: [{ id: 1, name: 'Source', link: 'https://youtu.be/abc' }],
			performanceVideos: [],
			lessonVideos: [],
		});
	});

	it('загружает данные танца при монтировании', async () => {
		wrapper = mount(Dance, {
			props: { id: '1' },
			global: {
				plugins: [router],
				stubs: ['RouterLink'],
			},
		});

		expect(DanceService.getDance).toHaveBeenCalledWith('1', 'en');
		await flushPromises();

		expect(wrapper.find('.dance-top__title').text()).toBe('Kochari');
	});

	it('устанавливает плейлист из songs после загрузки', async () => {
		wrapper = mount(Dance, {
			props: { id: '1' },
			global: { plugins: [router], stubs: ['RouterLink'] },
		});
		await flushPromises();
		expect(mockPlayer.setPlaylist).toHaveBeenCalledWith([{ id: 1, name: 'Song', ensembles: [] }]);
	});

	it('при клике на регион вызывает chooseFilter и редиректит', async () => {
		const push = vi.spyOn(router, 'push');
		wrapper = mount(Dance, {
			props: { id: '1' },
			global: { plugins: [router], stubs: ['RouterLink'] },
		});
		await flushPromises();

		await wrapper.find('.dance-top__category').trigger('click');
		await wrapper.vm.$nextTick();

		expect(push).toHaveBeenCalledWith({ path: '/', hash: '#dances' });
	});

	it('отображает видео слайды', async () => {
		wrapper = mount(Dance, {
			props: { id: '1' },
			global: { plugins: [router], stubs: ['RouterLink'] },
		});
		await flushPromises();

		expect(wrapper.vm.allVideos).toEqual([
			{ id: 1, name: 'Source', link: 'https://youtu.be/abc', category: 'source' },
		]);
	});
});