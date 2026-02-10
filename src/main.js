import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import './styles/main.scss'
import App from './App.vue'
import router from './router'
import messages from './locales/messages'
import { userMainLanguage } from './services/api'

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
app.mount('#app')

