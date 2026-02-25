import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useClipboard } from '@/composables/useClipboard';

describe('useClipboard', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		// Используем vi.stubGlobal для правильного мока
		vi.stubGlobal('navigator', {
			clipboard: {
				writeText: vi.fn().mockResolvedValue(),
			},
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('copyText вызывает navigator.clipboard.writeText с переданным текстом', async () => {
		const { copyText } = useClipboard();
		await copyText('test text', 'field1');
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
	});

	it('copyText устанавливает copiedField в переданное поле и сбрасывает через 2 секунды', async () => {
		const { copyText, copiedField } = useClipboard();
		await copyText('text', 'testField');
		expect(copiedField.value).toBe('testField');
		vi.advanceTimersByTime(2000);
		expect(copiedField.value).toBeNull();
	});

	it('copyText сбрасывает предыдущий таймер при повторном вызове', async () => {
		const { copyText, copiedField } = useClipboard();
		await copyText('text1', 'field1');
		vi.advanceTimersByTime(1000);
		await copyText('text2', 'field2');
		expect(copiedField.value).toBe('field2');
		vi.advanceTimersByTime(2000);
		expect(copiedField.value).toBeNull();
	});

	it('использует fallback (textarea), если clipboard недоступен', async () => {
		vi.stubGlobal('navigator', { clipboard: undefined });
		const execCommandMock = vi.fn(() => true);
		document.execCommand = execCommandMock;

		const { copyText } = useClipboard();
		await copyText('fallback text', 'field');

		const textarea = document.querySelector('textarea');
		expect(textarea).not.toBeNull();
		expect(textarea.value).toBe('fallback text');
		expect(execCommandMock).toHaveBeenCalledWith('copy');
		expect(document.querySelector('textarea')).toBeNull();
	});
});