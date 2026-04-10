import { computed, type Ref } from "vue"
import type { IDancesParams } from "@/services/api"

export const FILTER_KEYS = ['genres', 'regions', 'complexities', 'genders', 'paces', 'handshakes'] as const;

export function useFilter(params: Ref<IDancesParams>) {
	// Count function for filters number
	const filterCount = computed(() => {
		if (!params.value) return 0

		return FILTER_KEYS.reduce((acc, key) => {
			const value = params.value[key]
			return acc + (Array.isArray(value) ? value.length : 0)
		}, 0)
	})
	// Reset function for filters
	function resetFilters() {
		if (!params.value) return

		FILTER_KEYS.forEach(key => {
			if (Array.isArray(params.value[key])) {
				params.value[key] = [];
			}
		})
	}

	return {
		filterCount,
		resetFilters
	}
}
