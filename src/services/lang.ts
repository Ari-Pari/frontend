export const supportedLocales = ['en', 'ru', 'hy'] as const
export type SupportedLocale = typeof supportedLocales[number]

const browserLang: string =
	localStorage.getItem('userLanguage')
	|| navigator.language
	|| 'hy'

const normalizedLang = browserLang.split('-')[0]

export const userMainLanguage: SupportedLocale =
	(supportedLocales as readonly string[]).includes(normalizedLang)
		? (normalizedLang as SupportedLocale)
		: 'hy'