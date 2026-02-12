<script setup>
import { ref, watch, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()

const currentLang = computed(() => locale.value)

const scrollToDance = async () => {
	if (route.name != 'home') {
		router.push('/#dancesElement')
	}
	requestAnimationFrame(() => {
		document.getElementById('dancesBlock')
			?.scrollIntoView({ behavior: 'smooth', block: 'start' })
	})
}

watch(locale, (newLocale) => {
	document.documentElement.setAttribute('lang', newLocale)
	localStorage.setItem('language', newLocale)
})
</script>

<template>
	<div class="header">
		<div class="header__container">
			<div class="header__menu menu">
				<div class="menu__left">
					<RouterLink to="/" class="menu__logo"><img src="../assets/AriPari_logo.png" alt="logo"></RouterLink>
					<button type="button" class="button">
						{{ t('supportButton') }}
					</button>
				</div>
				<button type="button" class="menu__icon icon-menu"><span></span></button>
				<nav class="menu__body">
					<ul class="menu__list">
						<li class="menu__item">
							<RouterLink class="menu__link" to="/"> {{ t('homePageMenuItem') }}</RouterLink>
						</li>
						<li class="menu__item">
							<RouterLink class="menu__link" to="/about"> {{ t('aboutPageMenuItem') }} </RouterLink>
						</li>
					</ul>
					<div class="menu__actions">
						<button @click='scrollToDance' v-bind:aria-label="t('searchAriaLabel')"
							class="menu__search-icon"></button>
						<div class="menu__languages">
							<input type="radio" id="lang-arm" class="menu__language-input" value="hy" v-model="locale" />
							<label for="lang-arm" :class="{ active: currentLang === 'hy' }"
								class="menu__language-label">հայ</label>
							<input type="radio" id="lang-eng" class="menu__language-input" value="en" v-model="locale" />
							<label for="lang-eng" :class="{ active: currentLang === 'en' }"
								class="menu__language-label">eng</label>
							<input type="radio" id="lang-rus" class="menu__language-input" value="ru" v-model="locale" />
							<label for="lang-rus" :class="{ active: currentLang === 'ru' }"
								class="menu__language-label">рус</label>
						</div>
					</div>
				</nav>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.header {
	position: fixed;
	top: 34px;
	z-index: 50;
	width: 100%;
	left: 0;

	&__container {
		background-color: #fff;
		border: 1.51px solid #eaeaea;
		border-radius: 60px;
	}
}

.menu {
	display: flex;
	align-items: center;
	justify-content: space-between;
	max-height: 82px;

	&__left {
		display: flex;
		align-items: center;

	}

	&__logo {
		width: 93px;
		height: 93px;
		margin-right: toRem(9);

		img {
			max-width: 100%;
			max-height: 100%;
		}
	}

	&__icon {}

	&__body {
		display: flex;
		align-items: center;
	}

	&__list {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: toRem(20);
		margin-right: toRem(30);
	}

	&__item {
		.router-link-exact-active {
			color: $orangeColor;
		}
	}

	&__link {
		transition: all 0.3s;
		font-size: toRem(20);
		color: #353535;

		@media (any-hover: hover) {
			&:hover {
				color: $orangeHoverColor;
			}
		}
	}

	&__actions {
		display: flex;
		align-items: center;
	}

	&__search-icon {
		margin-right: toRem(10);
		border: 1.51px solid #eaeaea;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: toRem(58);
		height: toRem(58);
		flex: 0 0 toRem(58);
		border-radius: 50%;
		transition: all 0.3s;
		background: url('../assets/icons/search.svg') center no-repeat, #fff;

		@media (any-hover: hover) {
			&:hover {
				background: url('../assets/icons/search-hover.svg') center no-repeat, #ff8d10;
				border: 1.51px solid #ff8d10;
			}
		}
	}

	&__languages {
		display: flex;
		max-width: toRem(180);
	}

	&__language-input {
		appearance: none;
		visibility: hidden;
		opacity: 0;
		position: absolute
	}

	&__language-label {
		cursor: pointer;
		padding: 0 toRem(10);
		font-size: toRem(20);
		color: #989898;
		transition: all 0.3s;

		&.active {
			color: #353535;
		}

		&:not(:last-child) {
			border-right: 1.51px solid #eaeaea;
		}

		@media (any-hover: hover) {
			&:hover {
				color: #353535;
			}
		}
	}
}

.icon-menu {}
</style>
