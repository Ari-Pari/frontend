import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import AudioPlayer from '@/components/audioplayer/AudioPlayer.vue'
import { usePlayer } from '@/composables/usePlayer'

vi.mock('@/composables/usePlayer', () => ({
	usePlayer: vi.fn(),
}))

vi.mock('vue-router', () => ({
	useRoute: vi.fn(() => ({ name: 'home', meta: { playerStyle: 'header-player' } })),
}))

describe('AudioPlayer.vue', () => {
	let mockPlayer
	let playMock
	let pauseMock

	beforeEach(() => {
		playMock = vi.fn().mockResolvedValue()
		pauseMock = vi.fn()
		window.HTMLMediaElement.prototype.play = playMock
		window.HTMLMediaElement.prototype.pause = pauseMock

		mockPlayer = {
			currentTrack: ref({ id: 1, link: 'audio.mp3' }),
			isPlaying: ref(false),
			togglePlay: vi.fn(),
			nextTrack: vi.fn(),
			handleError: vi.fn(),
			updateDuration: vi.fn(),
			updateCurrentTime: vi.fn(),
			currentTime: ref(0),
		}
		usePlayer.mockReturnValue(mockPlayer)
	})

	it('рендерит audio со ссылкой на текущий трек', () => {
		const wrapper = mount(AudioPlayer)
		const audio = wrapper.find('audio')

		expect(audio.exists()).toBe(true)
		expect(audio.attributes('src')).toContain('audio.mp3')
		expect(audio.classes()).toContain('header-player')
	})

	it('не запускает воспроизведение при монтировании, если isPlaying выключен', () => {
		mount(AudioPlayer)
		expect(playMock).not.toHaveBeenCalled()
	})

	it('запускает воспроизведение при переключении isPlaying в true', async () => {
		mount(AudioPlayer)

		mockPlayer.isPlaying.value = true
		await nextTick()

		expect(playMock).toHaveBeenCalled()
	})

	it('ставит аудио на паузу при переключении isPlaying в false', async () => {
		mockPlayer.isPlaying.value = true
		const wrapper = mount(AudioPlayer)

		mockPlayer.isPlaying.value = false
		await wrapper.vm.$nextTick()

		expect(pauseMock).toHaveBeenCalled()
	})

	it('при loadedmetadata обновляет длительность', async () => {
		const wrapper = mount(AudioPlayer)
		const audio = wrapper.find('audio').element

		Object.defineProperty(audio, 'duration', { value: 123, configurable: true })
		await wrapper.find('audio').trigger('loadedmetadata')

		expect(mockPlayer.updateDuration).toHaveBeenCalledWith(123)
	})
})
