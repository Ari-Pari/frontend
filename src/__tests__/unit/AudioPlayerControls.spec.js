import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AudioPlayerControls from '@/components/audioplayer/AudioPlayerControls.vue';
import { usePlayer } from '@/composables/usePlayer';

vi.mock('@/composables/usePlayer', () => ({
	usePlayer: vi.fn(),
}));

vi.mock('vue-router', () => ({
	useRoute: vi.fn(() => ({ name: 'home' })),
}));

vi.mock('vue-i18n', () => ({
	useI18n: () => ({ t: (key) => key }),
}));

describe('AudioPlayerControls.vue', () => {
	let mockPlayer;

	beforeEach(() => {
		mockPlayer = {
			currentTrack: { value: { id: 1, name: 'Test Track', ensembles: [{ id: 1, name: 'Ensemble', link: 'https://...' }] } },
			playlist: { value: [{ id: 1 }] },
			isPlaying: { value: false },
			togglePlay: vi.fn(),
			nextTrack: vi.fn(),
			prevTrack: vi.fn(),
			currentTime: { value: 30 },
			duration: { value: 120 },
			updateCurrentTime: vi.fn(),
		};
		usePlayer.mockReturnValue(mockPlayer);
	});

	it('рендерится, только если плейлист не пуст', () => {
		mockPlayer.playlist.value = [];
		const wrapper = mount(AudioPlayerControls);
		expect(wrapper.find('.audio-player-controls').exists()).toBe(false);

		mockPlayer.playlist.value = [{ id: 1 }];
		const wrapper2 = mount(AudioPlayerControls);
		expect(wrapper2.find('.audio-player-controls').exists()).toBe(true);
	});

	it('отображает название текущего трека и исполнителей', () => {
		const wrapper = mount(AudioPlayerControls);
		expect(wrapper.find('.audio-player-controls__title').text()).toBe('Test Track');
		expect(wrapper.find('.audio-player-controls__author').text()).toBe('Ensemble');
	});

	it('при клике на play вызывает togglePlay с true', async () => {
		const wrapper = mount(AudioPlayerControls);
		await wrapper.find('.audio-player-controls__play-btn').trigger('click');
		expect(mockPlayer.togglePlay).toHaveBeenCalledWith(true);
	});

	it('при клике на prev вызывает prevTrack', async () => {
		const wrapper = mount(AudioPlayerControls);
		await wrapper.findAll('button')[0].trigger('click');
		expect(mockPlayer.prevTrack).toHaveBeenCalled();
	});

	it('при клике на next вызывает nextTrack', async () => {
		const wrapper = mount(AudioPlayerControls);
		await wrapper.findAll('button')[2].trigger('click');
		expect(mockPlayer.nextTrack).toHaveBeenCalled();
	});

	it('при изменении ползунка обновляет время', async () => {
		const wrapper = mount(AudioPlayerControls);
		const range = wrapper.find('input[type="range"]');
		await range.setValue(45);
		expect(mockPlayer.updateCurrentTime).toHaveBeenCalledWith(45);
	});

	it('отображает корректное форматированное время', () => {
		const wrapper = mount(AudioPlayerControls);
		const durations = wrapper.findAll('.audio-player-controls__duration');
		expect(durations[0].text()).toBe('00:30');
		expect(durations[1].text()).toBe('02:00');
	});
});