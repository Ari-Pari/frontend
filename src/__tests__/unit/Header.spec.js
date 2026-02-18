import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Header from '@/components/Header.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useI18n } from 'vue-i18n' // Импортируем, чтобы получить доступ к замоканному locale

// Мокаем утилиты, чтобы headerScroll не падал
vi.mock('@/services/utils', () => ({
	headerScroll: vi.fn(),
	menuInit: vi.fn(),
	menuClose: vi.fn(),
	bodyLock: vi.fn(),
	bodyUnlock: vi.fn()
}))

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', name: 'home', component: { template: '<div>Home</div>' } },
		{ path: '/about', name: 'about', component: { template: '<div>About</div>' } }
	]
})

describe('Header.vue', () => {
	it('рендерит логотип и меню', () => {
		const wrapper = mount(Header, {
			global: {
				plugins: [router],
				stubs: ['RouterLink']
			}
		})
		expect(wrapper.find('.menu__logo').exists()).toBe(true)
		expect(wrapper.find('.menu__list').exists()).toBe(true)
	})

	it('меняет язык при клике на радио-кнопку', async () => {
		const wrapper = mount(Header, {
			global: {
				plugins: [router],
			}
		})

		// Получаем доступ к замоканному useI18n
		const { locale } = useI18n()

		const engInput = wrapper.find('input[value="en"]')
		await engInput.setValue(true) // Имитируем выбор radio

		// Проверяем реактивность
		expect(locale.value).toBe('hy')
		expect(localStorage.getItem('userLanguage')).toBe('en')
	})
})