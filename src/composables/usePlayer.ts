import { reactive, computed } from "vue"

interface IEnsemble {
	id: number | string;
	name: string;
	link: string;
}
interface ITrack {
	id: number | string;
	name: string;
	link: string;
	ensembles?: IEnsemble[];
}
interface IPlayerState {
	currentTrack: ITrack | null;
	playlist: ITrack[];
	globalPlaylist: ITrack[];
	isPlaying: boolean;
	isExpanded: boolean;
	duration: number;
	currentTime: number;
}
const state: IPlayerState = reactive({
	currentTrack: null,
	playlist: [],
	globalPlaylist: [],
	isPlaying: false,
	duration: 0,
	currentTime: 0,
	isExpanded: false,
})

export function usePlayer() {
	const currentTrack = computed(() => state.currentTrack)
	const playlist = computed(() => state.playlist)
	const isPlaying = computed(() => state.isPlaying)
	const isExpanded = computed(() => state.isExpanded)
	const duration = computed(() => state.duration);
	const currentTime = computed(() => state.currentTime);

	const setTrack = (track: ITrack | null, play: boolean = true) => {
		state.currentTrack = track
		state.isPlaying = play
		updateCurrentTime(0)
		if ('mediaSession' in navigator) {
			const artistNames = track?.ensembles?.map(ensemble => ensemble.name).join(', ') || 'AriPari';
			navigator.mediaSession.metadata = new MediaMetadata({
				title: track?.name,
				artist: artistNames
			})
			navigator.mediaSession.setActionHandler('play', () => togglePlay(true));
			navigator.mediaSession.setActionHandler('pause', () => togglePlay(false));
			navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
			navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
		}
	}
	const handleTrackClick = (track: ITrack | null) => {
		if (state.currentTrack?.id === track?.id) {
			togglePlay(!state.isPlaying)
		} else {
			setTrack(track)
		}
	}
	const setPlaylist = (tracks: ITrack[]) => {
		state.playlist = tracks
		if (tracks.length > 0) {
			setTrack(tracks[0], false)
		}
	}
	const togglePlay = (status: boolean) => {
		state.isPlaying = status;
	}
	const handleError = (e: Event | string) => {
		console.error("Audio error:", e);
		togglePlay(false);
	}
	const toggleExpand = (val?: boolean) => {
		state.isExpanded = typeof val === 'boolean' ? val : !state.isExpanded
	}
	const nextTrack = () => {
		const currentIndex = state.playlist.findIndex(t => t.id === state.currentTrack?.id)
		if (currentIndex < state.playlist.length - 1) {
			setTrack(state.playlist[currentIndex + 1], state.isPlaying)
		} else {
			setTrack(state.playlist[0], state.isPlaying)
		}
	}
	const prevTrack = () => {
		const currentIndex = state.playlist.findIndex(t => t.id === state.currentTrack?.id)
		if (currentIndex > 0) {
			setTrack(state.playlist[currentIndex - 1], state.isPlaying)
		} else if (currentIndex === 0) {
			setTrack(state.playlist[0], state.isPlaying)
			updateCurrentTime(0)
		}
	}
	const showPlaylist = () => {
		console.log("Playlist:", state.playlist)
		console.log("Track", state.currentTrack)
		console.log("IsPlaying", state.isPlaying)
		console.log("Time", state.currentTime)
		console.log("Duration", state.duration)
	}
	const updateDuration = (time: number) => {
		state.duration = time
	}
	const updateCurrentTime = (time: number) => {
		state.currentTime = time
	}
	return {
		currentTrack,
		handleError,
		playlist,
		isPlaying,
		setTrack,
		handleTrackClick,
		setPlaylist,
		togglePlay,
		showPlaylist,
		nextTrack,
		prevTrack,
		isExpanded,
		toggleExpand,
		duration,
		currentTime,
		updateDuration,
		updateCurrentTime
	};
}