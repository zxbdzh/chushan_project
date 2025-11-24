<template>
  <div class="users-container">
    <div class="page-header">
      <h1>用户管理</h1>
      <el-button type="primary" @click="openAddDialog">添加用户</el-button>
    </div>

    <el-card class="table-card">
      <el-table :data="usersList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'primary'">
              {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
              {{ scope.row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      v-model="dialogVisible"
      width="50%"
    >
      <el-form :model="userForm" label-width="80px" :rules="rules" ref="formRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option value="admin" label="管理员" />
            <el-option value="user" label="普通用户" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="userForm.status" placeholder="请选择状态">
            <el-option :value="1" label="正常" />
            <el-option :value="0" label="禁用" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表格数据
const usersList = ref([])
const loading = ref(false)
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'
const formRef = ref(null)

// 表单数据
const userForm = reactive({
  id: '',
  username: '',
  nickname: '',
  email: '',
  phone: '',
  password: '',
  role: 'user',
  registerTime: '',
  status: 1
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20个字符之间', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur', validator: (rule, value, callback) => {
      if (dialogType.value === 'add' && !value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }},
    { min: 6, max: 20, message: '密码长度在6到20个字符之间', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 获取用户列表数据
const fetchUsersList = async () => {
  loading.value = true
  try {
    // 模拟API请求
    setTimeout(() => {
      usersList.value = [
        {
          id: 1,
          username: 'admin',
          nickname: '系统管理员',
          email: 'admin@example.com',
          phone: '13800138000',
          role: 'admin',
          registerTime: '2023-01-01 10:00:00',
          status: 1
        },
        {
          id: 2,
          username: 'zhangsan',
          nickname: '张三',
          email: 'zhangsan@example.com',
          phone: '13800138001',
          role: 'user',
          registerTime: '2023-02-15 14:30:00',
          status: 1
        },
        {
          id: 3,
          username: 'lisi',
          nickname: '李四',
          email: 'lisi@example.com',
          phone: '13800138002',
          role: 'user',
          registerTime: '2023-03-20 09:15:00',
          status: 0
        }
      ]
      total.value = 3
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取用户列表失败:', error)
    loading.value = false
  }
}

// 打开添加对话框
const openAddDialog = () => {
  dialogType.value = 'add'
  resetForm()
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.assign(userForm, row)
  // 不显示密码
  userForm.password = ''
  dialogVisible.value = true
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除用户"${row.username}"吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      // 模拟删除操作
      const index = usersList.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        usersList.value.splice(index, 1)
        total.value--
        ElMessage.success('删除成功')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        // 模拟添加操作
        const newUser = {
          ...userForm,
          id: usersList.value.length + 1,
          registerTime: new Date().toLocaleString()
        }
        usersList.value.unshift(newUser)
        total.value++
        ElMessage.success('添加成功')
      } else {
        // 模拟编辑操作
        const index = usersList.value.findIndex(item => item.id === userForm.id)
        if (index !== -1) {
          usersList.value[index] = { ...userForm }
          ElMessage.success('编辑成功')
        }
      }
      dialogVisible.value = false
    } else {
      return false
    }
  })
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  userForm.id = ''
  userForm.username = ''
  userForm.nickname = ''
  userForm.email = ''
  userForm.phone = ''
  userForm.password = ''
  userForm.role = 'user'
  userForm.registerTime = ''
  userForm.status = 1
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchUsersList()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchUsersList()
}

onMounted(() => {
  fetchUsersList()
})
</script>

<style scoped>
.users-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: var(--color-text);
}

.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>