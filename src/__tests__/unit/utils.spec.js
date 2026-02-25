import { describe, it, expect, vi } from 'vitest';
import { formatTime, getYoutubeId, scrollToBlock } from '@/services/utils';

describe('utils', () => {
	describe('formatTime', () => {
		it('форматирует секунды в MM:SS', () => {
			expect(formatTime(0)).toBe('00:00');
			expect(formatTime(61)).toBe('01:01');
			expect(formatTime(3599)).toBe('59:59');
			expect(formatTime(3600)).toBe('60:00');
			expect(formatTime(3665)).toBe('61:05');
		});

		it('обрабатывает undefined/null как 00:00', () => {
			expect(formatTime(null)).toBe('00:00');
			expect(formatTime(undefined)).toBe('00:00');
		});
	});

	describe('getYoutubeId', () => {
		it('извлекает ID из различных форматов YouTube URL', () => {
			expect(getYoutubeId('https://www.youtube.com/watch?v=abc123')).toBe('abc123');
			expect(getYoutubeId('https://youtu.be/abc123')).toBe('abc123');
			expect(getYoutubeId('https://youtube.com/embed/abc123')).toBe('abc123');
			expect(getYoutubeId('https://m.youtube.com/watch?v=abc123')).toBe('abc123');
		});

		it('возвращает null для невалидных URL', () => {
			expect(getYoutubeId('https://example.com')).toBeNull();
			expect(getYoutubeId('')).toBeNull();
			expect(getYoutubeId('not-a-url')).toBeNull();
		});
	});

	describe('scrollToBlock', () => {
		it('вызывает scrollIntoView на элементе с переданным ID', () => {
			const element = { scrollIntoView: vi.fn() };
			document.getElementById = vi.fn().mockReturnValue(element);

			scrollToBlock('test-id');
			// requestAnimationFrame требует небольшой задержки
			vi.useFakeTimers();
			vi.advanceTimersToNextFrame(); // или просто дождаться nextTick
			expect(document.getElementById).toHaveBeenCalledWith('test-id');
			expect(element.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
			vi.useRealTimers();
		});

		it('ничего не делает, если элемент не найден', () => {
			document.getElementById = vi.fn().mockReturnValue(null);
			expect(() => scrollToBlock('missing')).not.toThrow();
		});
	});
});