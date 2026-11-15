import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/jetbrains-mono/400.css'
import '@okkly/design-system/styles/index.scss'
import '@okkly/vue/style.css'
import '@/styles/global.css'

import { createApp } from 'vue'
import App from './App.vue'

document.documentElement.classList.add('dark')

createApp(App).mount('#app')
