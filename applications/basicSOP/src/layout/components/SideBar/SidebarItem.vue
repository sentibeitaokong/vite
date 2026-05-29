<template>
  <div v-if="!item.meta?.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.meta?.alwaysShow
      "
    >
      <el-menu-item v-if="onlyOneChild.meta" :index="resolvePath(onlyOneChild.path)">
        <el-icon v-if="onlyOneChild.meta.icon || (item.meta && item.meta.icon)">
          <component :is="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" />
        </el-icon>

        <template #title>
          <span>{{ onlyOneChild.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <el-sub-menu v-else :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <el-icon v-if="item.meta && item.meta.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>

      <SidebarItem
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

// 🌟 声明组件名称 (递归调用时必须要有 name！)
defineOptions({
  name: 'SidebarItem'
})

const props = defineProps<{
  item: RouteRecordRaw
  isNest?: boolean
  basePath: string
}>()

// 临时变量，用于保存唯一需要展示的那个子路由
const onlyOneChild = ref<any>(null)

/**
 * 判断是否只有一个需要展示的子路由
 * @param children 子路由数组
 * @param parent 父路由
 */
const hasOneShowingChild = (children: RouteRecordRaw[] = [], parent: RouteRecordRaw) => {
  // 过滤掉隐藏的路由
  const showingChildren = children.filter((item) => {
    if (item.meta?.hidden) {
      return false
    } else {
      // 暂存唯一的子路由
      onlyOneChild.value = item
      return true
    }
  })

  // 当只有一个子路由时，默认将其提升展示
  if (showingChildren.length === 1) {
    return true
  }

  // 如果没有需要展示的子路由，把父路由自己当做那个“唯一的子项”去展示
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }

  return false
}

/**
 * 🌟 核心：路径解析器
 * 因为 Vite 中不能直接用 Node.js 的 path 模块，所以我们手写一个路径拼接函数
 */
const resolvePath = (routePath: string) => {
  // 如果子路由自身是一个绝对路径（或者是 http 外部链接），直接返回
  if (/^(https?:|mailto:|tel:)/.test(routePath) || routePath.startsWith('/')) {
    return routePath
  }
  // 否则，将父级的 basePath 和当前路由的 path 拼接起来
  if (props.basePath.endsWith('/')) {
    return props.basePath + routePath
  }
  return props.basePath + '/' + routePath
}
</script>

<style lang="scss" scoped>
/* 子菜单嵌套时的缩进样式微调，保证 UI 层级分明 */
:deep(.el-sub-menu .el-menu-item) {
  background-color: #1f2d3d !important;

  &:hover {
    background-color: #001528 !important;
  }
}
</style>
