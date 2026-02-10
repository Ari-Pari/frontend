import { ref, onMounted } from "vue"

const API_BASE_URL = 'http://localhost:8080/api/v1' // https://jsonplaceholder.typicode.com/posts

export async function useFetch(url, params = null) {
	let data = null
	let error = null
	let loading = false

	try {
		loading = true
		error = null

		const response = await fetch(url, params)
		if (!response.ok) {
			throw new Error(`API error: ${response.status}`)
		}

		data = await response.json()
	} catch (e) {
		console.error("Loading error:", e)
		error = e.message
		throw e
	} finally {
		loading = false
	}

	return { data, error, loading }
}

export async function getDance(id, lang = 'hy') {
	return useFetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
		method: "GET",
		headers: {
			"Accept": 'application/json',
			"Content-type": 'application/json',
		}
	})
}
export async function searchDances({ lang = 'hy', page = 1, size = 10, body = {} } = {}) {
	return useFetch(`https://jsonplaceholder.typicode.com/posts`)
}


// export async function getDance(id, lang = 'hy') {
// 	return useFetch(`${API_BASE_URL}/dances/${id}?lang=${lang}`, {
// 		method: "GET",
// 		headers: {
// 			"Accept": 'application/json',
// 			"Content-type": 'application/json',
// 		}
// 	})
// }
// export async function getGenres(lang = 'hy') {
// 	return useFetch(`${API_BASE_URL}/genres/?lang=${lang}`, {
// 		method: "GET",
// 		headers: {
// 			"Accept": 'application/json',
// 			"Content-type": 'application/json',
// 		}
// 	})
// }
// export async function getRegions(lang = 'hy') {
// 	return useFetch(`${API_BASE_URL}/regions/?lang=${lang}`, {
// 		method: "GET",
// 		headers: {
// 			"Accept": 'application/json',
// 			"Content-type": 'application/json',
// 		}
// 	})
// }
// export async function searchDances({ lang = 'hy', page = 1, size = 10, body = {} } = {}) {
// 	return useFetch(`${API_BASE_URL}/search?lang=${lang}&page=${page}&size=${size}`, {
// 		method: "POST",
// 		headers: {
// 			"Accept": 'application/json',
// 			"Content-type": 'application/json',
// 		},
// 		body: JSON.stringify(body)
// 	})
// }

// If we need to cancel request
// const controller = new AbortController()
// controller.abort()

// local dances store
/*export const dances = reactive([
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
])*/