<script setup>
import { searchDances } from "@/composables/fetch"
import { ref, watch, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"

const { locale } = useI18n()
watch(locale, () => {
	// fetch data
})

const dances = ref([])
const isLoading = ref(true)
const error = ref(null)

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
</script>

<template>
	<section class="first-screen">
		<div class="first-screen__container">
			This is home page
		</div>
	</section>
	<div class="dances">
		<div class="dances__container">
			<div v-for="dance in dances" class="dance-item">
				<RouterLink :to="`/dances/${dance.id}`"> Go to Dance {{ dance.name }}</RouterLink>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
