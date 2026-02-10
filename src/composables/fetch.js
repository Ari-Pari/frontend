const API_BASE_URL = 'http://localhost:8080'
// https://jsonplaceholder.typicode.com/todos/1 или /posts

// import { ref } from 'vue'

// export function useFetch(url) {
//   const data = ref(null)
//   const error = ref(null)

//   fetch(url)
//     .then((res) => res.json())
//     .then((json) => (data.value = json))
//     .catch((err) => (error.value = err))

//   return { data, error }
// }

export async function getDance(id, lang = 'hy') {
	try {
		const result = await fetch(`http://localhost:8080/api/v1/dances/${id}?lang=${lang}`, {
			method: "GET",
			headers: {
				"Accept": 'application/json',
				"Content-type": 'application/json',
			}
		})

		if (!result.ok) {
			throw new Error(`API error: ${result.status}`)
		}

		return await result.json()
	} catch (error) {
		console.error('Dances loading error:', error)
		throw error
	}
}
export async function searchDances({ lang = 'ru', page = 1, size = 5, body = {} } = {}) {
	try {
		const result = await fetch(`http://localhost:8080/dances/search?lang=${lang}&page=${page}&size=${size}`, {
			method: "POST",
			headers: {
				"Accept": 'application/json',
				"Content-type": 'application/json',
			},
			body: JSON.stringify(body)
		})

		if (!result.ok) {
			throw new Error(`API error: ${result.status}`)
		}

		return await result.json()
	} catch (error) {
		console.error('Ошибка загрузки танцев:', error)
		throw error
	}
}

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