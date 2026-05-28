import {defineStore} from "pinia";
import {ref} from "vue";
import type {RouteRecordRaw} from "vue-router";
import {asyncRoutes,constantRoutes} from "@/router";

// 核心过滤算法：判断当前角色是否有权限访问该路由
function hasPermission(roles: string[], route: RouteRecordRaw) {
    if(route.meta&&route.meta.roles){
        //只要用户的角色列表中，包含该路由允许的角色之一，即判定为有权限
        return roles.some(role=>(route.meta?.roles as string[]).includes(role))
    }else{
        //如果路由没写 meta.roles，说明默认所有人都能访问
        return true
    }
}

//递归过滤异步路由表
function filterAsyncRoutes(roles: string[], routes: RouteRecordRaw[]) {
    const res:RouteRecordRaw[]=[]
    routes.forEach(route=>{
        const tmp={...route}
        if(hasPermission(roles,tmp)){
            // 深度优先，如果包含子路由，继续递归过滤
            if(tmp.children){
                tmp.children=filterAsyncRoutes(roles,tmp.children)
            }
            res.push(tmp)
        }
    })
    return res
}

//权限hook
export const usePermissionStore=defineStore('permission',()=>{
    // routes 用于给侧边栏渲染菜单使用
    const routes = ref<RouteRecordRaw[]>([])
    // addRoutes 保存动态添加的路由
    const addRoutes = ref<RouteRecordRaw[]>([])
    const generateRoutes=(roles:string[])=>{
        return new Promise<RouteRecordRaw[]>(resolve=>{
            let accessRoutes:RouteRecordRaw[]=[]
            if(roles.includes('admin')){
                // 超级管理员拥有最高权限，直接拥有全部路由
                accessRoutes=asyncRoutes
            }else{
                // 普通角色，开始递归过滤
                accessRoutes=filterAsyncRoutes(roles,asyncRoutes)
            }
            // 记录生成的动态路由
            addRoutes.value=accessRoutes
            // 拼接静态路由，形成完整菜单结构
            routes.value=constantRoutes.concat(accessRoutes)
            resolve(accessRoutes)
        })
    }
    return { routes, addRoutes, generateRoutes }
})