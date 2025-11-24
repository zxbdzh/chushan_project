<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import service from '@/utils/request'
import { useSearchStore } from '@/stores/search'

// 获取搜索store
const searchStore = useSearchStore()

// 数据列表
const appointmentsList = ref([])
const scenicList = ref([])
const loading = ref(false)
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)

// 筛选表单
const filterForm = reactive({
  phoneNumber: '',
  status: '',
  dateRange: []
})

// 过滤后的预约列表
const filteredAppointments = computed(() => {
  let result = appointmentsList.value

  // 搜索关键词过滤
  if (searchStore.keyword) {
    const keyword = searchStore.keyword.toLowerCase()
    result = result.filter(item => {
      return item.name.toLowerCase().includes(keyword) ||
             item.phoneNumber.includes(keyword) ||
             item.scenicName.toLowerCase().includes(keyword)
    })
  }

  // 手机号过滤
  if (filterForm.phoneNumber) {
    result = result.filter(item => item.phoneNumber.includes(filterForm.phoneNumber))
  }

  // 状态过滤
  if (filterForm.status) {
    result = result.filter(item => item.status === filterForm.status)
  }

  // 日期范围过滤
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    const [startDate, endDate] = filterForm.dateRange
    result = result.filter(item => {
      return item.appointmentDate >= startDate && item.appointmentDate <= endDate
    })
  }

  return result
})

// 对话框相关
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'
const formRef = ref(null)

// 表单数据
const appointmentForm = reactive({
  id: '',
  phoneNumber: '',
  name: '',
  scenicId: '',
  scenicName: '',
  appointmentDate: '',
  appointmentTime: '',
  visitorCount: 1,
  notes: ''
})

// 查看预约详情数据
const viewAppointment = ref({})

// 表单验证规则
const rules = {
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入预约人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2到20个字符之间', trigger: 'blur' }
  ],
  scenicId: [
    { required: true, message: '请选择景点', trigger: 'change' }
  ],
  appointmentDate: [
    { required: true, message: '请选择预约日期', trigger: 'change' }
  ],
  appointmentTime: [
    { required: true, message: '请选择预约时间', trigger: 'change' }
  ],
  visitorCount: [
    { required: true, message: '请输入预约人数', trigger: 'change' }
  ]
}

// 获取预约列表数据
const fetchAppointmentsList = async () => {
  loading.value = true
  try {
    const res = await service.get('/appointments/page', {
      params: {
        page: currentPage.value,
        size: pageSize.value
      }
    })
    if (res.code === 200) {
      appointmentsList.value = res.data.records || []
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res.msg || '获取预约列表失败')
    }
  } catch (error) {
    console.error('获取预约列表失败:', error)
    ElMessage.error('获取预约列表失败')
  } finally {
    loading.value = false
  }
}

// 获取景点列表
const fetchScenicList = async () => {
  try {
    const res = await service.get('/tourism/type', {
      params: {
        type: 'scenic'
      }
    })
    if (res.code === 200) {
      scenicList.value = res.data.records || res.data || []
    }
  } catch (error) {
    console.error('获取景点列表失败:', error)
  }
}

// 状态类型映射
const getStatusType = (status) => {
  const statusMap = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'danger',
    completed: 'info'
  }
  return statusMap[status] || 'info'
}

// 状态文本映射
const getStatusText = (status) => {
  const statusMap = {
    pending: '待确认',
    confirmed: '已确认',
    cancelled: '已取消',
    completed: '已完成'
  }
  return statusMap[status] || status
}

// 打开添加对话框
const openAddDialog = () => {
  dialogType.value = 'add'
  resetForm()
  dialogVisible.value = true
}

// 重置表单
const resetForm = () => {
  Object.assign(appointmentForm, {
    id: '',
    phoneNumber: '',
    name: '',
    scenicId: '',
    scenicName: '',
    appointmentDate: '',
    appointmentTime: '',
    visitorCount: 1,
    notes: ''
  })
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 处理景点选择
const handleScenicChange = (scenicId) => {
  const scenic = scenicList.value.find(item => item.id === scenicId)
  if (scenic) {
    appointmentForm.scenicName = scenic.name
  }
}

// 处理查看
const handleView = (row) => {
  viewAppointment.value = { ...row }
  viewDialogVisible.value = true
}

// 处理编辑
const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.assign(appointmentForm, { ...row })
  dialogVisible.value = true
}

// 处理确认预约
const handleConfirm = async (row) => {
  try {
    const res = await service.put(`/appointments/${row.id}/status?status=confirmed`)
    if (res.code === 200) {
      ElMessage.success('预约确认成功')
      fetchAppointmentsList()
    } else {
      ElMessage.error(res.msg || '确认失败')
    }
  } catch (error) {
    console.error('确认预约失败:', error)
    ElMessage.error('确认预约失败')
  }
}

// 处理取消预约
const handleCancel = async (row) => {
  ElMessageBox.confirm('确认取消该预约吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await service.put(`/appointments/${row.id}/cancel?phoneNumber=${row.phoneNumber}`)
      if (res.code === 200) {
        ElMessage.success('预约取消成功')
        fetchAppointmentsList()
      } else {
        ElMessage.error(res.msg || '取消失败')
      }
    } catch (error) {
      console.error('取消预约失败:', error)
      ElMessage.error('取消预约失败')
    }
  })
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该预约记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await service.delete(`/appointments/${row.id}`)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchAppointmentsList()
      } else {
        ElMessage.error(res.msg || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  })
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return

  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let res
        if (dialogType.value === 'add') {
          res = await service.post('/appointments', appointmentForm)
        } else {
          res = await service.put(`/appointments/${appointmentForm.id}`, appointmentForm)
        }

        if (res.code === 200) {
          ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
          dialogVisible.value = false
          fetchAppointmentsList()
        } else {
          ElMessage.error(res.msg || '操作失败')
        }
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('操作失败')
      }
    }
  })
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchAppointmentsList()
}

