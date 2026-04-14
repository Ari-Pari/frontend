import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('usePlayer', () => {
	beforeEach(() => {
		vi.resetModules()
		vi.stubGlobal('MediaMetadata', class {
			constructor(data) {
				this.data = data
			}
		})
		Object.defineProperty(globalThis, 'navigator', {
			value: {
				mediaSession: {
					metadata: null,
					setActionHandler: vi.fn(),
				},
			},
			configurable: true,
		})
	})

	it('инициализируется с пустым плейлистом и без текущего трека', async () => {
		const { usePlayer } = await import('@/composables/usePlayer')
		const { playlist, currentTrack, isPlaying } = usePlayer()

		expect(playlist.value).toEqual([])
		expect(currentTrack.value).toBeNull()
		expect(isPlaying.value).toBe(false)
	})

	it('setPlaylist устанавливает плейлист и выбирает первый трек без воспроизведения', async () => {
		const { usePlayer } = await import('@/composables/usePlayer')
		const { setPlaylist, playlist, currentTrack, isPlaying } = usePlayer()
		const tracks = [{ id: 1, name: 'Track 1' }, { id: 2, name: 'Track 2' }]

		setPlaylist(tracks)

		expect(playlist.value).toEqual(tracks)
		expect(currentTrack.value).toEqual(tracks[0])
		expect(isPlaying.value).toBe(false)
	})

	it('setTrack устанавливает текущий трек и включает воспроизведение по умолчанию', async () => {
		const { usePlayer } = await import('@/composables/usePlayer')
		const { setTrack, currentTrack, isPlaying } = usePlayer()
		const track = { id: 1, name: 'Track 1', ensembles: [{ name: 'Ensemble' }] }

		setTrack(track)

		expect(currentTrack.value).toEqual(track)
		expect(isPlaying.value).toBe(true)
		expect(navigator.mediaSession.metadata.data).toMatchObject({
			title: 'Track 1',
			artist: 'Ensemble',
		})
	})

	it('handleTrackClick переключает воспроизведение для текущего трека', async () => {
		const { usePlayer } = await import('@/composables/usePlayer')
		const { setTrack, handleTrackClick, isPlaying } = usePlayer()
		const track = { id: 1, name: 'Track 1' }

		setTrack(track, false)
		handleTrackClick(track)

		expect(isPlaying.value).toBe(true)
	})

	it('nextTrack и prevTrack переключают треки в плейлисте', async () => {
		const { usePlayer } = await import('@/composables/usePlayer')
		const { setPlaylist, nextTrack, prevTrack, currentTrack } = usePlayer()
		const tracks = [{ id: 1 }, { id: 2 }, { id: 3 }]

		setPlaylist(tracks)
		nextTrack()
		expect(currentTrack.value).toEqual(tracks[1])

		prevTrack()
		expect(currentTrack.value).toEqual(tracks[0])
	})

	it('updateDuration и updateCurrentTime обновляют соответствующие значения', async () => {
		const { usePlayer } = await import('@/composables/usePlayer')
		const { duration, currentTime, updateDuration, updateCurrentTime } = usePlayer()

		updateDuration(120)
		updateCurrentTime(45)

		expect(duration.value).toBe(120)
		expect(currentTime.value).toBe(45)
	})
})
