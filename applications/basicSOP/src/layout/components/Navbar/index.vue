<template>
  <div class="navbar">
    <div class="left-menu">
      <div class="hamburger-container" @click="toggleSideBar">
        <el-icon :size="20">
          <component :is="sidebar.opened ? 'Fold' : 'Expand'" />
        </el-icon>
      </div>
      <Breadcrumb class="breadcrumb-container" />
    </div>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="hover">
        <div class="avatar-wrapper">
          <el-avatar
            :size="32"
            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          />
          <span class="user-name">管理员</span>
          <el-icon class="caret-bottom"><CaretBottom /></el-icon>
        </div>

        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <a target="_blank" href="https://github.com/">
              <el-dropdown-item>
                <el-icon><Link /></el-icon>
                <span>项目源码</span>
              </el-dropdown-item>
            </a>

            <el-dropdown-item divided @click="logout">
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import Breadcrumb from './Breadcrumb.vue'
import { resetRouter } from '@/router'

const appStore = useAppStore()
const router = useRouter()

const sidebar = computed(() => appStore.sidebar)

const toggleSideBar = () => {
  appStore.toggleSideBar()
}

// 退出登录逻辑 (保留了你的原版业务逻辑)
const logout = async () => {
  localStorage.removeItem('ACCESS_TOKEN')
  const userStore = useUserStore()
  //退出登录，清理本地缓存和 Store 状态
  await userStore.logout()
  await new Promise((resolve) => setTimeout(resolve, 800))
  //重置路由表，擦除动态加载的路由
  resetRouter()
  router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
  ElMessage.success('退出登录成功！')
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  /* 左侧菜单布局 */
  .left-menu {
    display: flex;
    align-items: center;
    height: 100%;

    .hamburger-container {
      padding: 0 15px;
      height: 100%;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    .breadcrumb-container {
      margin-left: 8px;
    }
  }

  /* 🌟 右侧菜单布局重构 */
  .right-menu {
    display: flex;
    align-items: center;
    height: 100%;
    padding-right: 20px;

    .avatar-container {
      .avatar-wrapper {
        display: flex;
        align-items: center;
        padding: 0 8px;
        height: 50px;
        cursor: pointer;
        transition: all 0.3s;
        border-radius: 4px;

        /* 鼠标悬停时的微交互底色 */
        &:hover {
          background: rgba(0, 0, 0, 0.025);

          /* 悬停时小箭头翻转180度 */
          .caret-bottom {
            transform: rotate(180deg);
          }
        }

        .user-name {
          margin: 0 4px 0 8px;
          font-size: 14px;
          color: #606266;
          font-weight: 500;
        }

        .caret-bottom {
          font-size: 12px;
          color: #909399;
          transition: transform 0.3s;
        }
      }
    }
  }
}

/* 🌟 全局覆盖下拉菜单内部样式 (处理 a 标签默认下划线和图标对齐) */
:deep(.user-dropdown) {
  a {
    text-decoration: none;
    color: inherit;
  }

  .el-dropdown-item {
    display: flex;
    align-items: center;
    padding: 8px 20px; /* 稍微撑大一点点击热区，避免过于拥挤 */

    .el-icon {
      margin-right: 8px;
      font-size: 16px;
    }
  }
}
</style>
