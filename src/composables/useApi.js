import { ref } from 'vue'

export function useApi(apiCall) {
	const data = ref(null)
	const error = ref(null)
	const loading = ref(false)
	let controller = null

	const execute = async (...args) => {
		if (controller) controller.abort()
		controller = new AbortController()

		loading.value = true
		error.value = null
		try {
			data.value = await apiCall(...args, controller.signal)
			return data.value
		} catch (e) {
			if (e.name === 'AbortError') return
			error.value = e
			console.error("API Error:", e)
			//throw e
		} finally {
			loading.value = false
			controller = null
		}
	}

	return { data, error, loading, execute }
}