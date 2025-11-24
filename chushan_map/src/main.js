import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import TlbsMap from 'tlbs-map-vue'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(TlbsMap)

app.mount('#app')
