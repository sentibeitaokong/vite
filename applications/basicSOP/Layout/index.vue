<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />

    <Sidebar class="sidebar-container" />

    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <Navbar />
        <TagsView />
      </div>

      <AppMain />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/app'
// 🌟 引入包括 TagsView 在内的四大金刚
import { Sidebar, Navbar, AppMain, TagsView } from './components'

const appStore = useAppStore()

// 提取 Pinia 状态
const sidebar = computed(() => appStore.sidebar)
const device = computed(() => appStore.device)

// 是否固定顶部 Header
const fixedHeader = computed(() => true)

// 核心引擎：CSS class 联动计算
const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === 'mobile'
}))

// 点击遮罩层关闭侧边栏
const handleClickOutside = () => {
  appStore.closeSideBar(false)
}
</script>

<style lang="scss" scoped>
/* =========================================================
   企业级布局引擎核心变量
   ========================================================= */
$sideBarWidth: 210px;
$hideSideBarWidth: 54px;

.app-wrapper {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* =========================================================
   左侧侧边栏
   ========================================================= */
.sidebar-container {
  transition: width 0.28s;
  width: $sideBarWidth !important;
  background-color: #304156;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

/* =========================================================
   右侧主内容区
   ========================================================= */
.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
  position: relative;
  background-color: #f0f2f5;
}

/* 🌟 顶部悬浮区域组合：Navbar (50px) + TagsView (34px) */
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08); /* 加一点淡淡的阴影区分主内容 */
}

/* =========================================================
   状态联动逻辑 (折叠时的样式覆盖)
   ========================================================= */
.hideSidebar {
  .sidebar-container {
    width: $hideSideBarWidth !important;
  }

  .main-container {
    margin-left: $hideSideBarWidth;
  }

  .fixed-header {
    width: calc(100% - #{$hideSideBarWidth});
  }
}

/* =========================================================
   移动端适配逻辑
   ========================================================= */
.mobile {
  .main-container {
    margin-left: 0px;
  }

  .sidebar-container {
    transition: transform 0.28s;
    width: $sideBarWidth !important;
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }

  .fixed-header {
    width: 100%;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
