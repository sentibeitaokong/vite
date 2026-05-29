<template>
  <div class="app-container">
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="queryParams" ref="queryFormRef">
        <el-form-item label="用户名称" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            style="width: 160px"
          >
            <el-option label="正常" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
          <el-button icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="never">
      <div class="toolbar">
        <el-button type="primary" icon="Plus" @click="handleAdd">新增用户</el-button>
        <el-button type="danger" icon="Delete" :disabled="multipleSelection.length === 0"
          >批量删除</el-button
        >
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="用户ID" width="100" align="center" />
        <el-table-column prop="username" label="用户名" width="150" align="center" />
        <el-table-column prop="role" label="角色" width="150" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.role === '超级管理员' ? 'danger' : 'primary'">
              {{ scope.row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" align="center" />

        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="scope">
            <el-button type="primary" link icon="Edit" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" link icon="Delete" @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="getList"
          @current-change="getList"
        />
      </div>
    </el-card>

    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      append-to-body
      destroy-on-close
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="formData.roleId" placeholder="请选择角色" style="width: 100%">
            <el-option label="超级管理员" :value="1" />
            <el-option label="普通用户" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 🌟 极其重要：声明组件名称，必须与路由表配置的 name 完全一致，否则 TagsView 缓存无效！
defineOptions({
  name: 'UserManage'
})

// --- 搜索与表格状态 ---
const queryFormRef = ref<FormInstance>()
const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)
const multipleSelection = ref<any[]>([])

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  username: '',
  status: undefined
})

// --- 弹窗状态 ---
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const submitLoading = ref(false)

const formData = reactive({
  id: undefined,
  username: '',
  password: '',
  roleId: undefined,
  status: 1
})

const formRules = reactive<FormRules>({
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  roleId: [{ required: true, message: '请选择分配的角色', trigger: 'change' }]
})

// --- 核心业务逻辑 ---

// 模拟拉取接口数据
const getList = async () => {
  loading.value = true
  // 模拟网络延时
  await new Promise((resolve) => setTimeout(resolve, 600))

  tableData.value = [
    {
      id: 1001,
      username: 'admin',
      role: '超级管理员',
      status: 1,
      createTime: '2026-05-28 10:00:00'
    },
    {
      id: 1002,
      username: 'zhangsan',
      role: '普通用户',
      status: 1,
      createTime: '2026-05-28 11:30:00'
    },
    { id: 1003, username: 'lisi', role: '普通用户', status: 0, createTime: '2026-05-28 14:20:00' }
  ]
  total.value = 3
  loading.value = false
}

const handleSearch = () => {
  queryParams.pageNum = 1
  getList()
}

const handleReset = () => {
  queryFormRef.value?.resetFields()
  handleSearch()
}

const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}

const handleStatusChange = (row: any) => {
  const text = row.status === 1 ? '启用' : '停用'
  ElMessage.success(`已成功${text}用户: ${row.username}`)
}

// --- 弹窗操作逻辑 ---

const resetForm = () => {
  formData.id = undefined
  formData.username = ''
  formData.password = ''
  formData.roleId = undefined
  formData.status = 1
}

const handleAdd = () => {
  resetForm()
  dialogType.value = 'add'
  dialogTitle.value = '新增用户'
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  resetForm()
  dialogType.value = 'edit'
  dialogTitle.value = '编辑用户'
  // 浅拷贝数据到表单
  Object.assign(formData, {
    id: row.id,
    username: row.username,
    roleId: row.role === '超级管理员' ? 1 : 2,
    status: row.status
  })
  dialogVisible.value = true
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确认要删除用户 "${row.username}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElMessage.success('删除成功')
      getList()
    })
    .catch(() => {})
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      // 模拟提交请求
      await new Promise((resolve) => setTimeout(resolve, 800))
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '修改成功')
      submitLoading.value = false
      dialogVisible.value = false
      getList()
    }
  })
}

// 初始化钩子
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
/* 🌟 核心改造：使用 Flex 让容器高度铺满 */
.app-container {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;

  .search-card {
    margin-bottom: 16px;
    flex-shrink: 0; /* 🌟 保护搜索区域，不被表格挤压变形 */

    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }

  .table-card {
    flex: 1; /* 🌟 核心：让表格卡片自动吸满剩下的所有屏幕高度 */
    display: flex;
    flex-direction: column;
    overflow: hidden; /* 防止内容溢出破坏布局 */

    /* 必须穿透 Element Plus 的 card__body，让它也变成 Flex */
    :deep(.el-card__body) {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding-bottom: 0; /* 分页器通常自带间距，底部去 padding 会更紧凑 */
    }

    .toolbar {
      margin-bottom: 16px;
      display: flex;
      justify-content: flex-start;
      flex-shrink: 0;
    }

    /* 🌟 让表格本身铺满，且内部自适应滚动 */
    .el-table {
      flex: 1;
      height: 100%;
    }

    .pagination-container {
      display: flex;
      justify-content: flex-end;
      flex-shrink: 0; /* 保护分页器不被挤压 */
      background-color: #fff; /* 防止表格数据透过去 */
    }
  }
}
</style>
