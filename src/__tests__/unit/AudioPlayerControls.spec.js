import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import AudioPlayerControls from '@/components/audioplayer/AudioPlayerControls.vue'
import { usePlayer } from '@/composables/usePlayer'

vi.mock('@/composables/usePlayer', () => ({
	usePlayer: vi.fn(),
}))

vi.mock('vue-router', () => ({
	useRoute: vi.fn(() => ({ name: 'home' })),
}))

vi.mock('vue-i18n', () => ({
	useI18n: () => ({ t: (key) => key }),
}))

describe('AudioPlayerControls.vue', () => {
	let mockPlayer

	beforeEach(() => {
		mockPlayer = {
			currentTrack: ref({
				id: 1,
				name: 'Test Track',
				link: 'https://cdn.example/test.mp3',
				ensembles: [{ id: 1, name: 'Ensemble', link: 'https://example.com' }],
			}),
			playlist: ref([{ id: 1 }]),
			isPlaying: ref(false),
			togglePlay: vi.fn(),
			nextTrack: vi.fn(),
			prevTrack: vi.fn(),
			currentTime: ref(30),
			duration: ref(120),
			updateCurrentTime: vi.fn(),
		}
		usePlayer.mockReturnValue(mockPlayer)
	})

	it('рендерится только при непустом плейлисте и валидном треке', () => {
		mockPlayer.playlist.value = []
		const hiddenWrapper = mount(AudioPlayerControls)
		expect(hiddenWrapper.find('.audio-player-controls').exists()).toBe(false)

		mockPlayer.playlist.value = [{ id: 1 }]
		const visibleWrapper = mount(AudioPlayerControls)
		expect(visibleWrapper.find('.audio-player-controls').exists()).toBe(true)
	})

	it('отображает данные текущего трека и ссылку на скачивание', () => {
		const wrapper = mount(AudioPlayerControls)

		expect(wrapper.find('.audio-player-controls__title').text()).toBe('Test Track')
		expect(wrapper.find('.audio-player-controls__author').text()).toBe('Ensemble')
		expect(wrapper.find('.audio-player-controls__download').attributes('href')).toBe('https://cdn.example/test.mp3')
	})

	it('по клику на play вызывает togglePlay c инвертированным состоянием', async () => {
		const wrapper = mount(AudioPlayerControls)

		await wrapper.find('.audio-player-controls__play-btn').trigger('click')

		expect(mockPlayer.togglePlay).toHaveBeenCalledWith(true)
	})

	it('кнопки prev и next вызывают навигацию по плейлисту', async () => {
		const wrapper = mount(AudioPlayerControls)
		const buttons = wrapper.findAll('button')

		await buttons[0].trigger('click')
		await buttons[2].trigger('click')

		expect(mockPlayer.prevTrack).toHaveBeenCalled()
		expect(mockPlayer.nextTrack).toHaveBeenCalled()
	})

	it('изменение range обновляет текущее время', async () => {
		const wrapper = mount(AudioPlayerControls)

		await wrapper.find('input[type="range"]').setValue(45)

		expect(mockPlayer.updateCurrentTime).toHaveBeenCalledWith(45)
	})

	it('показывает форматированное текущее время и длительность', () => {
		const wrapper = mount(AudioPlayerControls)
		const durations = wrapper.findAll('.audio-player-controls__duration')

		expect(durations[0].text()).toBe('00:30')
		expect(durations[1].text()).toBe('02:00')
	})
})
