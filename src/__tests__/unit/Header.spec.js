import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { ref } from 'vue'
import Header from '@/components/Header.vue'

const { headerScrollMock, menuToggleMock, menuCloseMock } = vi.hoisted(() => ({
	headerScrollMock: vi.fn(),
	menuToggleMock: vi.fn(),
	menuCloseMock: vi.fn(),
}))
const localeRef = ref('hy')

vi.mock('@/services/utils', () => ({
	headerScroll: headerScrollMock,
	menuToggle: menuToggleMock,
	menuClose: menuCloseMock,
}))

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (key) => key,
		locale: localeRef,
	}),
}))

describe('Header.vue', () => {
	let router

	beforeEach(async () => {
		headerScrollMock.mockReturnValue({
			isScrolled: ref(false),
			isVisible: ref(true),
		})

		router = createRouter({
			history: createMemoryHistory(),
			routes: [
				{ path: '/:locale', name: 'home', component: { template: '<div>Home</div>' } },
				{ path: '/:locale/about', name: 'about', component: { template: '<div>About</div>' } },
			],
		})
		await router.push('/hy')
		await router.isReady()
	})

	it('рендерит логотип, меню и контролы языка', () => {
		const wrapper = mount(Header, {
			global: {
				plugins: [router],
				stubs: { AudioPlayerControls: true },
			},
		})

		expect(wrapper.find('.menu__logo').exists()).toBe(true)
		expect(wrapper.find('.menu__list').exists()).toBe(true)
		expect(wrapper.findAll('.menu__language-input')).toHaveLength(3)
	})

	it('при смене языка пушит новый locale в роут', async () => {
		const pushSpy = vi.spyOn(router, 'push')
		const wrapper = mount(Header, {
			global: {
				plugins: [router],
				stubs: { AudioPlayerControls: true },
			},
		})

		await wrapper.find('input[value="en"]').setValue(true)

		expect(pushSpy).toHaveBeenCalledWith({
			name: 'home',
			params: { locale: 'en' },
			query: {},
			hash: '',
		})
	})

	it('по клику на бургер вызывает menuToggle', async () => {
		const wrapper = mount(Header, {
			global: {
				plugins: [router],
				stubs: { AudioPlayerControls: true },
			},
		})

		await wrapper.find('.icon-menu').trigger('click')

		expect(menuToggleMock).toHaveBeenCalled()
	})
})
