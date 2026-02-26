import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import postcssSortMediaQueries from 'postcss-sort-media-queries'
import autoprefixer from 'autoprefixer';
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
	plugins: [
		vue(),
		vueDevTools(),
		ViteImageOptimizer({
			png: {
				quality: 70,
			},
			jpeg: {
				quality: 70,
			},
			jpg: {
				quality: 70,
			},
		}),
		basicSsl()
	],
	server: {
		https: false,
		host: true
	},
	css: {
		postcss: {
			plugins: [
				postcssSortMediaQueries(),
				autoprefixer(),
			],
		},
		preprocessorOptions: {
			scss: {
				additionalData: `
				@use "sass:math";
				@use "@/styles/_variables.scss" as *;`
			}
		}
	},
	base: "/aripari/",
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		},
	},
})
