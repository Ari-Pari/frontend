import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useClipboard } from '@/composables/useClipboard'

describe('useClipboard', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		Object.defineProperty(window, 'isSecureContext', {
			value: true,
			configurable: true,
		})
		vi.stubGlobal('navigator', {
			clipboard: {
				writeText: vi.fn().mockResolvedValue(),
			},
		})
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.useRealTimers()
		vi.unstubAllGlobals()
	})

	it('copyText вызывает navigator.clipboard.writeText с переданным текстом', async () => {
		const { copyText } = useClipboard()

		await copyText('test text', 'field1')

		expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text')
	})

	it('copyText устанавливает copiedField и сбрасывает его через 2 секунды', async () => {
		const { copyText, copiedField } = useClipboard()

		await copyText('text', 'testField')
		expect(copiedField.value).toBe('testField')

		vi.advanceTimersByTime(2000)
		expect(copiedField.value).toBeNull()
	})

	it('при повторном вызове сбрасывает предыдущий таймер', async () => {
		const { copyText, copiedField } = useClipboard()

		await copyText('text1', 'field1')
		vi.advanceTimersByTime(1000)
		await copyText('text2', 'field2')

		expect(copiedField.value).toBe('field2')

		vi.advanceTimersByTime(1999)
		expect(copiedField.value).toBe('field2')
		vi.advanceTimersByTime(1)
		expect(copiedField.value).toBeNull()
	})

	it('использует fallback через textarea, если clipboard недоступен', async () => {
		Object.defineProperty(window, 'isSecureContext', {
			value: false,
			configurable: true,
		})
		vi.stubGlobal('navigator', { clipboard: undefined })
		const execCommandMock = vi.fn(() => true)
		const createElementSpy = vi.spyOn(document, 'createElement')
		document.execCommand = execCommandMock

		const { copyText } = useClipboard()
		await copyText('fallback text', 'field')

		expect(createElementSpy).toHaveBeenCalledWith('textarea')
		expect(execCommandMock).toHaveBeenCalledWith('copy')
		expect(document.querySelector('textarea')).toBeNull()
	})
})
