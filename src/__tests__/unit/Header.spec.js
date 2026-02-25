import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Header from '@/components/Header.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { menuInitMock } = vi.hoisted(() => ({
	menuInitMock: vi.fn(),
}));

vi.mock('@/services/utils', () => ({
	headerScroll: vi.fn(),
	menuInit: menuInitMock,
	menuClose: vi.fn(),
	bodyLock: vi.fn(),
	bodyUnlock: vi.fn(),
}));

vi.mock('vue-i18n', () => ({
	useI18n: vi.fn(() => ({
		t: (key) => key,
		locale: { value: 'hy' },
	})),
}));

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', name: 'home', component: { template: '<div>Home</div>' } },
		{ path: '/about', name: 'about', component: { template: '<div>About</div>' } },
	],
});

describe('Header.vue', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('рендерит логотип и меню', () => {
		const wrapper = mount(Header, {
			global: {
				plugins: [router],
				stubs: ['RouterLink'],
			},
		});
		expect(wrapper.find('.menu__logo').exists()).toBe(true);
		expect(wrapper.find('.menu__list').exists()).toBe(true);
	});

	it('меняет язык при клике на радио-кнопку', async () => {
		const wrapper = mount(Header, {
			global: {
				plugins: [router],
			},
		});

		const { locale } = useI18n();
		expect(locale.value).toBe('hy');

		const engInput = wrapper.find('input[value="en"]');
		await engInput.setValue(true);

		expect(locale.value).toBe('en');
		expect(localStorage.getItem('userLanguage')).toBe('en');
	});

	it('вызывает menuInit при клике на бургер-меню', async () => {
		const wrapper = mount(Header, { global: { plugins: [router] } });
		const burgerButton = wrapper.find('.icon-menu');
		await burgerButton.trigger('click');
		expect(menuInitMock).toHaveBeenCalled();
	});
});