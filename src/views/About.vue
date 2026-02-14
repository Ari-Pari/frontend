<script setup>
import { ref, watch, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"

const { t, locale } = useI18n()

</script>

<template>
	<div class="about">
		<div class="about__container">
			This is {{ t('aboutPageMenuItem') }} page
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
