<script setup>
import { getDance } from "@/composables/fetch"
import { ref, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"

const { locale } = useI18n()
watch(locale, () => {
	// fetch data
})

const props = defineProps({ id: String })

// const dance = await getDance(props.id, lang = 'hy')
</script>

<template>
	<section class="dance">
		<div class="dance__container">
			<div v-if="dance">
				This is {{ dance.name }}, number: {{ props.id }}
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped></style>
