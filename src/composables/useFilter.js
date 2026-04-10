import { computed } from "vue"

export const FILTER_KEYS = ['genres', 'regions', 'complexities', 'genders', 'paces', 'handshakes'];

export function useFilter(params) {
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
