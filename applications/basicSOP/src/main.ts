import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
const pinia = createPinia()
import './styles/index.scss'

// 将所有图标全局注册为组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//使用pinia插件
app.use(pinia)
app.use(router)
app.mount('#app')
