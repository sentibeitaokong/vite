<template>
  <div class="app-container">
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="queryParams" ref="queryFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryParams.roleName"
            placeholder="请输入角色名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="角色标识" prop="roleKey">
          <el-input
            v-model="queryParams.roleKey"
            placeholder="请输入角色标识 (如 admin)"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="角色状态"
            clearable
            style="width: 120px"
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
        <el-button type="primary" icon="Plus" @click="handleAdd">新增角色</el-button>
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
        <el-table-column prop="id" label="角色编号" width="100" align="center" />
        <el-table-column prop="roleName" label="角色名称" width="150" align="center" />
        <el-table-column prop="roleKey" label="权限字符(标识)" width="180" align="center">
          <template #default="scope">
            <el-tag type="warning" effect="plain">{{ scope.row.roleKey }}</el-tag>
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
        <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="180" align="center" />

        <el-table-column label="操作" width="260" align="center" fixed="right">
          <template #default="scope">
            <el-button type="primary" link icon="Edit" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button type="success" link icon="CircleCheck" @click="handleMenuScope(scope.row)"
              >分配权限</el-button
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
          :page-sizes="[10, 20, 50]"
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
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <template #label>
            <span>
              权限字符
              <el-tooltip
                content="控制器中定义的权限字符，如：@PreAuthorize(`hasRole('admin')`)"
                placement="top"
              >
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="formData.roleKey" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="角色状态">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
      </template>
    </el-dialog>

    <el-drawer
      v-model="menuDrawerVisible"
      :title="`分配菜单权限 - ${currentRoleName}`"
      size="400px"
    >
      <div class="tree-wrapper">
        <el-tree
          ref="menuTreeRef"
          :data="menuOptions"
          show-checkbox
          node-key="id"
          :props="{ label: 'title', children: 'children' }"
          :default-checked-keys="checkedMenuKeys"
          :default-expand-all="true"
        />
      </div>
      <template #footer>
        <div style="flex: auto; text-align: right">
          <el-button @click="menuDrawerVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitMenuScope" :loading="menuLoading"
            >保 存</el-button
          >
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, ElTree } from 'element-plus'

// 🌟 必须与路由配置中的 name 一致，否则 TagsView 缓存不生效
defineOptions({
  name: 'RoleManage'
})

// --- 表格与搜索状态 ---
const queryFormRef = ref<FormInstance>()
const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)
const multipleSelection = ref<any[]>([])

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  roleName: '',
  roleKey: '',
  status: undefined
})

// --- 基础表单弹窗状态 ---
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const submitLoading = ref(false)

const formData = reactive({
  id: undefined,
  roleName: '',
  roleKey: '',
  status: 1,
  remark: ''
})

const formRules = reactive<FormRules>({
  roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  roleKey: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }]
})

// --- 🌟 权限树抽屉状态 ---
const menuDrawerVisible = ref(false)
const menuLoading = ref(false)
const currentRoleName = ref('')
const menuTreeRef = ref<InstanceType<typeof ElTree>>()
const menuOptions = ref<any[]>([]) // 树形菜单数据
const checkedMenuKeys = ref<number[]>([]) // 默认勾选的节点

// --- 核心业务逻辑 ---

const getList = async () => {
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 500))
  tableData.value = [
    {
      id: 1,
      roleName: '超级管理员',
      roleKey: 'super-admin',
      status: 1,
      remark: '拥有所有权限',
      createTime: '2026-01-01 00:00:00'
    },
    {
      id: 2,
      roleName: '系统管理员',
      roleKey: 'admin',
      status: 1,
      remark: '系统日常维护',
      createTime: '2026-05-15 10:20:00'
    },
    {
      id: 3,
      roleName: '普通访客',
      roleKey: 'guest',
      status: 0,
      remark: '仅查看权限',
      createTime: '2026-05-28 09:00:00'
    }
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
  ElMessage.success(`已成功${text}角色: ${row.roleName}`)
}

// --- 基础 CRUD ---

const resetForm = () => {
  formData.id = undefined
  formData.roleName = ''
  formData.roleKey = ''
  formData.status = 1
  formData.remark = ''
}

const handleAdd = () => {
  resetForm()
  dialogType.value = 'add'
  dialogTitle.value = '新增角色'
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  resetForm()
  dialogType.value = 'edit'
  dialogTitle.value = '编辑角色'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      await new Promise((resolve) => setTimeout(resolve, 800))
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '修改成功')
      submitLoading.value = false
      dialogVisible.value = false
      getList()
    }
  })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确认要删除角色 "${row.roleName}" 吗？该操作不可逆！`, '危险操作', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'error' // 标红提示危险性
  })
    .then(() => {
      ElMessage.success('删除成功')
      getList()
    })
    .catch(() => {})
}

// --- 🌟 权限分配逻辑 ---

// 模拟获取全量路由菜单树
const getMenuTreeData = () => {
  return [
    {
      id: 1,
      title: '主页',
      children: [{ id: 101, title: '控制台' }]
    },
    {
      id: 2,
      title: '系统管理',
      children: [
        { id: 201, title: '用户管理' },
        { id: 202, title: '角色管理' },
        { id: 203, title: '菜单管理' }
      ]
    }
  ]
}

const handleMenuScope = async (row: any) => {
  currentRoleName.value = row.roleName
  // 1. 获取完整的树结构
  menuOptions.value = getMenuTreeData()

  // 2. 模拟从后端获取该角色已经拥有的权限ID (比如 admin 拥有全部，guest 只有控制台)
  if (row.roleKey === 'super-admin') {
    checkedMenuKeys.value = [101, 201, 202, 203]
  } else {
    checkedMenuKeys.value = [101] // 仅控制台
  }

  menuDrawerVisible.value = true
}

const submitMenuScope = async () => {
  if (!menuTreeRef.value) return

  menuLoading.value = true

  // 🌟 架构师核心知识点：
  // 提交给后端的菜单权限，必须包含【全选中的子节点】和【半选中的父节点】
  const checkedKeys = menuTreeRef.value.getCheckedKeys()
  const halfCheckedKeys = menuTreeRef.value.getHalfCheckedKeys()
  const finalKeys = [...checkedKeys, ...halfCheckedKeys]

  console.log('即将提交给后端的权限集合:', finalKeys)

  await new Promise((resolve) => setTimeout(resolve, 800))
  ElMessage.success('权限分配成功')
  menuLoading.value = false
  menuDrawerVisible.value = false
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;

  .search-card {
    margin-bottom: 16px;
    :deep(.el-form-item) {
      margin-bottom: 0;
    }

    /* 问号小提示样式对齐 */
    .el-icon {
      margin-left: 4px;
      color: #909399;
      cursor: pointer;
    }
  }

  .table-card {
    .toolbar {
      margin-bottom: 16px;
      display: flex;
    }
    .pagination-container {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }

  /* 树形组件容器稍微加点内边距，更美观 */
  .tree-wrapper {
    padding: 0 10px;
  }
}
</style>
