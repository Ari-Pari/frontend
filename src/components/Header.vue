<script setup>
import Button from './Button.vue'
</script>

<template>
	<div class="header">
		<div class="header__container">
			<nav class="header__menu menu">
				<ul class="menu__list">
					<li class="menu__item">
						<RouterLink to="/"> {{ $t('homePage') }}</RouterLink>
					</li>
					<li class="menu__item">
						<RouterLink to="/about"> {{ $t('aboutPage') }} </RouterLink>
					</li>
				</ul>
				<Button />
			</nav>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.header {
	&__container {}

	&__menu {}
}

.menu {
	&__list {}

	&__item {
		.router-link-exact-active {
			color: red;
		}
	}
}
</style>
