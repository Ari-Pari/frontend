import { describe, it, expect, vi } from 'vitest'
import { formatTime, getYoutubeId, scrollToBlock } from '@/services/utils'

describe('utils', () => {
	describe('formatTime', () => {
		it('форматирует секунды в MM:SS', () => {
			expect(formatTime(0)).toBe('00:00')
			expect(formatTime(61)).toBe('01:01')
			expect(formatTime(3599)).toBe('59:59')
			expect(formatTime(3600)).toBe('60:00')
		})

		it('обрабатывает undefined и null как 00:00', () => {
			expect(formatTime(null)).toBe('00:00')
			expect(formatTime(undefined)).toBe('00:00')
		})
	})

	describe('getYoutubeId', () => {
		it('извлекает ID из разных YouTube URL', () => {
			expect(getYoutubeId('https://www.youtube.com/watch?v=abc123')).toBe('abc123')
			expect(getYoutubeId('https://youtu.be/abc123')).toBe('abc123')
			expect(getYoutubeId('https://youtube.com/embed/abc123')).toBe('abc123')
			expect(getYoutubeId('https://m.youtube.com/watch?v=abc123')).toBe('abc123')
		})

		it('возвращает пустую строку для неподходящего URL и пустого значения', () => {
			expect(getYoutubeId('https://example.com')).toBe('')
			expect(getYoutubeId('')).toBe('')
		})

		it('выбрасывает ошибку на невалидном URL', () => {
			expect(() => getYoutubeId('not-a-url')).toThrow()
		})
	})

	describe('scrollToBlock', () => {
		it('вызывает scrollIntoView на элементе с переданным ID', () => {
			vi.useFakeTimers()
			const element = { scrollIntoView: vi.fn() }
			const getElementSpy = vi.spyOn(document, 'getElementById').mockReturnValue(element)

			scrollToBlock('test-id')
			vi.advanceTimersToNextFrame()

			expect(getElementSpy).toHaveBeenCalledWith('test-id')
			expect(element.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
			vi.useRealTimers()
		})

		it('ничего не делает, если элемент не найден', () => {
			vi.useFakeTimers()
			vi.spyOn(document, 'getElementById').mockReturnValue(null)

			expect(() => {
				scrollToBlock('missing')
				vi.advanceTimersToNextFrame()
			}).not.toThrow()

			vi.useRealTimers()
		})
	})
})
