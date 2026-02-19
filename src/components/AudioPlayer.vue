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
	prevTrack } = usePlayer();

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

</script>

<template>
	<audio ref="audio-player" class="audio-player" controls :class="route.meta.playerStyle" @play="togglePlay(true)"
		@pause="togglePlay(false)" @ended="nextTrack" :src="currentTrack?.link"></audio>
</template>

<style lang="scss" scoped>
.audio-player {
	position: absolute;
	// opacity: 0;
	// visibility: hidden;
}

.dance-page-audio-player {
	position: absolute;
	top: 520px;
	right: 16px;
}
</style>
