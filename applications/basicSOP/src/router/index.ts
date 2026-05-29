import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import { constantRoutes, asyncRoutes } from '@/router/routes'

//全局路由配置
const router = createRouter({
  history: createWebHistory(),
  routes: [...constantRoutes, ...asyncRoutes],
  scrollBehavior: () => ({ left: 0, top: 0 }) //路由跳转默认滚动配置
})

//定义白名单
const whiteList = ['/login', '404']

//全局路由前置守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const hasToken = userStore.token
  if (hasToken) {
    if (to.path === '/login') {
      //如果已登录，还跳转login,直接重定向主页
      next({ path: '/' })
    } else {
      //判断用户是否拉取过角色的信息
      const hasRoles = userStore.roles && userStore.roles.length > 0
      if (hasRoles) {
        next() //角色已存在，直接放行
      } else {
        try {
          // 场景：页面首次刷新（Pinia 的 state 被清空），需要重新拉取用户信息
          await userStore.getInfo()
          const roles = userStore.roles
          // 根据拉取到的角色，生成动态路由表
          const usePermission = usePermissionStore()
          const accessRoutes = await usePermission.generateRoutes(roles)
          // 核心操作：将过滤后的路由动态添加到 Vue Router 实例中
          accessRoutes.forEach((route) => {
            router.addRoute(route)
          })
          console.log(accessRoutes)
          // 避坑指南：addRoute 是异步的。如果直接 next()，当前路由还没挂载完毕，会导致页面白屏。
          // 必须使用 next({ path: to.fullPath, replace: true })，强制终端当前的导航，开启一次新的导航。
          next({ path: to.fullPath, replace: true })
        } catch (error) {
          await userStore.logout()
          console.log(error)
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    //没有token
    if (whiteList.includes(to.path)) {
      //白名单直接放行
      next()
    } else {
      // 没权限又想访问系统内部，拦截并打回登录页，携带打算去的目标地址以便登录后跳回
      next(`/login?redirect=${to.path}`)
    }
  }
})

export default router
