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
			привет

			<div v-for="dance in dances" class="dance-item">
				<RouterLink :to="`/dance/${dance.id}`"> Go to Dance {{ dance.name }}</RouterLink>
			</div>
		</div>
	</div>


	<!-- <select v-bind:aria-label="t('selectAriaLabel')" class="menu__language" v-model="locale">
		<option>hy</option>
		<option>en</option>
		<option>ru</option>
	</select> -->

</template>

<style lang="scss" scoped></style>
