<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import AudioPlayer from './components/AudioPlayer.vue'
</script>

<template>
	<Header />
	<main class="page">
		<AudioPlayer />
		<RouterView />
	</main>
	<Footer />
</template>

<style lang="scss" scoped></style>
