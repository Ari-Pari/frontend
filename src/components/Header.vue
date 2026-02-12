<script setup>
import { ref, watch, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter, useRoute } from 'vue-router'
import { headerScroll, menuInit } from "../services/utils"

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()

const currentLang = computed(() => locale.value)

const scrollToDance = async () => {
	if (route.name != 'home') {
		await router.push('/#dancesBlock')
	} else {
		requestAnimationFrame(() => {
			document.getElementById('dancesBlock')
				?.scrollIntoView({ behavior: 'smooth', block: 'start' })
		})
	}
}

onMounted(() => {
	headerScroll()
})

watch(locale, (newLocale) => {
	document.documentElement.setAttribute('lang', newLocale)
	localStorage.setItem('language', newLocale)
})
</script>

<template>
	<header data-scroll-show class="header">
		<div class="header__container">
			<div class="header__menu menu">
				<div class="menu__left">
					<RouterLink to="/" class="menu__logo"><img src="../assets/AriPari_logo.png" alt="logo"></RouterLink>
					<button type="button" class="menu__left-button button">
						{{ t('supportButton') }}
					</button>
				</div>
				<button type="button" @click="menuInit" class="menu__icon icon-menu"><span></span></button>
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
	</header>
</template>

<style lang="scss" scoped>
.header {
	position: fixed;
	top: 34px;
	z-index: 50;
	width: 100%;
	left: 0;
	transition: all 0.5s;

	@media (max-width:$pc) {
		padding: 0 toRem(16);
	}

	@media (max-width:$tablet) {
		top: 16px;
	}

	&._header-scroll {
		top: -100%;
	}

	&._header-show {
		top: 34px;

		@media (max-width:$tablet) {
			top: 16px;
		}
	}

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

		&-button {
			@media (max-width:$tablet) {
				width: toRem(200);
			}

			@media (max-width:$mobileSmall) {
				width: auto;
				height: toRem(35);
				font-size: toRem(16);
			}
		}
	}

	&__logo {
		width: 93px;
		height: 93px;
		margin-right: toRem(9);

		@media (max-width:$mobileSmall) {
			width: 50px;
			height: 50px;
		}

		img {
			max-width: 100%;
			max-height: 100%;
		}
	}

	&__body {
		display: flex;
		align-items: center;

		@media (max-width: $tablet) {
			position: fixed;
			width: 100%;
			height: 100%;
			right: -100%;
			top: 0;
			overflow: auto;
			padding: toRem(75) toRem(16) toRem(30);
			transition: right 0.3s;
			background-color: #fff;
			flex-direction: column;
			justify-content: center;

			.menu-open & {
				right: 0;

				&::before {
					left: 0;
				}
			}
		}
	}

	&__list {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: toRem(20);
		margin-right: toRem(30);

		@media (max-width:$tablet) {
			flex-direction: column;
			margin-bottom: toRem(40);
			margin-right: 0;
			gap: toRem(30);
		}
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

		@media (max-width:$tablet) {
			font-size: toRem(24);
		}

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

.icon-menu {
	display: none;

	@media (max-width: $tablet) {
		display: block;
		position: relative;
		width: toRem(30);
		height: toRem(18);
		z-index: 5;

		@media (any-hover: none) {
			cursor: default;
		}

		span,
		&::before,
		&::after {
			content: "";
			transition: all 0.3s ease 0s;
			right: 0;
			position: absolute;
			width: 100%;
			height: toRem(2);
			background-color: $mainColor;
		}

		&::before {
			top: 0;
		}

		&::after {
			bottom: 0;
		}

		span {
			top: calc(50% - toRem(1));
		}

		.menu-open & {
			span {
				width: 0;
			}

			&::before,
			&::after {}

			&::before {
				top: calc(50% - toRem(1));
				transform: rotate(-45deg);
			}

			&::after {
				bottom: calc(50% - toRem(1));
				transform: rotate(45deg);
			}
		}
	}
}
</style>
