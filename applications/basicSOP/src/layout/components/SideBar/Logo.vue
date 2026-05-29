<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" alt="logo" />
        <h1 v-else class="sidebar-title">{{ title }}</h1>
      </router-link>

      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" alt="logo" />
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 接收父组件传递的折叠状态
defineProps<{
  collapse: boolean
}>()

// 🌟 系统名称与 Logo 配置
const title = ref('寻北测试框架')

// 这里我使用了一个 Vue 官方的 SVG 作为占位。你可以替换为本地的 '@/assets/logo.png'
const logo = ref('https://cn.vuejs.org/logo.svg')
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}
.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px; /* 必须和你的 Navbar 高度保持一致 */
  line-height: 50px;
  background: #2b2f3a; /* 比侧边栏稍微深一点的颜色，增加立体感 */
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none; // 去除 a 标签默认下划线
  }

  & .sidebar-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    margin-right: 12px;
  }

  & .sidebar-title {
    display: inline-block;
    margin: 0;
    color: #fff;
    font-weight: 600;
    line-height: 50px;
    font-size: 14px;
    font-family:
      Avenir,
      Helvetica Neue,
      Arial,
      Helvetica,
      sans-serif;
    vertical-align: middle;
  }
}

.collapse {
  .sidebar-logo {
    margin-right: 0px; /* 折叠时去掉右边距，让图标完美居中 */
  }
}
</style>
