import { ref } from "vue"

export function useClipboard() {
	const copiedField = ref(null)

	const copyText = async (text, field) => {
		navigator.clipboard.writeText(text).then(() => {
			copiedField.value = field

			setTimeout(() => {
				copiedField.value = null
			}, 2000)
		})

	}

	return { copiedField, copyText }
}