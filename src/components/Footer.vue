<script setup>
import { useI18n } from "vue-i18n"

const { t } = useI18n()
</script>

<template>
	<footer class="footer">
		<div class="footer__container">
			<RouterLink to="/" class="footer__logo"><img src="@/assets/AriPari_Logo-footer.png" alt="AriPari logo">
			</RouterLink>
			<div class="footer__body">
				<div class="footer__column">
					<div class="footer__column-title">{{ t('footerContacts') }}</div>
					<ul class="footer__items">
						<li class="footer__item">
							<a class="footer__link" target="_blank" href="https://t.me/ariparenq">
								<img src="@/assets/icons/telegram.svg" alt="Telegram logo"> @ariparenq
							</a>
						</li>
						<li class="footer__item">
							<a class="footer__link" target="_blank" href="https://www.instagram.com/aripari.am">
								<img src="@/assets/icons/instagram.svg" alt="Instagram logo">
								@aripari.am</a>
						</li>
						<li class="footer__item">
							<a class="footer__link" target="_blank" href="https://vcard.am/u328">
								<img src="@/assets/icons/vcard.png" alt="Vcard logo">
								{{ t('aboutText21') }}
							</a>
						</li>
					</ul>
				</div>
				<div class="footer__column">
					<div class="footer__column-title">{{ t('footerLinks') }}</div>
					<ul class="footer__items">
						<li class="footer__item footer__item--flex">
							<a target="_blank" class="footer__link"
								href="https://github.com/Ari-Pari">https://github.com/Ari-Pari</a>
							<span class="footer__link-developer">developed by
								<a href="https://www.instagram.com/armenian.club/">Armenian Club</a></span>
						</li>
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
	color: #fff;

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
		color: #fff;
		padding-bottom: toRem(5);
		border-bottom: 1px solid #fff;
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

	&__link-developer {
		color: #999;
		font-size: toRem(14);

		a {
			text-decoration: underline;
			@media (any-hover: hover){
				&:hover{
					text-decoration: none;
				}
			}
		}
	}

	&__link {
		font-size: toRem(18);
		color: #fff;
		transition: all 0.3s;
		display: flex;
		align-items: center;

		@media (max-width:$mobile) {
			font-size: toRem(16);
		}

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
	}

	&__item {
		&:not(:last-child) {
			margin-bottom: toRem(10);
		}

		&--flex {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: toRem(5);
		}
	}
}
</style>
