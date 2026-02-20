<script setup>
import { useI18n } from "vue-i18n"

const { t } = useI18n()
</script>

<template>
	<footer class="footer">
		<div class="footer__container">
			<div class="footer__logo"><img src="@/assets/AriPari_Logo-footer.png" alt="AriPari logo"></div>
			<div class="footer__body">
				<div class="footer__column">
					<div class="footer__column-title">{{ t('footerContacts') }}</div>
					<ul class="footer__links">
						<li class="footer__link"><img src="@/assets/icons/telegram.svg" alt="Telegram logo"><a
								href="https://t.me/ariparenq">@ariparenq</a></li>
						<li class="footer__link"><img src="@/assets/icons/instagram.svg" alt="Instagram logo"><a
								href="https://www.instagram.com/aripari.am">@aripari.am</a></li>
						<li class="footer__link"><img src="@/assets/icons/vcard.png" alt="Vcard logo"><a
								href="https://vcard.am/u328">{{ t('aboutText21') }}</a></li>
					</ul>
				</div>
				<div class="footer__column">
					<div class="footer__column-title">{{ t('footerLinks') }}</div>
					<ul class="footer__links">
						<li class="footer__link"><a href="https://github.com/Ari-Pari">https://github.com/Ari-Pari</a></li>
					</ul>
				</div>
			</div>
		</div>
	</footer>
</template>

<style lang="scss" scoped>
.footer {
	padding: toRem(30) 0 toRem(80);
	background-color: #17181A;
	color: #ffffd5;

	&__container {}

	&__logo {
		img {
			width: toRem(220);

			@media (max-width:$mobile) {
				width: toRem(150);
			}

			@media (max-width:$mobileSmall) {
				width: toRem(100);
			}
		}

		margin-bottom: toRem(36);

		@media (max-width:$mobile) {
			margin-bottom: toRem(26);
		}
	}

	&__body {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: toRem(20);

		@media (max-width:$mobileSmall) {
			grid-template-columns: 1fr;
			gap: toRem(30);
		}
	}

	&__column {}

	&__column-title {
		font-size: toRem(32);
		color: #ffffd5;
		padding-bottom: toRem(5);
		border-bottom: 1px solid #ffffd5;
		margin-bottom: toRem(18);
		line-height: 1.2;

		@media (max-width:$mobile) {
			font-size: toRem(26);
		}

		@media (max-width:$mobileSmall) {
			margin-bottom: toRem(10);
			font-size: toRem(20);
		}
	}

	&__links {}

	&__link {
		&:not(:last-child) {
			margin-bottom: toRem(10);
		}

		display: flex;
		align-items: center;
		transition: all 0.3s;

		@media (any-hover: hover) {
			&:hover {
				opacity: 0.8;
			}
		}

		img {
			margin-right: toRem(7);
			max-width: toRem(32);

			@media (max-width:$mobileSmall) {
				max-width: toRem(25);
			}
		}

		a {
			font-size: toRem(18);
			color: #ffffd5;

			@media (max-width:$mobile) {
				font-size: toRem(16);
			}
		}
	}
}
</style>
