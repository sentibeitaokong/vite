<template>
  <div class="login-container">
    <div class="login-bg"></div>

    <div class="login-box">
      <div class="login-header">
        <h2 class="title">寻北从零搭建测试框架</h2>
        <p class="subtitle">Vue 3 + Vite 7 企业级开发模板</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名 (如: admin)"
            size="large"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码 (如: 123456)"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          size="large"
          class="submit-btn"
          @click="handleLogin"
        >
          {{ loading ? '登录中...' : '登 录' }}
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/store/user'
// import { login } from '@/api/user' // 假设你封装了 login 接口

const router = useRouter()

// 表单实例引用
const loginFormRef = ref<FormInstance>()

// 加载状态 (防重复提交)
const loading = ref(false)

// 响应式表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 企业级严苛的表单校验规则
const loginRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码不能少于 6 位', trigger: 'blur' }
  ]
})

// 核心登录业务逻辑
const handleLogin = async () => {
  // 1. 触发 UI 层的表单校验
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true

        // 🌟 模拟发起网络请求获取 Token
        // const res = await login(loginForm)
        // const token = res.data
        if (!(loginForm.username == 'admin' && loginForm.password == '111111')) {
          debugger
          loading.value = false
          return ElMessage.error('账号密码错误！')
        }
        // --- 模拟异步延时 ---
        await new Promise((resolve) => setTimeout(resolve, 800))
        const token = 'mock-jwt-token-12345'

        // 2. 将 Token 存入本地存储 (或交由 Pinia store 管理)
        localStorage.setItem('ACCESS_TOKEN', token)
        const userStore = useUserStore()
        userStore.setToken(token)
        ElMessage.success('登录成功，欢迎回来！')
        router.push('/')
      } catch (error: any) {
        // 网络或密码错误，已经在 Axios 拦截器中抛出并提示过了，这里只需取消 Loading
        console.error('登录异常:', error)
      } finally {
        loading.value = false
      }
    } else {
      console.warn('表单校验未通过!', fields)
    }
  })
}
</script>

<style scoped lang="scss">
/* 使用 Flexbox 完美居中 */
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  position: relative;
  overflow: hidden;
}

/* 简单的科技感背景装饰 */
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 15% 50%, rgba(64, 158, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 85% 30%, rgba(103, 194, 58, 0.08) 0%, transparent 50%);
  z-index: 0;
}

/* 核心登录框样式 */
.login-box {
  width: 420px;
  padding: 40px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  z-index: 1; /* 确保在背景之上 */
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;

  .title {
    margin: 0;
    font-size: 28px;
    color: #303133;
    font-weight: 600;
    letter-spacing: 1px;
  }

  .subtitle {
    margin: 10px 0 0;
    font-size: 14px;
    color: #909399;
  }
}

.login-form {
  .submit-btn {
    width: 100%;
    margin-top: 10px;
    font-size: 16px;
    letter-spacing: 4px; /* 让“登 录”两个字更美观 */
  }
}
</style>

<style lang="scss">
.login-form .el-input__wrapper {
  padding: 4px 11px;
}
</style>
