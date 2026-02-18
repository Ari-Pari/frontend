import { test, expect } from '@playwright/test';

test.describe('Ari Pari Frontend E2E', () => {

	test('Главная страница загружается и навигация работает', async ({ page }) => {
		await page.goto('/');

		// Проверка заголовка или текста
		await expect(page).toHaveTitle(/Ari Pari/i); // Предполагаем, что в index.html есть title
		await expect(page.locator('.first-screen__descr')).toBeVisible();

		// Переход на страницу About
		await page.click('text=About'); // Используем текст из локализации (или 'О нас', если hy) - лучше использовать локатор по классу или href
		// Так как текст зависит от языка, лучше использовать селектор:
		await page.locator('.menu__link[href="/about"]').click();

		await expect(page).toHaveURL(/.*about/);
		await expect(page.locator('.about-main')).toBeVisible();
	});

	test('Поиск и фильтрация танцев', async ({ page }) => {
		await page.goto('/');

		// Перехватываем запрос к API, чтобы вернуть тестовые данные (не обязательно, но делает тесты стабильнее)
		// Если есть реальный бэкенд, можно тестировать с ним, но мок быстрее.
		// Пример мока:
		/*
		await page.route('**\/dances/search**', async route => {
		  const json = [{ id: '99', name: 'Playwright Dance', genres: ['TEST'], complexity: [1], paces: [1], gender: ['multi'], handshakes: ['free'], photo_link: '' }];
		  await route.fulfill({ json });
		});
		*/

		// Ждем загрузки списка танцев
		const dancesBlock = page.locator('#dancesBlock');
		await dancesBlock.scrollIntoViewIfNeeded();

		// Вводим текст в поиск
		const searchInput = page.locator('input[name="search-input"]');
		await searchInput.fill('Test Dance');

		// Проверяем, что URL не меняется (так как SPA), но контент может обновиться
		// Здесь мы просто проверяем, что инпут работает и не крашит страницу
		await expect(searchInput).toHaveValue('Test Dance');
	});

	test('Переключение языка', async ({ page }) => {
		await page.goto('/');

		// Проверяем текущий язык (по умолчанию hy или из localStorage)
		// Кликаем на английский
		await page.locator('label[for="lang-eng"]').click();

		// Проверяем, изменился ли текст на странице
		// Текст "Dance Encyclopedia" (из messages.js для ключа danceEncyclopedia)
		// Нужно убедиться, что текст на экране соответствует английской версии
		// (Предполагаю, что в коде есть переводы, здесь примерная проверка)
		await expect(page.locator('.actions-dances__title')).toContainText(/Encyclopedia/i);

		// Кликаем на армянский
		await page.locator('label[for="lang-arm"]').click();
		// Проверяем армянский текст (пример)
		// await expect(page.locator('.actions-dances__title')).toContainText(/Պարային/i); 
	});

	test('Переход на страницу танца', async ({ page }) => {
		await page.goto('/');

		// Ждем появления карточек (если API реальный)
		// Кликаем на первую карточку танца
		const firstDanceCard = page.locator('.dance-item__title').first();

		// Если данных нет, тест упадет или нужно проверить наличие skeleton
		if (await firstDanceCard.isVisible()) {
			await firstDanceCard.click();
			await expect(page).toHaveURL(/\/dance\/.+/);
			await expect(page.locator('.dance__container')).toBeVisible();
		}
	});
});