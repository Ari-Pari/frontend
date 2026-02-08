<script setup>
import { useTemplateRef, onMounted } from 'vue';

const playerRef = useTemplateRef('player');

onMounted(() => {
	console.log(playerRef.value)
})
</script>

<template>
	<audio ref="player" class="player" controls src=""></audio>
</template>

<style lang="scss" scoped>
.player {}
</style>
