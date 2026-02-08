<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Player from './components/Player.vue'
</script>

<template>
	<Header/>
	<main class="page">
		<!-- <Player /> -->
		<RouterView />
	</main>
	<Footer/>
</template>

<style lang="scss" scoped>
</style>
