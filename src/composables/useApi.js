import { ref } from 'vue'

export function useApi(apiCall) {
	const data = ref(null)
	const error = ref(null)
	const loading = ref(false)

	const execute = async (...args) => {
		loading.value = true
		error.value = null
		try {
			data.value = await apiCall(...args)
			return data.value
		} catch (e) {
			error.value = e.message
			console.error("API Error:", e)
		} finally {
			loading.value = false
		}
	}

	return {data, error, loading, execute}
}