import { ref, reactive, computed } from "vue"

const state = reactive({
	currentTrack: null,
	playlist: [],
	globalPlaylist: [],
	isPlaying: false,
	duration: 0,
	currentTime: 0,
})

export function usePlayer() {
	const currentTrack = computed(() => state.currentTrack)
	const playlist = computed(() => state.playlist)
	const isPlaying = computed(() => state.isPlaying)
	const duration = computed(() => state.duration);
	const currentTime = computed(() => state.currentTime);

	const setTrack = (track) => {
		state.currentTrack = track
		state.isPlaying = true
		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: track.name,
				artist: track.ensembles[0].name
			})
		}
	}
	const handleTrackClick = (track) => {
		if (state.currentTrack.id === track.id) {
			state.isPlaying = !state.isPlaying
		} else {
			setTrack(track)
		}
	}
	const setPlaylist = (tracks) => {
		state.playlist = tracks
		//localStorage.setItem('userPlaylist', JSON.stringify(state.playlist))
		if (tracks.length > 0) {
			state.currentTrack = tracks[0]
			if ('mediaSession' in navigator) {
				navigator.mediaSession.metadata = new MediaMetadata({
					title: tracks[0].name,
					artist: tracks[0].ensembles[0].name
				})
			}
		}
	}
	const togglePlay = (status) => {
		state.isPlaying = status;
	}
	const nextTrack = () => {
		const currentIndex = state.playlist.indexOf(state.currentTrack)
		if (currentIndex < state.playlist.length - 1) {
			state.currentTrack = state.playlist[currentIndex + 1]
		} else {
			state.currentTrack = state.playlist[0]
		}
		// state.isPlaying = false
	}
	const prevTrack = () => {
		const currentIndex = state.playlist.indexOf(state.currentTrack);
		if (currentIndex > 0) {
			state.currentTrack = state.playlist[currentIndex - 1];
		}
		//	state.isPlaying = false
	}
	const showPlaylist = () => {
		console.log("Playlist:", state.playlist)
	}
	const seekTime = (time) => {
		state.currentTime = time
	}
	const updateDuration = (time) => {
		state.duration = time
	}
	const updateCurrentTime = (time) => {
		state.currentTime = time
	}
	return {
		currentTrack,
		playlist,
		isPlaying,
		setTrack,
		handleTrackClick,
		setPlaylist,
		togglePlay,
		showPlaylist,
		nextTrack,
		prevTrack,
		duration,
		currentTime,
		seekTime,
		updateDuration,
		updateCurrentTime
	};
}