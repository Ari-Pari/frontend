<script setup></script>

<template>
	<nav>
		<RouterLink to="/"> Go to Home </RouterLink>
		<RouterLink to="/dances/20"> Go to Dance </RouterLink>
		<!-- <router-link :to="`/dances/${dance.slug}`">
		{{ dances.name }}
		</router-link> -->
		<RouterLink to="/about"> Go to About </RouterLink>
	</nav>
</template>

<style lang="scss" scoped>
</style>
