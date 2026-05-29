<template>
  <div :class="{ 'has-logo': showLogo }">
    <Logo v-if="showLogo" :collapse="isCollapse" />

    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        v-if="permissionStore.routes.length > 0"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <SidebarItem
          v-for="route in permissionRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/app'
import { usePermissionStore } from '@/store/permission'
import SidebarItem from './SidebarItem.vue'

// 🌟 2. 引入刚刚写好的 Logo 组件
import Logo from './Logo.vue'

const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

// 控制是否显示 Logo (这里写死为 true，以后你可以把它放进 Pinia 做成全局设置项)
const showLogo = computed(() => true)

const permissionRoutes = computed(() => permissionStore.routes)
const isCollapse = computed(() => !appStore.sidebar.opened)

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu as string
  }
  return path
})
</script>

<style lang="scss" scoped>
.scrollbar-wrapper {
  height: 100%;
}

.el-scrollbar {
  height: 100%;
}

/* 🌟 3. 计算滚动区域高度：总高度减去 Logo 的 50px 高度 */
.has-logo .el-scrollbar {
  height: calc(100vh - 50px);
}

.el-menu {
  border-right: none;
  width: 100% !important;
}
</style>
