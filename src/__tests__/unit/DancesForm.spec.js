import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import DancesForm from '../../components/dances/DancesCards.vue';
import { DanceService } from '@/services/api';

// Мокаем API сервис
vi.mock('@/services/api', () => ({
	DanceService: {
		searchDances: vi.fn(),
		getRegions: vi.fn()
	}
}));

// Мокаем RouterLink глобально для этого теста, чтобы не тянуть весь роутер
const globalOptions = {
	stubs: {
		RouterLink: { template: '<a><slot /></a>' }
	}
};

describe('DancesForm.vue', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		DanceService.getRegions.mockResolvedValue([{ id: '1', name: 'Lori' }]);
		DanceService.searchDances.mockResolvedValue([]);
	});

	it('загружает регионы и танцы при монтировании', async () => {
		mount(DancesForm, { global: globalOptions });

		// Ждем выполнения промисов в onMounted
		await flushPromises();

		expect(DanceService.getRegions).toHaveBeenCalled();
		expect(DanceService.searchDances).toHaveBeenCalled();
	});
});