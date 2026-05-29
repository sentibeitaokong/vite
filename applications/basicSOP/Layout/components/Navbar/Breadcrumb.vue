<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index === levelList.length - 1"
          class="no-redirect"
        >
          {{ item.meta?.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta?.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationMatched } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 存储当前匹配的路由层级
const levelList = ref<RouteLocationMatched[]>([])

// 核心抓取逻辑
const getBreadcrumb = () => {
  // 只过滤出有 meta.title 且没有被隐藏的路由
  let matched = route.matched.filter((item) => item.meta && item.meta.title)

  // 可以在这里做一些定制拦截，比如如果第一个不是 Dashboard，手动把 Dashboard 塞进去作为首页
  const first = matched[0]
  if (first && first.name !== 'Dashboard') {
    // 根据你的实际路由配置调整
    matched = [{ path: '/dashboard', meta: { title: '控制台' } } as any].concat(matched)
  }

  levelList.value = matched.filter(
    (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
  )
}

// 监听路由变化，重新生成面包屑
watch(
  () => route.path,
  () => {
    // 避免重定向时触发
    if (route.path.startsWith('/redirect/')) {
      return
    }
    getBreadcrumb()
  },
  { immediate: true }
)

// 处理点击跳转
const handleLink = (item: RouteLocationMatched) => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect as string)
    return
  }
  router.push(path)
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px; /* 必须和 Navbar 高度一致 */
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}

/* 面包屑过渡动画 */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}
.breadcrumb-enter-from,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}
.breadcrumb-leave-active {
  position: absolute;
}
</style>
