import { vi } from 'vitest';
import { config } from '@vue/test-utils';
import { ref } from 'vue'; // Импортируем ref для реактивности

// 1. Исправленный мок IntersectionObserver (теперь это класс)
class IntersectionObserverMock {
	constructor() {
		this.observe = vi.fn();
		this.unobserve = vi.fn();
		this.disconnect = vi.fn();
		this.takeRecords = vi.fn();
	}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// 2. Мок для scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// 3. Глобальные моки
config.global.mocks = {
	$t: (msg) => msg,
	$i18n: { locale: 'hy' }
};

// 4. Исправленный мок vue-i18n с использованием ref
vi.mock('vue-i18n', () => {
	return {
		useI18n: () => ({
			t: (key) => key,
			locale: ref('hy') // Теперь это настоящий ref!
		})
	};
});