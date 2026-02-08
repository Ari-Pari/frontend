import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import './styles/main.scss'
import App from './App.vue'
import router from './router'
import messages from './locales/messages'

const i18n = createI18n({
	locale: 'hy',
	fallbackLocale: [ 'en', 'ru' ],
	messages: messages,
})
const app = createApp(App)

app.use(router)
app.use(i18n)
app.mount('#app')
