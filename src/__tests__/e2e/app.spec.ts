import { test, expect } from '@playwright/test'

const dances = [
	{
		id: 1,
		name: 'Kochari',
		photo_link: '/test-kochari.jpg',
		regions: [{ id: 1, name: 'Lori' }],
		genres: ['WAR'],
		complexity: [2],
		paces: [2],
		gender: ['MULTY'],
		handshakes: ['FREE'],
	},
	{
		id: 2,
		name: 'Shalakho',
		photo_link: '/test-shalakho.jpg',
		regions: [{ id: 2, name: 'Shirak' }],
		genres: ['FESTIVE'],
		complexity: [1],
		paces: [3],
		gender: ['MULTY'],
		handshakes: ['PALM'],
	},
]

const danceDetails = {
	id: 1,
	name: 'Kochari',
	photo_link: '/test-kochari.jpg',
	regions: [{ id: 1, name: 'Lori' }],
	genres: ['WAR'],
	complexity: [2],
	paces: [2],
	gender: ['MULTY'],
	handshakes: ['FREE'],
	songs: [
		{
			id: 11,
			name: 'Kochari Song',
			link: 'https://cdn.example/kochari.mp3',
			ensembles: [{ id: 1, name: 'Ari Pari Ensemble', link: 'https://example.com/ensemble' }],
		},
	],
	sourceVideos: [{ id: 21, name: 'Source video', link: 'https://youtu.be/abc123' }],
	performanceVideos: [],
	lessonVideos: [],
}

test.beforeEach(async ({ page }) => {
	await page.route('**/api/v1/regions?lang=*', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify([
				{ id: 1, name: 'Lori' },
				{ id: 2, name: 'Shirak' },
			]),
		})
	})

	await page.route('**/api/v1/dances/search?*', async (route) => {
		const body = route.request().postDataJSON() as { searchText?: string } | null
		const searchText = body?.searchText?.trim().toLowerCase() || ''
		const filtered = searchText
			? dances.filter((dance) => dance.name.toLowerCase().includes(searchText))
			: dances

		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(filtered),
		})
	})

	await page.route('**/api/v1/dances/1?lang=*', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(danceDetails),
		})
	})
})

test('home page renders dances list from API', async ({ page }) => {
	await page.goto('/en')

	await expect(page.locator('.first-screen')).toBeVisible()
	await expect(page.locator('.dance-item')).toHaveCount(2)
	await expect(page.locator('.dance-item__title')).toContainText(['Kochari', 'Shalakho'])
})

test('search filters dances on the home page', async ({ page }) => {
	await page.goto('/en')

	await page.locator('input[name="search-input"]').fill('kochari')
	await page.waitForTimeout(1100)

	await expect(page.locator('.dance-item')).toHaveCount(1)
	await expect(page.locator('.dance-item__title')).toHaveText('Kochari')
})

test('dance page opens from card and region button returns to home with saved filter', async ({ page }) => {
	await page.goto('/en')

	await page.getByRole('link', { name: 'Kochari' }).click()
	await expect(page).toHaveURL(/\/en\/dances\/1$/)
	await expect(page.locator('.dance-top__title')).toHaveText('Kochari')
	await expect(page.locator('.dance-audio__title')).toHaveText('Kochari Song')

	await page.locator('.dance-top__category').click()

	await expect(page).toHaveURL(/\/en#dances$/)
	const savedFilter = await page.evaluate(() => window.sessionStorage.getItem('dancesFilter'))
	expect(savedFilter).not.toBeNull()
	expect(JSON.parse(savedFilter as string)).toMatchObject({ regions: [1] })
})
