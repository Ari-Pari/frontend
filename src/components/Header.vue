<script setup>
import Button from './Button.vue'
import { watch } from 'vue'
import { useI18n } from "vue-i18n"

const { locale } = useI18n()
watch(locale, (newLocale) => {
	document.documentElement.setAttribute('lang', newLocale)
	// fetch data
})
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
				<select v-model="locale">
					<option>hy</option>
					<option>en</option>
					<option>ru</option>
				</select>
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
