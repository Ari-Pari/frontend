<script setup>
import { ref, watch, nextTick, useTemplateRef, onMounted } from 'vue';
import { usePlayer } from '@/composables/usePlayer';
import { useRoute } from "vue-router"

const audioPlayerRef = useTemplateRef('audio-player')
const route = useRoute()
const { currentTrack,
	playlist,
	isPlaying,
	setTrack,
	setPlaylist,
	togglePlay,
	showPlaylist,
	nextTrack,
	prevTrack,
	updateDuration,
	updateCurrentTime,
	currentTime,
	duration } = usePlayer();

watch(currentTrack, async (newTrack) => {
	if (isPlaying.value) {
		if (!newTrack) return;
		await nextTick();
		if (audioPlayerRef.value) {
			audioPlayerRef.value.play();
		}
	}
});
watch(isPlaying, (shouldPlay) => {
	if (!audioPlayerRef.value) return;

	if (shouldPlay) {
		audioPlayerRef.value.play();
	} else {
		audioPlayerRef.value.pause();
	}
});
watch(currentTime, (newTime) => {
	if (audioPlayerRef.value) {
		const diff = Math.abs(audioPlayerRef.value.currentTime - newTime);
		if (diff > 0.5) {
			audioPlayerRef.value.currentTime = newTime;
		}
	}
});
const onMetadataLoaded = () => {
	updateDuration(audioPlayerRef.value.duration);
};

const onTimeUpdate = () => {
	updateCurrentTime(audioPlayerRef.value.currentTime);
};
</script>

<template>
	<audio ref="audio-player" class="audio-player" controls :class="route.meta.playerStyle" @play="togglePlay(true)"
		@pause="togglePlay(false)" @ended="nextTrack" @loadedmetadata="onMetadataLoaded" @timeupdate="onTimeUpdate"
		:src="currentTrack?.link">
	</audio>
</template>

<style lang="scss" scoped>
.audio-player {
	position: absolute;
	// opacity: 0;
	// visibility: hidden;
}

.dance-page-audio-player {
}
</style>
