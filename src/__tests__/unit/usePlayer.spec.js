import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePlayer } from '@/composables/usePlayer';

describe('usePlayer', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('инициализируется с пустым плейлистом и без текущего трека', () => {
		const { playlist, currentTrack, isPlaying } = usePlayer();
		expect(playlist.value).toEqual([]);
		expect(currentTrack.value).toBeNull();
		expect(isPlaying.value).toBe(false);
	});

	it('setPlaylist устанавливает плейлист и выбирает первый трек (без воспроизведения)', () => {
		const { setPlaylist, playlist, currentTrack, isPlaying } = usePlayer();
		const tracks = [{ id: 1, name: 'Track 1' }, { id: 2, name: 'Track 2' }];
		setPlaylist(tracks);
		expect(playlist.value).toEqual(tracks);
		expect(currentTrack.value).toEqual(tracks[0]);
		expect(isPlaying.value).toBe(false);
	});

	it('setTrack устанавливает текущий трек и включает воспроизведение по умолчанию', () => {
		const { setTrack, currentTrack, isPlaying } = usePlayer();
		const track = { id: 1, name: 'Track 1' };
		setTrack(track);
		expect(currentTrack.value).toBe(track);
		expect(isPlaying.value).toBe(true);
	});

	it('togglePlay изменяет состояние воспроизведения', () => {
		const { togglePlay, isPlaying } = usePlayer();
		togglePlay(true);
		expect(isPlaying.value).toBe(true);
		togglePlay(false);
		expect(isPlaying.value).toBe(false);
	});

	it('handleTrackClick переключает воспроизведение, если трек уже текущий', () => {
		const { setTrack, handleTrackClick, isPlaying } = usePlayer();
		const track = { id: 1, name: 'Track 1' };
		setTrack(track, false);
		handleTrackClick(track);
		expect(isPlaying.value).toBe(true);
	});

	it('handleTrackClick меняет трек, если передан другой', () => {
		const { setPlaylist, handleTrackClick, currentTrack, isPlaying } = usePlayer();
		const tracks = [{ id: 1, name: 'Track 1' }, { id: 2, name: 'Track 2' }];
		setPlaylist(tracks);
		handleTrackClick(tracks[1]);
		expect(currentTrack.value).toBe(tracks[1]);
		expect(isPlaying.value).toBe(true);
	});

	it('nextTrack переключает на следующий трек', () => {
		const { setPlaylist, nextTrack, currentTrack } = usePlayer();
		const tracks = [{ id: 1 }, { id: 2 }, { id: 3 }];
		setPlaylist(tracks);
		nextTrack();
		expect(currentTrack.value).toBe(tracks[1]);
		nextTrack();
		expect(currentTrack.value).toBe(tracks[2]);
		nextTrack();
		expect(currentTrack.value).toBe(tracks[0]);
	});

	it('prevTrack переключает на предыдущий трек', () => {
		const { setPlaylist, prevTrack, currentTrack } = usePlayer();
		const tracks = [{ id: 1 }, { id: 2 }, { id: 3 }];
		setPlaylist(tracks);
		prevTrack(); // с первого должен остаться первый, но сброс времени
		expect(currentTrack.value).toBe(tracks[0]);
		// переместимся на второй
		const { nextTrack } = usePlayer();
		nextTrack();
		prevTrack();
		expect(currentTrack.value).toBe(tracks[0]);
	});

	it('updateDuration и updateCurrentTime обновляют соответствующие значения', () => {
		const { duration, currentTime, updateDuration, updateCurrentTime } = usePlayer();
		updateDuration(120);
		expect(duration.value).toBe(120);
		updateCurrentTime(45);
		expect(currentTime.value).toBe(45);
	});
});