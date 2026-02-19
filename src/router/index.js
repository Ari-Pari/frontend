import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
const About = () => import('../views/About.vue')
const Dance = () => import('../views/Dance.vue')

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: '/', name: "home", component: Home },
		{ path: '/about', name: "about", component: About },
		{ path: '/dances/:id', name: 'dance', component: Dance, props: true, meta: { playerStyle: "dance-page-audio-player" } },
		{ path: '/:pathMatch(.*)*', redirect: { name: 'home' } }
	],
	scrollBehavior(to) {
		if (to.hash) {
			return { el: to.hash, behavior: 'smooth' }
		} else {
			return { top: 0, behavior: 'smooth' }
		}
	}
})

export default router
