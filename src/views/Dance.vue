<script setup>
import { ref, watch, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import { DanceService } from "@/services/api"
import { useApi } from "@/composables/useApi"

const props = defineProps({ id: String })

const { t, locale } = useI18n()

const { data: dance, loading, error, execute: fetchDance } = useApi(DanceService.getDance)

// Fetch data on loading
onMounted(() => {
	fetchDance(props.id, locale.value)
})
// Fetch data on langyage change
watch(locale, (newLocale) => {
	fetchDance(props.id, newLocale)
})
// Fetch data on if dance changed
watch(() => props.id, (id) => {
	fetchDance(id, locale.value)
})
</script>

<template>
	<section class="dance">
		<div class="dance__container">
			<div v-if="loading || error" class="skeleton">
				gello
			</div>
			<div v-else>
				This is {{ dance?.name }}, number: {{ dance }}
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>


.skeleton {
	border: none;
	background: transparent;

	&-anim {
		background: #eee;
		animation: skeleton-loading 1.5s infinite linear;
		border-radius: 14px;
	}

	&__image {
		width: 100%;
		height: 225px;
		margin-bottom: toRem(14);

		@media (max-width:$mobile) {
			height: toRem(150);
		}

		@media (max-width:$mobileSmall) {
			height: toRem(100);
		}
	}

	&__title {
		width: 80%;
		height: 30px;
		margin-bottom: toRem(10);

		@media (max-width:$mobileSmall) {
			height: 20px;
		}
	}

	&__descr {
		width: 60%;
		height: 30px;

		@media (max-width:$mobileSmall) {
			height: 20px;
		}
	}
}

@keyframes skeleton-loading {
	0% {
		background-color: #eee;
	}

	50% {
		background-color: #ddd;
	}

	100% {
		background-color: #eee;
	}
}
</style>
