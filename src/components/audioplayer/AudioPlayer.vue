<script setup>
import { watch, nextTick, useTemplateRef } from 'vue';
import { usePlayer } from '@/composables/usePlayer';
import { useRoute } from "vue-router"

const audioPlayerRef = useTemplateRef('audio-player')
const route = useRoute()
const { currentTrack,
	isPlaying,
	togglePlay,
	nextTrack,
	updateDuration,
	updateCurrentTime,
	currentTime } = usePlayer();

// Playing track on change
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
	<audio ref="audio-player" aria-hidden="true" tabindex="-1" class="audio-player" :class="route.meta.playerStyle"
		@play="togglePlay(true)" @pause="togglePlay(false)" @ended="nextTrack" @loadedmetadata="onMetadataLoaded"
		@timeupdate="onTimeUpdate" :src="currentTrack?.link">
	</audio>
</template>

<style lang="scss" scoped>
.audio-player {
	position: absolute;
	visibility: hidden;
	width: 0;
	height: 0;
	opacity: 0;
	pointer-events: none;
}

.dance-page-audio-player {}
</style>
