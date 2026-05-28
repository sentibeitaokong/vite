<template>
  <div>
    <p>{{ username }}</p>
    <p>
      {{ password }}
    </p>
    <button @click="handleLogin">登录</button>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "@/store/user";
import {login,getUserProfile} from "@/api/user";
import {ref} from "vue";
import {useRouter} from "vue-router";

const username = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()
const handleLogin = () => {
  try {
    //获取用户token
    // const res = await login({
    //   username: username.value,
    //   password: password.value
    // })
    // const token = res.data
    const token='1111111111'
    //添加token
    localStorage.setItem('ACCESS_TOKEN', token)
    const userStore = useUserStore()
    userStore.setToken(token)
    userStore.getInfo()
    router.push('/')
    //获取用户信息
    // const profile=await getUserProfile()
    // console.log(res,profile)
  } catch (e) {
    //打印登录失败的错误
    console.error('登录失败逻辑被触发', e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

</style>
