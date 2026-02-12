<script setup>
import { ref, watch, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import { DanceService } from "@/services/api"
import { useApi } from "@/composables/useApi"

const { t, locale } = useI18n()

const searchDancesBodyParams = ref({
	searchText: "",
	genres: [0],
	regions: [0],
	complexities: [],
	genders: [],
	paces: [],
	handshakes: [],
	sortedBy: "createdBy",
	sortType: "ASC"
})
const { data: dances, loading, error, execute: fetchDances } = useApi(DanceService.searchDances)

onMounted(() => {
	fetchDances({
		lang: locale.value,
		page: 1,
		size: 10,
		body: searchDancesBodyParams.value
	})

	console.log(dances);
})
watch(locale, (newLocale) => {
	fetchDances({
		lang: newLocale,
		page: 1,
		size: 10,
		body: searchDancesBodyParams.value
	})
})

// For filtering and sorting
// watch(searchDancesBodyParams, () => {
// 	fetchDances({
// 		lang: newLocale,
// 		page: 1,
// 		size: 10,
// 		body: searchDancesParams.value
// 	})
// })
</script>

<template>
	<div id="dancesBlock" class="dances">
		<div class="dances__container">
			<div class="dances__actions">
				Здесь будет фильтр и поиск
			</div>
			<div class="dances__body">
				<div v-if="loading || !dances" v-for="n in 12" class="dance-item skeleton">
					<div class="skeleton__image skeleton-anim"></div>
					<div class="skeleton__title skeleton-anim"></div>
					<div class="skeleton__descr skeleton-anim"></div>
				</div>
				<div v-else v-for="dance in dances" class="dance-item">
					<RouterLink :to="`/dance/${dance.id}`"> Go to Dance {{ dance.name }}

					</RouterLink>
				</div>
			</div>
		</div>
	</div>


	<!-- <select v-bind:aria-label="t('selectAriaLabel')" class="menu__language" v-model="locale">
		<option>hy</option>
		<option>en</option>
		<option>ru</option>
	</select> -->

</template>

<style lang="scss" scoped>
.dances {
	padding-top: toRem(53);

	&__actions {
		margin-bottom: toRem(53);
	}

	&__body {
		max-height: toRem(1291);
		overflow-y: auto;
		padding-bottom: toRem(53);
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: toRem(40) toRem(30);
	}
}

.skeleton {
	&__image {
		width: 100%;
		height: 225px;
		margin-bottom: toRem(14);
	}

	&__title {
		width: 80%;
		height: 30px;
		margin-bottom: toRem(10);
	}

	&__descr {
		width: 60%;
		height: 30px;
	}
}

.skeleton-anim {
	background: #eee;
	animation: skeleton-loading 1.5s infinite linear;
	border-radius: 14px;
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
