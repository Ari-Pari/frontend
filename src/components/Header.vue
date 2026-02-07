<script setup></script>

<template>
	<nav>
		<RouterLink to="/"> Go to Home </RouterLink>
		<RouterLink to="/dance/20"> Go to Dance </RouterLink>
		<!-- <router-link :to="`/dance/${dance.slug}`">
		{{ dance.name }}
		</router-link> -->
		<RouterLink to="/about"> Go to About </RouterLink>
	</nav>
</template>

<style lang="scss" scoped>
</style>
