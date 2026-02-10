<script setup>
import { ref, watch, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import Button from './Button.vue'

const { t, locale } = useI18n()
watch(locale, (newLocale) => {
	document.documentElement.setAttribute('lang', newLocale)
})
</script>

<template>
	<div class="header">
		<div class="header__container">
			<nav class="header__menu menu">
				<ul class="menu__list">
					<li class="menu__item">
						<RouterLink to="/"> {{ t('homePageMenuItem') }}</RouterLink>
					</li>
					<li class="menu__item">
						<RouterLink to="/about"> {{ t('aboutPageMenuItem') }} </RouterLink>
					</li>
				</ul>
				<select class="menu__language" v-model="locale">
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

	&__language {
		// appearance: none;
	}
}
</style>
