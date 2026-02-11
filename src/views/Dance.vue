<script setup>
import { ref, watch, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import { DanceService } from "@/services/api"
import { useApi } from "@/composables/useApi"

const props = defineProps({ id: String })

const { t, locale } = useI18n()

const { data: dance, loading, error, execute: fetchDance } = useApi(DanceService.getDance)

onMounted(() => {
	fetchDance(props.id, locale.value)
})
watch(locale, (newLocale) => {
	fetchDance(props.id, newLocale)
})
watch(() => props.id, (id) => {
	fetchDance(id, locale.value)
})
</script>

<template>
	<section class="dance">
		<div class="dance__container">
			<div v-if="dance">
				This is {{ dance.name }}, number: {{ dance.id }}
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped></style>
