<script setup>
import { ref, useTemplateRef, onMounted } from 'vue';
const audioPlayerRef = useTemplateRef('audio-player');

// const tracks = ref([
// 	{ id: 1, link: '/src/assets/music/2009.mp3' },
// 	{ id: 2, link: '/src/assets/music/Small worlds.mp3' }
// ])
// let current = ref(tracks.value[0].link)
// onMounted(() => {
// 	console.log(audioPlayerRef.value)
// })
// Получаем текущую страницу, если это не dance то добавляем класс
</script>

<template>
	<audio ref="audio-player" class="audio-player" controls :src="current"></audio>
</template>

<style lang="scss" scoped>
.player {}
</style>
