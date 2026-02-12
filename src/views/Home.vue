<script setup>
import { ref, useTemplateRef, watch, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import DancesForm from "@/components/DancesForm.vue"

const { t, locale } = useI18n()

const scrollToDance = () => {
	document.getElementById('dancesBlock')
		?.scrollIntoView({ behavior: 'smooth' })
}

</script>

<template>
	<section class="first-screen">
		<div class="first-screen__container">
			<div class="first-screen__logo">
				<img src="../assets/logo.svg" alt="logo">
			</div>
			<div class="first-screen__descr">{{ t('homeMainText') }}</div>
			<button type="button" @click='scrollToDance' class="first-screen__button button">{{ t('findDance') }}</button>
		</div>
	</section>
	<div class="quote-block">
		<div class="quote-block__container">
			<div class="quote-block__image">
				<img src="../assets/icons/sun.svg" alt="sun icon">
			</div>
			<div class="quote-block__text">{{ t('quoteBlockText') }}</div>
		</div>
	</div>
	<DancesForm />
</template>

<style lang="scss" scoped>
.first-screen {
	background: url('../assets/home/first-screen-bg.svg') center/cover no-repeat, #fff;

	&__container {
		padding-top: toRem(185);
		padding-bottom: toRem(185);
		max-width: toRem(650);
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	&__logo {
		margin-bottom: toRem(14);
	}

	&__descr {
		font-size: toRem(28);
		background: linear-gradient(180deg, #ffe35f 0%, #ff7d00 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-left: -50px;
		line-height: 1.5;
	}

	&__button {
		margin-top: toRem(140);
		width: toRem(420);
		height: toRem(80);
		border-radius: 20px;
		font-size: toRem(28);
	}

}


.quote-block {
	background: url('../assets/home/quote-block-bg.svg') center/cover no-repeat, #FE860A;
	padding: toRem(227) 0 toRem(305);

	&__container {
		max-width: toRem(740);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	&__image {
		margin-bottom: toRem(20);
		width: 107px;
		height: 106px;

		img {
			max-width: 100%;
			max-height: 100%;
		}
	}

	&__text {
		font-weight: 600;
		font-size: toRem(64);
		line-height: 105%;
		text-align: center;
		color: #fff;
	}
}
</style>
