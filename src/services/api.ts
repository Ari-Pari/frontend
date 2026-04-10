export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'https://aripari.am/api/v1'

const supportedLocales = ['en', 'ru', 'hy'] as const
export type SupportedLocale = typeof supportedLocales[number]
const browserLang: string =
	localStorage.getItem('userLanguage')
	|| navigator.language
	|| 'hy'
const normalizedLang = browserLang.split('-')[0]
export const userMainLanguage: SupportedLocale =
	(supportedLocales as readonly string[]).includes(normalizedLang)
		? (normalizedLang as SupportedLocale)
		: 'hy'

export interface IDancesParams {
	searchText: string;
	genres: string[];
	regions: string[];
	complexities: number[];
	genders: string[];
	paces: number[];
	handshakes: string[];
	sortedBy: "createdBy" | "popularity" | "alphabet";
	sortType: "ASC" | "DESC";
}
export const defaultDancesParams: IDancesParams = {
	searchText: "",
	genres: [],
	regions: [],
	complexities: [],
	genders: [],
	paces: [],
	handshakes: [],
	sortedBy: "createdBy",
	sortType: "ASC"
}

type ApiRequestOptions = RequestInit & {
	signal?: AbortSignal;
}

export async function apiRequest(endpoint: string, options: ApiRequestOptions = {}) {
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
		throw new Error(`${response.status}`)
	}
	return response.json()
}

type SearchDanceParams = {
	lang?: SupportedLocale;
	page?: number;
	size?: number;
	body?: Record<string, unknown>
}
export const DanceService = {
	getDance: (id: string | number, lang: SupportedLocale = userMainLanguage, signal?: AbortSignal) => apiRequest(`/dances/${id}?lang=${lang}`, { signal }),
	getRegions: (lang: SupportedLocale = userMainLanguage, signal?: AbortSignal) => apiRequest(`/regions?lang=${lang}`, { signal }),
	searchDances: (params: SearchDanceParams = {}, signal?: AbortSignal) => apiRequest(`/dances/search?lang=${params.lang}&page=${params.page}&size=${params.size}`, {
		method: 'POST',
		body: JSON.stringify(params.body || {}),
		signal
	}),
}
