export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const userMainLanguage = localStorage.getItem('userLanguage')
	|| (navigator.languages && navigator.languages[0])
	|| navigator.language || 'hy';

// If we need to cancel request
// const controller = new AbortController()
// controller.abort()

export async function apiRequest(endpoint, options = {}) {
	const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

	const defaultOptions = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		...options
	}
	const response = await fetch(url, defaultOptions)

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}))
		throw new Error(`API error: ${response.status}`)
	}

	return response.json()
}

export const DanceService = {
	getDance: (id, lang = userMainLanguage) => apiRequest(`/dances/${id}?lang=${lang}`),
	getRegions: (lang = userMainLanguage) => apiRequest(`/regions/?lang=${lang}`),
	searchDances: (params = {}) => apiRequest(`/dances/search?lang=${params.lang}&page=${params.page}&size=${params.size}`, {
		method: 'POST',
		body: JSON.stringify(params.body || {})
	}),
}
