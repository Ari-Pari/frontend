<script setup>
import { useI18n } from "vue-i18n"
import { useClipboard } from "@/composables/useClipboard"

const { t } = useI18n()
const { copiedField, copyText } = useClipboard()
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
	<div class="about-info">
		<div class="about-info__container">
			<div class="about-founder">
				<div class="about-founder__body">
					<div class="about-founder__top">
						<div class="about-founder__image">
							<img src="@/assets/about/avatar-hamazasp.png" alt="Founder image">
						</div>
						<div class="about-founder__texts">
							<div class="about-founder__name">{{ t('aboutText21') }}</div>
							<div class="about-founder__status">{{ t('aboutText13') }}</div>
						</div>
					</div>
					<div class="about-founder__text">{{ t('aboutText14') }}</div>
				</div>
			</div>
			<section class="about-support">
				<h2 class="about-support__title about-title">{{ t('aboutText15') }}</h2>
				<div class="about-support__text" v-html="t('aboutText16')"></div>
			</section>
			<section id="supportBlock" class="about-support">
				<h2 class="about-support__title about-title">{{ t('aboutText17') }}</h2>
				<div class="about-support__descr">{{ t('aboutText18') }}</div>
				<div class="about-support__text">{{ t('aboutText19') }}</div>
				<div class="about-support__bankcard bankcard-support">
					<div class="bankcard-support__title">{{ t('bankCardSupportText') }}</div>
					<div class="bankcard-support__row">
						<span id="bankcard-name" class="bankcard-support__text">{{ t('bankCardName') }}</span>
						<button @click="copyText(t('bankCardName'), 'name')" class="bankcard-support__button">
							<img v-if="copiedField === 'name'" src="@/assets/icons/check.svg" alt="Check icon">
							<img v-else src="@/assets/icons/copy.svg" alt="Copy icon">
						</button>
					</div>
					<div class="bankcard-support__row">
						<span id="bankcard-number" class="bankcard-support__text">220253350650000</span>
						<button @click="copyText('220253350650000', 'number')" class="bankcard-support__button">
							<img v-if="copiedField === 'number'" src="@/assets/icons/check.svg" alt="Check icon">
							<img v-else src="@/assets/icons/copy.svg" alt="Copy icon">
						</button>
					</div>
				</div>
			</section>
		</div>
	</div>
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
	line-height: 1.2;

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
		flex: 1 1 auto;

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
		max-width: toRem(433);

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
	@media (max-width:$tablet) and (min-width: $mobile) {
		background: url('@/assets/about/decor-1.svg') right top / cover no-repeat, #fff;
	}

	@media (min-width:$mobile) {
		background: url('@/assets/about/decor-1.svg') center/cover no-repeat, #fff;
	}

	// @media (max-width:$mobileSmall) {
	// 	background: url('@/assets/about/decor-1.svg') center/cover no-repeat, #fff;
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
		border: 1px solid $orangeColor;
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
		white-space: pre-line;

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

.about-info {
	@media (min-width:$mobile) {
		background: url('@/assets/about/decor-2.svg') center/cover no-repeat, #fff;
	}

	&__container {}
}

