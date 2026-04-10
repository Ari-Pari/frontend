import { ref, type Ref } from 'vue'

export function useApi<T, Args extends any[]>(apiCall: (...args: [...Args, AbortSignal]) => Promise<T>) {
	const data = ref<T | null>(null) as Ref<T | null>
	const error = ref<Error | unknown | null>(null)
	const loading = ref<boolean>(false)
	let controller: AbortController | null = null

	const execute = async (...args: Args): Promise<T | undefined> => {
		if (controller) controller.abort()
		controller = new AbortController()

		loading.value = true
		error.value = null
		try {
			data.value = await apiCall(...([...args, controller.signal] as [...Args, AbortSignal]))
			return data.value
		} catch (e: any) {
			if (e.name === 'AbortError') return
			error.value = e
			console.error(e)
			throw e
		} finally {
			loading.value = false
			controller = null
		}
	}

	return { data, error, loading, execute }
}