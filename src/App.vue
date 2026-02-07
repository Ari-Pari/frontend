<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
<Header/>
<main class="page">
	<RouterView />
</main>
<Footer/>
</template>

<style lang="scss" scoped>
</style>
