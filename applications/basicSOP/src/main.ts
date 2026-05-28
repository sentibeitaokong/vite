import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import router from "./router";

const app = createApp(App)
const pinia = createPinia()

//使用pinia插件
app.use(pinia)
// app.use(router)
app.mount('#app')