// 重置筛选
const resetFilter = () => {
  Object.assign(filterForm, {
    phoneNumber: '',
    status: '',
    dateRange: []
  })
  handleSearch()
}

// 导出数据
const exportData = () => {
  ElMessage.info('导出功能开发中...')
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  fetchAppointmentsList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchAppointmentsList()
}

// 初始化
onMounted(() => {
  fetchAppointmentsList()
  fetchScenicList()
})
</script>

<template>
  <div class="appointments-container">
    <div class="page-header">
      <h1>预约管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="openAddDialog">添加预约</el-button>
        <el-button @click="exportData">导出数据</el-button>
      </div>
    </div>

    <!-- 搜索筛选区域 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="手机号">
          <el-input v-model="filterForm.phoneNumber" placeholder="请输入手机号" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="预约状态">
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option label="待确认" value="pending" />
            <el-option label="已确认" value="confirmed" />
            <el-option label="已取消" value="cancelled" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item label="预约日期">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 280px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table :data="filteredAppointments" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="预约ID" width="80" />
        <el-table-column prop="phoneNumber" label="手机号" width="120" />
        <el-table-column prop="name" label="预约人" width="100" />
        <el-table-column prop="scenicName" label="景点名称" width="150" show-overflow-tooltip />
        <el-table-column prop="appointmentDate" label="预约日期" width="120" />
        <el-table-column prop="appointmentTime" label="预约时间" width="100" />
        <el-table-column prop="visitorCount" label="预约人数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="small"
              type="success"
              @click="handleConfirm(scope.row)"
              v-if="scope.row.status === 'pending'"
            >
              确认
            </el-button>
            <el-button
              size="small"
              type="warning"
              @click="handleCancel(scope.row)"
              v-if="['pending', 'confirmed'].includes(scope.row.status)"
            >
              取消
            </el-button>
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

    <!-- 添加/编辑预约对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加预约' : '编辑预约'"
      v-model="dialogVisible"
      width="50%"
    >
      <el-form :model="appointmentForm" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="appointmentForm.phoneNumber" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="预约人姓名" prop="name">
          <el-input v-model="appointmentForm.name" placeholder="请输入预约人姓名" />
        </el-form-item>
        <el-form-item label="景点" prop="scenicId">
          <el-select v-model="appointmentForm.scenicId" placeholder="请选择景点" @change="handleScenicChange">
            <el-option
              v-for="scenic in scenicList"
              :key="scenic.id"
              :label="scenic.name"
              :value="scenic.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="预约日期" prop="appointmentDate">
          <el-date-picker
            v-model="appointmentForm.appointmentDate"
            type="date"
            placeholder="请选择预约日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="预约时间" prop="appointmentTime">
          <el-time-picker
            v-model="appointmentForm.appointmentTime"
            placeholder="请选择预约时间"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="预约人数" prop="visitorCount">
          <el-input-number v-model="appointmentForm.visitorCount" :min="1" :max="50" />
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input
            v-model="appointmentForm.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看预约详情对话框 -->
    <el-dialog title="预约详情" v-model="viewDialogVisible" width="40%">
      <div class="appointment-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="预约ID">{{ viewAppointment.id }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ viewAppointment.phoneNumber }}</el-descriptions-item>
          <el-descriptions-item label="预约人">{{ viewAppointment.name }}</el-descriptions-item>
          <el-descriptions-item label="景点名称">{{ viewAppointment.scenicName }}</el-descriptions-item>
          <el-descriptions-item label="预约日期">{{ viewAppointment.appointmentDate }}</el-descriptions-item>
          <el-descriptions-item label="预约时间">{{ viewAppointment.appointmentTime }}</el-descriptions-item>
          <el-descriptions-item label="预约人数">{{ viewAppointment.visitorCount }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(viewAppointment.status)">{{ getStatusText(viewAppointment.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="2">{{ viewAppointment.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="更新时间" :span="2">{{ viewAppointment.updatedAt }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ viewAppointment.notes || '无' }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>


<style scoped>
.appointments-container {
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
  color: var(--el-text-color-primary);
  font-size: 24px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-card .el-form {
  margin-bottom: 0;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.filter-form .el-form-item {
  margin-bottom: 10px;
  margin-right: 0;
}

.table-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.appointment-detail {
  padding: 10px 0;
}

.el-descriptions {
  margin-top: 20px;
}

.el-table {
  font-size: 14px;
}

.el-table .el-table__cell {
  padding: 12px 0;
}

.el-tag {
  font-weight: 500;
}

.el-button + .el-button {
  margin-left: 8px;
}

.el-form-item {
  margin-bottom: 18px;
}

.el-input-number {
  width: 100%;
}

.el-select {
  width: 100%;
}

.el-date-editor {
  width: 100%;
}

.el-time-picker {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .el-table {
    font-size: 12px;
  }

  .el-dialog {
    width: 90% !important;
  }
}

/* 状态标签样式优化 */
.el-tag.el-tag--warning {
  background-color: #fdf6ec;
  border-color: #f5dab1;
  color: #e6a23c;
}

.el-tag.el-tag--success {
  background-color: #f0f9ff;
  border-color: #b3d8ff;
  color: #67c23a;
}

.el-tag.el-tag--danger {
  background-color: #fef0f0;
  border-color: #fbc4c4;
  color: #f56c6c;
}

.el-tag.el-tag--info {
  background-color: #f4f4f5;
  border-color: #d3d4d6;
  color: #909399;
}
</style>
