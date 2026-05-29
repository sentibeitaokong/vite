// src/store/tagsView.ts
import { defineStore } from 'pinia'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export const useTagsViewStore = defineStore('tagsView', {
  state: () => ({
    // 用户访问过的页面集合（用于渲染标签 UI）
    visitedViews: [] as RouteLocationNormalizedLoaded[],
    // 需要被缓存的组件 name 集合（用于 keep-alive 的 include）
    cachedViews: [] as string[]
  }),

  actions: {
    // 添加视图
    addView(view: RouteLocationNormalizedLoaded) {
      this.addVisitedView(view)
      this.addCachedView(view)
    },

    addVisitedView(view: RouteLocationNormalizedLoaded) {
      if (this.visitedViews.some((v) => v.path === view.path)) return
      // 记录一份纯净的 route 对象
      this.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name'
        })
      )
    },

    addCachedView(view: RouteLocationNormalizedLoaded) {
      // 这里的 view.name 必须与组件内 defineOptions({ name: 'XXX' }) 完全一致
      if (this.cachedViews.includes(view.name as string)) return
      if (!view.meta.noCache) {
        this.cachedViews.push(view.name as string)
      }
    },

    // 关闭单个视图
    delView(view: RouteLocationNormalizedLoaded) {
      return new Promise((resolve) => {
        this.delVisitedView(view)
        this.delCachedView(view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },

    delVisitedView(view: RouteLocationNormalizedLoaded) {
      for (const [i, v] of this.visitedViews.entries()) {
        if (v.path === view.path) {
          this.visitedViews.splice(i, 1)
          break
        }
      }
    },

    delCachedView(view: RouteLocationNormalizedLoaded) {
      const index = this.cachedViews.indexOf(view.name as string)
      if (index > -1) {
        this.cachedViews.splice(index, 1)
      }
    }
    // 实际生产中还可以继续补充：关闭其他、关闭全部、关闭右侧等动作
  }
})
