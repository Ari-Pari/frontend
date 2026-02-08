import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import postcssSortMediaQueries from 'postcss-sort-media-queries'
import autoprefixer from 'autoprefixer';

export default defineConfig({
	plugins: [
		vue(),
		vueDevTools(),
		ViteImageOptimizer({
			svg: {
				plugins: [
					'removeDoctype',
					'removeXMLProcInst',
					'minifyStyles',
					'sortAttrs',
					'sortDefsChildren',
				],
			},
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
	],
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
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		},
	},
})
