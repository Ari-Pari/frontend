import { createRouter, createWebHistory, RouterView } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { supportedLocales, userMainLanguage } from '@/services/lang'

import Home from '@/views/Home.vue'
const About = () => import('@/views/About.vue')
const Dance = () => import('@/views/Dance.vue')

const routes: RouteRecordRaw[] = [
	{
		path: `/:locale(${supportedLocales.join('|')})`,
		component: RouterView,
		children: [
			{ path: '', name: "home", component: Home },
			{ path: 'about', name: "about", component: About },
			{
				path: 'dances/:id',
				name: 'dance',
				component: Dance,
				props: true,
				meta: { playerStyle: "dance-page-audio-player" }
			},
			{
				path: ':pathMatch(.*)*',
				redirect: to => ({ name: 'home', params: { locale: to.params.locale } })
			}
		]
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: _to => {
			return {
				name: 'home',
				params: { locale: userMainLanguage }
			}
		}
	}
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
	scrollBehavior(to) {
		if (to.hash) {
			return { el: to.hash, behavior: 'smooth' }
		} else {
			return { top: 0, behavior: 'smooth' }
		}
	}
})

export default router


