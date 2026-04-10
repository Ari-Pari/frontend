import { ref } from "vue"

let timeoutId: ReturnType<typeof setTimeout> | null = null;
export function useClipboard() {
	const copiedField = ref<string | null>(null)

	const copyText = async (text: string, field: string) => {
		try {
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(text)
			} else {
				// fallback for old browsers
				const textArea = document.createElement("textarea")
				textArea.value = text
				textArea.style.position = "fixed"
				textArea.style.left = "-999999px"
				document.body.appendChild(textArea)
				textArea.focus()
				textArea.select()
				document.execCommand("copy")
				document.body.removeChild(textArea)
			}

			copiedField.value = field
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				copiedField.value = null;
			}, 2000);

		} catch (err) {
			console.error("Copy failed", err)
		}
	}

	return { copiedField, copyText }
}