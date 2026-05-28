<template>
  <div>
    主页
    <button @click="exit" style="float:right;">退出登录</button>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "@/store/user";
import {ref} from "vue";
import {useRouter} from "vue-router";
const loading = ref(false)
const router = useRouter()
const exit = () => {
  try {
    //添加token
    const userStore = useUserStore()
    userStore.logout()
    router.push('/login')
    //获取用户信息
    // const profile=await getUserProfile()
    // console.log(res,profile)
  } catch (e) {
    //打印登录失败的错误
    console.error('登出失败逻辑被触发', e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

</style>