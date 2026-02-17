<script setup>
import { ref, watch, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"

const { t, locale } = useI18n()

</script>

<template>
	<div class="about-main">
		<div class="about-main__container">
			<div class="about-main__body">
				<div class="about-main__logo">
					<img src="@/assets/logo-white.svg" alt="AriPari logo">
				</div>
				<div class="about-main__text">{{ t('aboutText1') }}</div>
			</div>
			<div class="about-main__image">
				<img src="@/assets/about/first-screen-image.png" alt="Dancers image">
			</div>
		</div>
	</div>
	<section class="about-history">
		<div class="about-history__container">
			<h2 class="about-history__title about-title">{{ t('aboutText2') }}</h2>
			<div class="about-history__cards">
				<div class="about-history__card">
					<div class="about-history__card-number">01</div>
					<div class="about-history__card-text">{{ t('aboutText3') }}</div>
				</div>
				<div class="about-history__card">
					<div class="about-history__card-number">02</div>
					<div class="about-history__card-text">{{ t('aboutText4') }}</div>
				</div>
				<div class="about-history__card">
					<div class="about-history__card-number">03</div>
					<div class="about-history__card-text">{{ t('aboutText5') }}</div>
				</div>
			</div>
			<div class="about-history__text">{{ t('aboutText6') }}</div>
		</div>
	</section>
	<section class="about-bot">
		<div class="about-bot__container">
			<h2 class="about-bot__title">{{ t('aboutText7') }}</h2>
			<div class="about-bot__text">{{ t('aboutText8') }}</div>
			<ul class="about-bot__list">
				<li class="about-bot__list-item">{{ t('aboutText9') }}</li>
				<li class="about-bot__list-item">{{ t('aboutText10') }}</li>
				<li class="about-bot__list-item">{{ t('aboutText11') }}</li>
			</ul>
			<a href="https://t.me/AriPariBot" target="_blank" class="about-bot__button button">{{ t('aboutText12') }}</a>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.about-title {
	font-weight: 600;
	font-size: toRem(59);
	background: linear-gradient(90deg, #fcb62a 0%, #fd880c 100%);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	margin-bottom: toRem(48);
	line-height: 1.1;

	@media (max-width:$tablet) {
		font-size: toRem(40);
	}

	@media (max-width:$mobile) {
		font-size: toRem(32);
		margin-bottom: toRem(30);
	}

	@media (max-width:$mobileSmall) {
		font-size: toRem(26);
	}
}

.about-main {
	background: linear-gradient(180deg, #fda31c 0%, #fd860a 100%);
	padding: toRem(234) 0 toRem(118);

	@media (max-width:$tablet) {
		padding: toRem(180) 0 toRem(100);
	}

	@media (max-width:$mobile) {
		padding: toRem(150) 0 toRem(31);
	}

	&__container {
		display: flex;

		@media (max-width:$mobile) {
			flex-direction: column;
		}
	}

	&__body {
		margin-right: toRem(78);

		@media (max-width:$mobile) {
			margin: toRem(0) toRem(0) toRem(50) toRem(0);
		}
	}

	&__logo {
		margin-bottom: toRem(20);

		img {
			width: 326px;
			height: 137px;

			@media (max-width:$tablet) {
				width: 250px;
				height: auto;
			}

			@media (max-width:$mobileSmall) {
				width: 200px;
			}
		}
	}

	&__text {
		font-weight: 500;
		font-size: toRem(20);
		color: #fff;
		line-height: 1.3;

		@media (max-width:$tablet) {
			font-size: toRem(18);
		}

		@media (max-width:$mobileSmall) {
			font-size: toRem(16);
		}
	}

	&__image {
		flex: 0 0 59%;

		@media (max-width:$tablet) {
			flex: 0 0 50%;
		}

		img {
			max-width: 100%;
		}
	}
}

.about-history {
	// background: url('@/assets/about/first-screen-bg.svg') center/cover no-repeat, #fff;

	// @media (max-width:$mobileSmall) {
	// 	background: url('@/assets/about/first-screen-bg-mobile.svg') center/cover no-repeat, #fff;
	// }
	padding: toRem(60) 0 toRem(200);

	@media (max-width:$mobile) {
		padding: toRem(60) 0;
	}

	&__container {}

	&__title {}

	&__cards {
		margin-bottom: toRem(58);
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: toRem(71);

		@media (max-width: toEm(1300)) {
			gap: toRem(30);
		}

		@media (max-width: toEm(1150)) {
			gap: toRem(20);
		}

		@media (max-width: toEm(600)) {
			grid-template-columns: 1fr;
			margin-bottom: toRem(30);
		}
	}

	&__card {
		background: #fff;
		border-radius: 20px;
		border: 1px solid #fc860a;
		display: flex;
		align-items: center;
		padding: toRem(45) toRem(37);

		@media (max-width: toEm(1300)) {
			padding: toRem(30);
		}

		@media (max-width: toEm(1150)) {
			padding: toRem(30) toRem(20);
		}

		@media (max-width:$tablet) {
			flex-direction: column;
			align-items: start;
		}

		@media (max-width: toEm(600)) {
			flex-direction: row;
			align-items: center;
			padding: toRem(20) toRem(15);
		}
	}

	&__card-number {
		font-weight: 600;
		font-size: toRem(99);
		line-height: 108%;
		letter-spacing: -0.02em;
		background: linear-gradient(180deg, #fc860a 0%, #fcb62a 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-right: toRem(28);

		@media (max-width: toEm(1150)) {
			margin-right: toRem(20);
			font-size: toRem(70);
		}

		@media (max-width:$tablet) {
			margin: toRem(0) toRem(0) toRem(10) toRem(0);
		}

		@media (max-width: toEm(600)) {
			margin: toRem(0) toRem(20) toRem(0) toRem(0);
			font-size: toRem(50);
		}
	}

	&__card-text {
		font-size: toRem(20);
		line-height: 114%;
		letter-spacing: -0.02em;
		color: #1a1a1a;

		@media (max-width:$mobile) {
			font-size: toRem(18);
		}

		@media (max-width: toEm(600)) {
			font-size: toRem(16);
		}
	}

	&__text {
		font-size: toRem(26);
		line-height: 114%;
		letter-spacing: -0.02em;
		color: #1a1a1a;
		max-width: toRem(505);
		white-space: pre-line;

		@media (max-width:$mobile) {
			font-size: toRem(20);
			max-width: toRem(400);
		}

		@media (max-width:$mobileSmall) {
			font-size: toRem(18);
		}
	}
}

.about-bot {
	background: linear-gradient(180deg, #fda21c 0%, #fd870b 100%);
	padding: toRem(80) 0;

	@media (max-width:$mobile) {
		padding: toRem(60) 0;
	}

	&__container {}

	&__title {
		color: #fff;
		font-weight: 600;
		font-size: toRem(59);
		margin-bottom: toRem(41);
		line-height: 1.1;

		@media (max-width:$tablet) {
			font-size: toRem(40);
		}

		@media (max-width:$mobile) {
			font-size: toRem(32);
			margin-bottom: toRem(30);
		}

		@media (max-width:$mobileSmall) {
			font-size: toRem(26);
		}
	}

	&__text {
		font-family: var(--font-family);
		font-weight: 500;
		font-size: 26px;
		color: #fff;
		margin-bottom: toRem(26);
		max-width: toRem(622);
		line-height: 1.2;

		@media (max-width:$tablet) {
			font-size: toRem(22);
		}

		@media (max-width:$mobile) {
			font-size: toRem(20);
			margin-bottom: toRem(20);
		}

		@media (max-width:$mobileSmall) {
			font-size: toRem(18);
		}
	}

	&__list {
		display: flex;
		align-items: start;
		margin-bottom: toRem(58);

		@media (max-width:$mobile) {
			margin-bottom: toRem(40);
			flex-direction: column;
		}
	}

	&__list-item {
		font-size: toRem(20);
		color: #fff;
		margin-right: toRem(20);
		white-space: pre-line;
		position: relative;
		padding-left: toRem(21);

		@media (max-width:$mobile) {
			font-size: toRem(18);
			margin: toRem(0) toRem(0) toRem(20) toRem(0);
		}

		@media (max-width:$mobileSmall) {
			font-size: toRem(16);
		}

		&::before {
			content: '';
			border-radius: 50%;
			background-color: #fff;
			position: absolute;
			top: 7px;
			left: 0;
			width: toRem(8);
			height: toRem(8);
		}
	}

	&__button {
		border: 1px solid #fff;
		border-radius: 19px;
		width: 400px;
		height: 76px;
		background: $orangeColor;

		@media (max-width:$tablet) {
			width: toRem(300);
			height: toRem(60);
		}

		@media (max-width:$mobileSmall) {
			width: 100%;
		}

		@media (any-hover: hover) {
			&:hover {
				border: 1px solid $orangeColor;
			}
		}
	}
}

.about-title {}

.button {}
</style>