.about-founder {
	padding: toRem(153) 0 toRem(78);

	@media (max-width:$mobile) {
		padding: toRem(100) 0 toRem(60);
	}

	&__body {
		border-radius: 20px;
		background-color: #fff;
		border: 1px solid $orangeColor;
		max-width: toRem(903);
		margin: 0 auto;
		padding: 0 toRem(35) toRem(53);

		@media (max-width:$mobileSmall) {
			padding: 0 toRem(16) toRem(30);
		}
	}

	&__top {
		margin-bottom: toRem(30);
		display: flex;
		align-items: flex-end;
		margin-top: toRem(-75);

		@media (max-width:$mobile) {
			margin-top: toRem(-40);
		}
	}

	&__image {
		margin-right: toRem(18);

		img {
			width: toRem(136);
			height: toRem(136);

			@media (max-width:$mobile) {
				width: toRem(80);
				height: toRem(80);
			}
		}
	}

	&__texts {
		padding-bottom: toRem(20);

		@media (max-width:$mobile) {
			padding: 0;
		}
	}

	&__name {
		font-size: toRem(20);
		line-height: 114%;
		letter-spacing: -0.02em;
		color: #1a1a1a;
		line-height: 1.3;

		@media (max-width:$mobile) {
			font-size: toRem(18);
		}

		@media (max-width: toEm(350)) {
			font-size: toRem(15);
		}
	}

	&__status {
		font-size: toRem(11);
		color: rgba(0, 0, 0, 0.5);
	}

	&__text {
		font-size: toRem(20);
		line-height: 114%;
		letter-spacing: -0.02em;
		color: #1a1a1a;
		line-height: 1.3;

		@media (max-width:$mobile) {
			font-size: toRem(18);
		}

		@media (max-width:$mobileSmall) {
			font-size: toRem(16);
		}
	}
}

.about-support {
	padding-bottom: toRem(80);

	@media (max-width:$mobile) {
		padding-bottom: toRem(60);
	}

	&__title {}

	&__text {
		color: #000;
		max-width: toRem(445);
		font-size: toRem(19);
		line-height: 1.3;
		white-space: pre-line;

		@media (max-width:$mobile) {
			font-size: toRem(18);
		}

		@media (max-width:$mobileSmall) {
			font-size: toRem(16);
		}

		:deep(a) {
			color: $orangeColor;
			transition: all 0.3s;

			@media (any-hover: hover) {
				&:hover {
					color: $orangeHoverColor;
				}
			}
		}
	}

	&__descr {
		max-width: toRem(445);
		font-size: toRem(26);
		color: #000;
		line-height: 1.3;
		margin-bottom: toRem(37);
		white-space: pre-line;

		@media (max-width:$mobile) {
			font-size: toRem(22);
			margin-bottom: toRem(20);
		}

		@media (max-width:$mobileSmall) {
			font-size: toRem(20);
		}
	}
}


.bankcard-support {
	background: #fff;
	border-radius: 20px;
	border: 2px dashed $orangeColor;
	padding: toRem(32) toRem(40) toRem(16);
	margin-top: toRem(32);
	max-width: toRem(622);

	@media (max-width:$mobile) {
		padding: toRem(32) toRem(16);
	}

	@media (max-width:$mobileSmall) {
		padding: toRem(16);
	}

	&__title {
		line-height: 1.3;
		margin-bottom: toRem(30);
		font-size: toRem(26);
		color: #000;
		text-align: center;

		@media (max-width:$mobile) {
			font-size: toRem(22);
			margin-bottom: toRem(20);
		}

		@media (max-width:$mobileSmall) {
			font-size: toRem(20);
		}

		@media (max-width: toEm(371)) {
			max-width: toRem(235);
			margin: 0 auto toRem(20);
		}
	}

	&__row {
		background: #fff;
		border-radius: 20px;
		border: 1.5px solid $orangeColor;
		padding: toRem(14) toRem(22);
		display: flex;
		align-items: center;
		justify-content: space-between;

		&:not(:last-child) {
			margin-bottom: toRem(12);
		}

		@media (max-width:$mobile) {
			padding: toRem(12) toRem(18);
		}

		@media (max-width:$mobileSmall) {
			padding: toRem(10);
		}

	}

	&__text {
		font-weight: 400;
		font-size: toRem(26);
		color: #000;

		@media (max-width:$mobile) {
			font-size: toRem(22);
		}

		@media (max-width:$mobileSmall) {
			font-size: toRem(18);
		}
	}

	&__button {
		img {
			width: toRem(41.5);
			height: toRem(41.5);

			@media (max-width:$mobileSmall) {
				width: toRem(26);
				height: toRem(26);
			}
		}

		transition: all 0.3s;

		@media (any-hover: hover) {
			&:hover {
				opacity: 0.8;
			}
		}
	}
}
</style>
