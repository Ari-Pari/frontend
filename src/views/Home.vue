<script setup></script>

<template>
	<section class="first-screen">
		<div class="first-screen__container">
			Это home
			<h1>{{ $t('welcome') }}</h1>
		</div>
	</section>
	<div class="dances">
		<div class="dances__container">
			<!-- <div v-for="dance in dances" class="dances__body">
				<RouterLink to="/dances/20"> Go to Dance </RouterLink>
				<router-link :to="`/dances/${dance.slug}`">
					{{ dances.name }}
				</router-link>
			</div> -->
		</div>
	</div>
</template>

<style lang="scss" scoped>
</style>
