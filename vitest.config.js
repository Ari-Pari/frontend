import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			environment: 'jsdom',
			// Исключаем e2e папку из юнит-тестов
			exclude: [...configDefaults.exclude, '**/e2e/**', '**/__tests__/e2e/**'],
			root: fileURLToPath(new URL('./', import.meta.url)),
			globals: true,
			// Убедитесь, что путь совпадает с тем, где вы создали файл (src/tests или src/__tests__)
			setupFiles: ['./src/__tests__/setup.js'],
		}
	})
)