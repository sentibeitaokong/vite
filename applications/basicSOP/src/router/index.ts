import { createRouter, createWebHashHistory, Router } from 'vue-router'
import { constantRoutes } from './routes'

// 创建路由实例
const router: Router = createRouter({
  // 使用 HTML5 History 模式
  history: createWebHashHistory(import.meta.env.BASE_URL),
  // 初始只挂载常量路由
  routes: constantRoutes,
  // 路由跳转时滚动到顶部
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 重置路由的方法（常用于用户退出登录时清理动态路由）
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: constantRoutes
  })
  // 替换路由的 matcher
  ;(router as any).matcher = (newRouter as any).matcher
}

export default router
