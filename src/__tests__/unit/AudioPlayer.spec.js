import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AudioPlayer from '@/components/audioplayer/AudioPlayer.vue';
import { usePlayer } from '@/composables/usePlayer';

vi.mock('@/composables/usePlayer', () => ({
	usePlayer: vi.fn(),
}));

vi.mock('vue-router', () => ({
	useRoute: vi.fn(() => ({ name: 'home', meta: {} })),
}));

describe('AudioPlayer.vue', () => {
	let mockPlayer;

	beforeEach(() => {
		mockPlayer = {
			currentTrack: { value: { id: 1, link: 'audio.mp3' } },
			isPlaying: { value: false },
			togglePlay: vi.fn(),
			nextTrack: vi.fn(),
			updateDuration: vi.fn(),
			updateCurrentTime: vi.fn(),
			currentTime: { value: 0 },
			showPlaylist: vi.fn(),
		};
		usePlayer.mockReturnValue(mockPlayer);
	});

	it('рендерится с audio элементом', () => {
		const wrapper = mount(AudioPlayer);
		const audio = wrapper.find('audio');
		expect(audio.exists()).toBe(true);
		expect(audio.attributes('src')).toBe('audio.mp3');
	});

	it('при монтировании не запускает аудио, если isPlaying false', () => {
		const playMock = vi.fn();
		window.HTMLMediaElement.prototype.play = playMock;
		mount(AudioPlayer);
		expect(playMock).not.toHaveBeenCalled();
	});

	it('при изменении isPlaying на true вызывает play на аудио', async () => {
		const playMock = vi.fn().mockResolvedValue();
		window.HTMLMediaElement.prototype.play = playMock;
		const wrapper = mount(AudioPlayer);
		mockPlayer.isPlaying.value = true;
		await wrapper.vm.$nextTick();
		expect(playMock).toHaveBeenCalled();
	});

	it('при событии loadedmetadata вызывает updateDuration', async () => {
		const wrapper = mount(AudioPlayer);
		const audio = wrapper.find('audio');
		await audio.trigger('loadedmetadata');
		expect(mockPlayer.updateDuration).toHaveBeenCalled();
	});
});