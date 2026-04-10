<script setup>
import { useI18n } from "vue-i18n"
import { translateDancesParametres } from "@/services/utils";

const { t } = useI18n()
defineProps({
	dance: {
		type: Object,
		required: true
	}
})
</script>

<template>
	<div class="dance-item">
		<RouterLink v-if="dance.photo_link" :to="`/dances/${dance.id}`" class="dance-item__image">
			<img :src="dance.photo_link" alt="" @error="e => e.target.parentElement.style.display = 'none'">
		</RouterLink>
		<div class="dance-item__texts">
			<RouterLink :to="`/dances/${dance.id}`">
				<h3 class="dance-item__title">{{ dance?.name }}</h3>
			</RouterLink>
			<div class="dance-item__tags">
				<span v-for="region in dance.regions" :key="region?.id" class="dance-item__tags-item">
					{{ region?.name}}
				</span>
			</div>
			<ul class="dance-item__categories">
				<li class="dance-item__categories-item">{{ t('genre') }}:
					<span>{{ translateDancesParametres(dance?.genres, { t, prefix: 'genres' }) }}</span>
				</li>
				<li class="dance-item__categories-item">{{ t('complexity') }}:
					<span>{{ translateDancesParametres(dance?.complexity, { t, prefix: 'complexity' }) }}</span>
				</li>
				<li class="dance-item__categories-item">{{ t('tempo') }}:
					<span>{{ translateDancesParametres(dance?.paces, { t, prefix: 'paces', delimiter: ' → ' }) }}</span>
				</li>
				<li class="dance-item__categories-item">{{ t('gender') }}:
					<span>{{ translateDancesParametres(dance?.gender, { t, prefix: 'gender' }) }}</span>
				</li>
				<li class="dance-item__categories-item">{{ t('handshakes') }}:
					<span>{{ translateDancesParametres(dance?.handshakes, { t, prefix: 'handshakes' }) }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.dance-item {
	display: flex;
	flex-direction: column;
	max-width: 100%;
	overflow: hidden;
	@media (max-width:toEm(570)) {
		border-radius: 6px;
	}

	&__image {
		width: 100%;
		overflow: hidden;
		border-radius: 14px;
		margin-bottom: toRem(10);
		background-color: #eee;

		@media (any-hover: hover) {
			&:hover {
				img {
					transform: scale(1.05);
				}
			}
		}

		img {
			aspect-ratio: 1.77;
			transition: all 0.3s;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		@media (max-width:toEm(570)) {
			border-radius: 6px;
		}
	}

	&__title {
		font-size: toRem(24);
		color: #1a1a1a;
		transition: all 0.3s;
		margin-bottom: toRem(9);
		line-height: 1.3;
		word-break: break-word;

		@media (max-width:toEm(570)) {
			font-size: toRem(16);
			margin-bottom: toRem(5);
		}

		@media (any-hover: hover) {
			&:hover {
				color: #c83f01;
			}
		}
	}

	&__tags {
		margin-bottom: toRem(14);
		display: flex;
		flex-wrap: wrap;
		gap: toRem(10);
		max-width: 100%;

		@media (max-width:toEm(570)) {
			gap: toRem(5);
			margin-bottom: toRem(5);
		}
	}

	&__tags-item {
		border: 1px solid #c83f01;
		border-radius: 54px;
		min-height: 31px;
		padding: toRem(5) toRem(17);
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: toRem(12);
		text-align: center;
		color: #c83f01;

		@media (max-width:toEm(570)) {
			min-height: toRem(16);
			font-size: toRem(10);
			padding: 0 toRem(9.5);
		}
	}

	&__categories {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: toRem(5) toRem(20);

		@media (max-width: toEm(390)) {
			grid-template-columns: 1fr;
		}
	}

	&__categories-item {
		font-size: toRem(16);
		color: #1b1919;
		font-weight: 700;
		line-height: 1.3;

		@media (max-width:toEm(570)) {
			font-size: toRem(10);
		}

		span {
			font-weight: 500;
		}
	}
}
</style>