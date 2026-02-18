import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './src/__tests__/e2e',
	fullyParallel: true,
	use: {
		baseURL: 'http://localhost:5173', // Адрес, где запущен твой Vite dev server
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	webServer: {
		command: 'npm run dev', // Команда запуска сервера
		url: 'http://localhost:5173',
		reuseExistingServer: !process.env.CI,
	},
});