import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏状态
  const sidebar = ref({
    opened: true, // 默认展开
    withoutAnimation: false // 是否需要禁用动画 (如页面缩放调整时)
  })

  // 当前设备类型 (desktop / mobile)
  const device = ref('desktop')

  // 切换侧边栏状态
  const toggleSideBar = () => {
    sidebar.value.opened = !sidebar.value.opened
    sidebar.value.withoutAnimation = false
  }

  // 关闭侧边栏 (移动端点击遮罩层时使用)
  const closeSideBar = (withoutAnimation: boolean) => {
    sidebar.value.opened = false
    sidebar.value.withoutAnimation = withoutAnimation
  }

  // 切换设备类型
  const toggleDevice = (deviceType: string) => {
    device.value = deviceType
  }

  return { sidebar, device, toggleSideBar, closeSideBar, toggleDevice }
})
