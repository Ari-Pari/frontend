import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
const About = () => import('../views/About.vue')
const Dance = () => import('../views/Dance.vue')

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: '/', component: Home },
		{ path: '/about', component: About },
		{ path: '/dance/:id', name: 'dance', component: Dance, props: true },
	],
})

export default router
