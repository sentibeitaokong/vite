<template>
  <div class="tags-view-container">
    <el-scrollbar wrap-class="tags-view-wrapper" @wheel.prevent="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
      >
        <span class="tag-title">{{ tag.meta?.title }}</span>
        <el-icon
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <Close />
        </el-icon>
      </router-link>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagsViewStore } from '@/store/tagsView'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()

const visitedViews = computed(() => tagsViewStore.visitedViews)

const isActive = (tag: RouteLocationNormalizedLoaded) => {
  return tag.path === route.path
}

const isAffix = (tag: RouteLocationNormalizedLoaded) => {
  return tag.meta && tag.meta.affix
}

watch(
  () => route.path,
  () => {
    if (route.meta.title) {
      tagsViewStore.addView(route)
    }
  },
  { immediate: true }
)

const closeSelectedTag = async (view: RouteLocationNormalizedLoaded) => {
  const { visitedViews } = await tagsViewStore.delView(view)
  if (isActive(view)) {
    console.log(view)
    toLastView(visitedViews, view)
  }
}

const toLastView = (visitedViews: any[], view: RouteLocationNormalizedLoaded) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    if (view.name === 'Dashboard') {
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}

const handleScroll = (e: WheelEvent) => {
  const eventDelta = e.wheelDelta || -e.deltaY * 40
  const scrollbar = document.querySelector('.tags-view-wrapper')
  if (scrollbar) {
    scrollbar.scrollLeft += eventDelta / 4
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 40px; /* 🌟 提升高度，增加呼吸感 */
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #f0f2f5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04); /* 阴影改淡，显得更高级 */

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-flex; /* 🌟 核心：改用 Flex 布局，告别恶心的 vertical-align 居中问题 */
      align-items: center;
      position: relative;
      cursor: pointer;
      height: 28px;
      border: 1px solid #dcdfe6; /* Element Plus 默认边框色 */
      border-radius: 4px; /* 🌟 增加现代感的小圆角 */
      color: #606266;
      background: #fff;
      padding: 0 12px; /* 增加左右内边距，让标签不那么拥挤 */
      font-size: 13px; /* 字体稍微放大一点点 */
      margin-left: 6px;
      margin-top: 6px; /* 配合父容器的 40px 高度，垂直居中 */
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }

      /* 鼠标悬停时的基础反馈 */
      &:hover {
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
      }

      /* 🌟 激活状态：采用清爽的浅蓝 Soft UI 风格 */
      &.active {
        background-color: #ecf5ff;
        color: #409eff;
        border-color: #b3d8ff;
        font-weight: 500;
      }

      /* 🌟 优化关闭按钮样式 */
      .el-icon-close {
        margin-left: 6px; /* 和文字拉开一点距离 */
        width: 14px;
        height: 14px;
        border-radius: 50%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        transition: all 0.2s;
        color: inherit; /* 继承父级的文字颜色 */

        &:hover {
          background-color: #f56c6c; /* 悬停时变成危险红，警示关闭操作 */
          color: #fff;
        }
      }
    }
  }
}
</style>
