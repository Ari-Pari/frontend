<script setup>
import { ref, watch, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import { getDance } from "@/services/api"

const props = defineProps({ id: String })

const { t, locale } = useI18n()

const dance = ref(null)
onMounted(async () => {
	// const dance = await getDance(props.id, lang = 'hy')
	const response = await getDance(props.id)
	dance.value = response.data
})

watch(locale, () => {
	// fetch data
})
</script>

<template>
	<section class="dance">
		<div class="dance__container">

			<div v-if="dance">
				This is {{ dance.title }}, number: {{ props.id }}
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped></style>
