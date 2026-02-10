<script setup>
import { ref, watch, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import { searchDances } from "@/services/fetch"

const { t, locale } = useI18n()

const dances = ref(null)
onMounted(async () => {
	const responce = await searchDances({
		body: {
			title: 'foo',
			body: 'bar',
			userId: 1,
		}
	})
	dances.value = responce.data
	// const dances = await searchDances({
	// 	body: {
	// 		searchText: "string",
	// 		genres: [0],
	// 		regions: [0],
	// 		complexities: [5],
	// 		genders: ["male"],
	// 		paces: [3],
	// 		handshakes: ["FREE"],
	// 		sortedBy: "createdBy",
	// 		sortType: "ASC"
	// 	}
	// })
})
console.log(dances);
watch(locale, () => {
	// fetch data
})
</script>

<template>
	<section class="first-screen">
		<div class="first-screen__container">
			This is {{ t('homePageMenuItem') }} page
		</div>
	</section>
	<div class="dances">
		<div class="dances__container">
			<div v-for="dance in dances" class="dance-item">
				<RouterLink :to="`/dance/${dance.id}`"> Go to Dance {{ dance.title }}</RouterLink>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
