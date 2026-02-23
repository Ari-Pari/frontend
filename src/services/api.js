export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const supportedLocales = ['en', 'ru', 'hy']
const browserLang =
	localStorage.getItem('userLanguage')
	|| navigator.language
	|| 'hy'
const normalizedLang = browserLang.split('-')[0]
export const userMainLanguage =
	supportedLocales.includes(normalizedLang)
		? normalizedLang
		: 'hy'
export const defaultDancesParams = {
	searchText: "",
	genres: [], // String array
	regions: [], // String array
	complexities: [], // Number array
	genders: [], // String array
	paces: [], // Number array ([1, 2, 3])
	handshakes: [], // String array
	sortedBy: "createdBy", // Other values: "popularity", "alphabet"
	sortType: "ASC" // Other value: DESC
}

export async function apiRequest(endpoint, options = {}) {
	const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
	const { signal, ...restOptions } = options

	const defaultOptions = {
		signal,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		...restOptions
	}
	const response = await fetch(url, defaultOptions)

	if (!response.ok) {
		// const errorData = await response.json().catch(() => ({}))
		// throw new Error(`API error: ${response.status}`)
	}

	return response.json()
}

export const DanceService = {
	getDance: (id, lang = userMainLanguage, signal) => apiRequest(`/dances/${id}?lang=${lang}`, { signal }),
	getRegions: (lang = userMainLanguage, signal) => apiRequest(`/regions/?lang=${lang}`, { signal }),
	searchDances: (params = {}, signal) => apiRequest(`/dances/search?lang=${params.lang}&page=${params.page}&size=${params.size}`, {
		method: 'POST',
		body: JSON.stringify(params.body || {}),
		signal
	}),
}
