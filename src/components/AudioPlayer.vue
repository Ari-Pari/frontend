<script setup>
import { useTemplateRef, onMounted } from 'vue';
const audioPlayerRef = useTemplateRef('audio-player');

onMounted(() => {
	// console.log(audioPlayerRef.value)
})
// Получаем текущую страницу, если это не dance то добавляем класс
</script>

<template>
	<audio ref="audio-player" class="audio-player" controls :src="music"></audio>
</template>

<style lang="scss" scoped>
.player {}
</style>
