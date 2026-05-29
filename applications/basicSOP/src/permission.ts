import router from '@/router'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import NProgress from 'nprogress' // 进度条插件
import 'nprogress/nprogress.css'
// 可选：全局配置（例如隐藏右上角的加载小圆圈）
NProgress.configure({ showSpinner: false })

//定义白名单
const whiteList = ['/login', '404']

//全局路由前置守卫
router.beforeEach(async (to) => {
  NProgress.start()
  const userStore = useUserStore()
  const hasToken = userStore.token
  const usePermission = usePermissionStore()
  if (hasToken) {
    if (to.path === '/login') {
      //如果已登录，还跳转login,直接重定向主页
      NProgress.done()
      return { path: '/' }
    } else {
      //判断用户是否拉取过角色的信息
      const hasRoles = userStore.roles && userStore.roles.length > 0
      if (hasRoles) {
        return true
      } else {
        try {
          // 场景：页面首次刷新（Pinia 的 state 被清空），需要重新拉取用户信息
          await userStore.getInfo()
          const roles = userStore.roles
          // 根据拉取到的角色，生成动态路由表
          const accessRoutes = await usePermission.generateRoutes(roles)
          // 核心操作：将过滤后的路由动态添加到 Vue Router 实例中
          accessRoutes.forEach((route) => {
            router.addRoute(route)
          })
          // 避坑指南：addRoute 是异步的。如果直接 return ，当前路由还没挂载完毕，会导致页面白屏。
          // 必须使用 return { ...to, replace: true }，强制终端当前的导航，开启一次新的导航。
          return { ...to, replace: true }
        } catch (error) {
          await userStore.logout()
          console.log(error)
          NProgress.done()
          return { path: '/login', query: { redirect: to.fullPath } }
        }
      }
    }
  } else {
    //没有token
    if (whiteList.includes(to.path)) {
      //白名单直接放行
      return true
    } else {
      // 没权限又想访问系统内部，拦截并打回登录页，携带打算去的目标地址以便登录后跳回
      NProgress.done()
      return { path: '/login', query: { redirect: to.fullPath } }
    }
  }
})

router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})
