<script setup>
import { ref, watch, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import Button from './Button.vue'

const { t, locale } = useI18n()
watch(locale, (newLocale) => {
	document.documentElement.setAttribute('lang', newLocale)
	localStorage.setItem('language', newLocale)
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
				<div class="menu__actions">
					<select v-bind:aria-label="t('selectAriaLabel')" class="menu__language" v-model="locale">
						<option>hy</option>
						<option>en</option>
						<option>ru</option>
					</select>
					<Button>Это кнопка</Button>
				</div>
			</nav>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.header {
	background-color: #929292;
	padding: toRem(30);
	margin-bottom: toRem(30);

	&__container {}

}

.menu {
	display: flex;
	justify-content: space-between;
	align-items: center;

	&__list {
		display: flex;
		align-items: center;
		gap: toRem(20);
		margin-right: toRem(30);
	}

	&__actions {
		display: flex;
		align-items: center;
		gap: toRem(20);
	}

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
