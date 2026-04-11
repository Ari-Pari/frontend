import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import './styles/main.scss'
import App from './App.vue'
import router from './router'
import { messages } from './locales/messages'
import { userMainLanguage, type SupportedLocale } from './services/lang'

document.documentElement.setAttribute('lang', userMainLanguage)
const i18n = createI18n({
	legacy: false,
	locale: userMainLanguage,
	fallbackLocale: ['en', 'ru'],
	messages: messages,
})

const app = createApp(App)

app.use(router)
app.use(i18n)

router.beforeEach((to, _from, next) => {
	const locale = to.params.locale as SupportedLocale
	if (locale) {
		i18n.global.locale.value = locale
		document.documentElement.setAttribute('lang', locale);
		localStorage.setItem('userLanguage', locale);
	}
	next()
})

app.mount('#app')

