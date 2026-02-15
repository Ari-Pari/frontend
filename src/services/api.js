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


// local dances store
/*export const localDancesStore = [
	{
		"id": 1,
		"name": "Кочари (Сасун)",
		"complexity": 3,
		"photo_link": "https://example.com/images/kochari.jpg",
		"gender": "male",
		"paces": [2, 3],
		"regions": [
			{
				"id": 1,
				"name": "Сасун"
			}
		],
		"genres": [
			{
				"id": 10,
				"name": "Военный"
			},
			{
				"id": 11,
				"name": "Эпический"
			}
		],
		"handshakes": ["SHOULDER"],
		"songs": [
			{
				"id": 101,
				"name": "Кочари - Традиционная",
				"link": "https://music.example.com/kochari",
				"ensembles": [
					{
						"id": 5,
						"name": "Карин",
						"link": "https://karin.am"
					}
				]
			}
		],
		"sourceVideos": [],
		"lessonVideos": [
			{
				"id": 201,
				"name": "Урок Кочари - Базовый шаг",
				"link": "https://youtube.com/watch?v=example1"
			}
		],
		"performanceVideos": []
	},
	{
		"id": 2,
		"name": "Ярхушта",
		"complexity": 5,
		"photo_link": "https://example.com/images/yarkhushta.jpg",
		"gender": "male",
		"paces": [3],
		"regions": [
			{
				"id": 1,
				"name": "Сасун"
			}
		],
		"genres": [
			{
				"id": 10,
				"name": "Военный"
			}
		],
		"handshakes": ["FREE", "PALM"],
		"songs": [],
		"sourceVideos": [],
		"lessonVideos": [],
		"performanceVideos": [
			{
				"id": 305,
				"name": "Ярхушта на сцене",
				"link": "https://youtube.com/watch?v=example2"
			}
		]
	},
	{
		"id": 3,
		"name": "Вервери",
		"complexity": 2,
		"photo_link": "https://example.com/images/ververi.jpg",
		"gender": "multi",
		"paces": [1],
		"regions": [
			{
				"id": 2,
				"name": "Ван"
			}
		],
		"genres": [
			{
				"id": 12,
				"name": "Общинный"
			}
		],
		"handshakes": ["LITTLE_FINGER"],
		"songs": [
			{
				"id": 102,
				"name": "Вервери мелодия",
				"link": "https://music.example.com/ververi",
				"ensembles": []
			}
		],
		"sourceVideos": [],
		"lessonVideos": [],
		"performanceVideos": []
	},
]*/