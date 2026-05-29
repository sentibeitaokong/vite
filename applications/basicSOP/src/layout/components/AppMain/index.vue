<template>
  <section class="app-main" ref="appMainRef">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useTagsViewStore } from '@/store/tagsView'

const tagsViewStore = useTagsViewStore()

// 🌟 1. 动态获取缓存名单
// 这里的名单由 TagsView 的交互实时更新，实现“打开标签页缓存，关闭标签页销毁”
const cachedViews = computed(() => tagsViewStore.cachedViews)

// 🌟 2. 尺寸变动广播中心 (解决侧边栏折叠时，图表/表格不自适应的问题)
const appMainRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (appMainRef.value) {
    resizeObserver = new ResizeObserver(() => {
      // 当容器物理尺寸变化时，向全局伪造并派发一个 window.resize 事件
      window.dispatchEvent(new Event('resize'))
    })
    resizeObserver.observe(appMainRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<style lang="scss" scoped>
.app-main {
  padding: 100px 10px 10px 10px;

  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden; /* 防止内部表格计算延迟导致的瞬间溢出滚动条 */
  background-color: #f0f2f5;
  box-sizing: border-box;
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
