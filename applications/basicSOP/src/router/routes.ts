import type { RouteRecordRaw } from 'vue-router'
//常驻路由 (白名单) 不需要任何权限凭证，所有用户（包括未登录）均可直接访问
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/Login.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/404',
    name: 'PageNotFound',
    component: () => import('@/views/NotFound/NotFound.vue'),
    meta: { title: '未找到页面', hidden: true }
  }
]

//动态路由(权限路由):包括Layout布局和具体业务页面
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    meta: {
      title: '主页', // 🌟 你想要显示的标题
      breadcrumb: false, // 保持为 false：不在顶部面包屑显示
      alwaysShow: true // 🌟 强制在侧边栏显示为父级目录（不被子路由顶替）
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/Dashboard.vue'),
        meta: {
          title: '控制台',
          icon: 'dashboard',
          affix: true
        }
      },
      {
        path: 'system',
        name: 'System',
        redirect: '/system/user',
        meta: {
          title: '系统管理',
          icon: 'Setting',
          roles: ['admin']
        },
        children: [
          {
            path: 'user',
            name: 'UserManage',
            component: () => import('@/views/System/User/User.vue'),
            meta: {
              title: '用户管理',
              icon: 'User',
              roles: ['admin']
            }
          },
          {
            path: 'role',
            name: 'RoleManage',
            // 假设你后续会创建这个页面
            component: () => import('@/views/System/Role/Role.vue'),
            meta: {
              title: '角色管理',
              icon: 'Key',
              roles: ['admin']
            }
          }
        ]
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/notFound',
    meta: { hidden: true }
  }
]
