<script setup>
import { usePlayer } from '@/composables/usePlayer';
const { currentTrack,
	playlist,
	isPlaying,
	setTrack,
	setPlaylist,
	togglePlay,
	showPlaylist,
	nextTrack,
	prevTrack,
	currentTime,
	seekTime,
	duration } = usePlayer();

const formatTime = (seconds) => {
	if (!seconds) return '00:00';
	const min = Math.floor(seconds / 60);
	const sec = Math.floor(seconds % 60);
	return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};
</script>

<template>
	<div v-if="playlist.length > 0" class="audio-player-controls">
		<div class="controls">
			<button @click="prevTrack">⏮</button>
			<button @click="togglePlay(!isPlaying)">
				{{ isPlaying ? 'Pause' : 'Play' }}
			</button>
			<button @click="nextTrack">⏭</button>
			<span>{{ formatTime(currentTime) }}</span> / <span>{{ formatTime(duration) }}</span>
			<input type="range" :min="0" :max="duration" :value="currentTime"
				@input="(e) => seekTime(Number(e.target.value))" />
		</div>
		<div class="audio-player-controls">
			<div class="audio-player-controls__title">{{ currentTrack?.name }}</div>
			<div class="audio-player-controls__descr">{{ currentTrack?.ensembles[0].name }}</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
