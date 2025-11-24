<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import service from '@/utils/request'
import { useSearchStore } from '@/stores/search'

// 获取搜索store
const searchStore = useSearchStore()

// 数据列表
const reservationsList = ref([])
const roomsList = ref([])
const loading = ref(false)
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)

// 筛选表单
const filterForm = reactive({
  phoneNumber: '',
  status: '',
  roomType: '',
  dateRange: []
})

// 获取唯一的房间类型列表
const uniqueRoomTypes = computed(() => {
  const types = roomsList.value.map(item => item.type).filter(Boolean)
  return [...new Set(types)]
})

// 过滤后的预约列表
const filteredReservations = computed(() => {
  let result = reservationsList.value

  // 搜索关键词过滤
  if (searchStore.keyword) {
    const keyword = searchStore.keyword.toLowerCase()
    result = result.filter(item => {
      return item.customerName.toLowerCase().includes(keyword) ||
             item.phoneNumber.includes(keyword) ||
             item.roomName.toLowerCase().includes(keyword)

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

  // 房间类型过滤
  if (filterForm.roomType) {
    result = result.filter(item => item.roomType === filterForm.roomType)
  }

  // 日期范围过滤
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    const [startDate, endDate] = filterForm.dateRange
    result = result.filter(item => {
      return item.reservationDate >= startDate && item.reservationDate <= endDate
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
const reservationForm = reactive({
  id: '',
  roomId: '',
  roomName: '',
  roomType: '',
  customerName: '',
  phoneNumber: '',

  reservationDate: '',
  checkInTime: '',
  checkOutTime: '',
  roomCount: 1,
  totalPrice: 0,
  notes: ''
})

// 查看预约详情数据
const viewReservation = ref({})

// 表单验证规则
const rules = {
  roomId: [
    { required: true, message: '请选择房间', trigger: 'change' }
  ],
  customerName: [
    { required: true, message: '请输入预约人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2到20个字符之间', trigger: 'blur' }
  ],
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],

  reservationDate: [
    { required: true, message: '请选择预约日期', trigger: 'change' }
  ],
  checkInTime: [
    { required: true, message: '请选择入住时间', trigger: 'change' }
  ],
  checkOutTime: [
    { required: true, message: '请选择退房时间', trigger: 'change' }
  ],
  roomCount: [
    { required: true, message: '请输入预约房间数量', trigger: 'change' }
  ]
}

// 获取预约列表数据
const fetchReservationsList = async () => {
  loading.value = true
  try {
    const res = await service.get('/api/room-reservations/page', {
      params: {
        page: currentPage.value,
        size: pageSize.value
      }
    })
    if (res.code === 200) {
      reservationsList.value = res.data.records || []
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res.message || '获取预约列表失败')
    }
  } catch (error) {
    console.error('获取预约列表失败:', error)
    ElMessage.error('获取预约列表失败')
  } finally {
    loading.value = false
  }
}

// 获取房间列表
const fetchRoomsList = async () => {
  try {
    const res = await service.get('/api/rooms/list')
    if (res.code === 200) {
      roomsList.value = res.data || []
    }
  } catch (error) {
    console.error('获取房间列表失败:', error)
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
  Object.assign(reservationForm, {
    id: '',
    roomId: '',
    roomName: '',
    roomType: '',
    customerName: '',
    phoneNumber: '',

    reservationDate: '',
    checkInTime: '',
    checkOutTime: '',
    roomCount: 1,
    totalPrice: 0,
    notes: ''
  })
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 处理房间选择
const handleRoomChange = (roomId) => {
  const room = roomsList.value.find(item => item.id === roomId)
  if (room) {
    reservationForm.roomName = room.name
    reservationForm.roomType = room.type
    // 计算总价格
    reservationForm.totalPrice = room.price * reservationForm.roomCount
  }
}

// 处理房间数量变化
const handleRoomCountChange = () => {
  const room = roomsList.value.find(item => item.id === reservationForm.roomId)
  if (room) {
    reservationForm.totalPrice = room.price * reservationForm.roomCount
  }
}

// 身份证校验已移至后端处理，前端不再进行校验

// 处理查看
const handleView = (row) => {
  viewReservation.value = { ...row }
  viewDialogVisible.value = true
}

// 处理编辑
const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.assign(reservationForm, { ...row })
  dialogVisible.value = true
}

// 处理确认预约
const handleConfirm = async (row) => {
  try {
    const res = await service.put(`/api/room-reservations/${row.id}/confirm`)
    if (res.code === 200) {
      ElMessage.success('预约确认成功')
      fetchReservationsList()
    } else {
      ElMessage.error(res.message || '确认失败')
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
      const res = await service.put(`/api/room-reservations/${row.id}/cancel`)
      if (res.code === 200) {
        ElMessage.success('预约取消成功')
        fetchReservationsList()
      } else {
        ElMessage.error(res.message || '取消失败')
      }
    } catch (error) {
      console.error('取消预约失败:', error)
      ElMessage.error('取消预约失败')
    }
  })
}

// 处理完成预约
const handleComplete = async (row) => {
  try {
    const res = await service.put(`/api/room-reservations/${row.id}/complete`)
    if (res.code === 200) {
      ElMessage.success('预约完成')
      fetchReservationsList()
    } else {
      ElMessage.error(res.message || '操作失败')
    }
  } catch (error) {
    console.error('完成预约失败:', error)
    ElMessage.error('完成预约失败')
  }
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return

  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let res
        if (dialogType.value === 'add') {
          res = await service.post('/api/room-reservations', reservationForm)
        } else {
          res = await service.put(`/api/room-reservations/${reservationForm.id}`, reservationForm)
        }

        if (res.code === 200) {
          ElMessage.success(dialogType.value === 'add' ? '预约成功' : '更新成功')
          dialogVisible.value = false
          fetchReservationsList()
        } else {
          ElMessage.error(res.message || '操作失败')
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
  fetchReservationsList()
}

// 重置筛选
const resetFilter = () => {
  Object.assign(filterForm, {
    phoneNumber: '',
    status: '',
    roomType: '',
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
  fetchReservationsList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchReservationsList()
}

// 初始化
onMounted(() => {
  fetchReservationsList()
  fetchRoomsList()
})
</script>

<template>
  <div class="reservations-container">
    <div class="page-header">
      <h1>房间预约管理</h1>
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
        <el-form-item label="房间类型">
          <el-select v-model="filterForm.roomType" placeholder="请选择房间类型" clearable style="width: 150px">
            <el-option
              v-for="roomType in uniqueRoomTypes"
              :key="roomType"
              :label="roomType"
              :value="roomType"
            />
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
      <el-table :data="filteredReservations" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="预约ID" width="80" />
        <el-table-column prop="customerName" label="预约人" width="100" />
        <el-table-column prop="phoneNumber" label="手机号" width="120" />

        <el-table-column prop="roomName" label="房间名称" width="120" show-overflow-tooltip />
        <el-table-column prop="roomType" label="房间类型" width="100" />
        <el-table-column prop="reservationDate" label="预约日期" width="120" />
        <el-table-column prop="roomCount" label="房间数量" width="100" />
        <el-table-column prop="totalPrice" label="总价格" width="100">
          <template #default="scope">
            ¥{{ scope.row.totalPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="280" fixed="right">
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
            <el-button
              size="small"
              type="info"
              @click="handleComplete(scope.row)"
              v-if="scope.row.status === 'confirmed'"
            >
              完成
            </el-button>
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
      width="60%"
    >
      <el-form :model="reservationForm" label-width="120px" :rules="rules" ref="formRef">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预约人姓名" prop="customerName">
              <el-input v-model="reservationForm.customerName" placeholder="请输入预约人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phoneNumber">
              <el-input v-model="reservationForm.phoneNumber" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="房间" prop="roomId">
              <el-select v-model="reservationForm.roomId" placeholder="请选择房间" @change="handleRoomChange">
                <el-option
                  v-for="room in roomsList"
                  :key="room.id"
                  :label="`${room.name} (${room.type}) - ¥${room.price}`"
                  :value="room.id"
                  :disabled="room.availableCount <= 0"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预约日期" prop="reservationDate">
              <el-date-picker
                v-model="reservationForm.reservationDate"
                type="date"
                placeholder="请选择预约日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="入住时间" prop="checkInTime">
              <el-time-picker
                v-model="reservationForm.checkInTime"
                placeholder="请选择入住时间"
                format="HH:mm:ss"
                value-format="HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退房时间" prop="checkOutTime">
              <el-time-picker
                v-model="reservationForm.checkOutTime"
                placeholder="请选择退房时间"
                format="HH:mm:ss"
                value-format="HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="房间数量" prop="roomCount">
              <el-input-number v-model="reservationForm.roomCount" :min="1" :max="10" @change="handleRoomCountChange" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="总价格">
          <el-input v-model="reservationForm.totalPrice" disabled>
            <template #prepend>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="reservationForm.notes"
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
    <el-dialog title="预约详情" v-model="viewDialogVisible" width="50%">
      <div class="reservation-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="预约ID">{{ viewReservation.id }}</el-descriptions-item>
          <el-descriptions-item label="预约人">{{ viewReservation.customerName }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ viewReservation.phoneNumber }}</el-descriptions-item>

          <el-descriptions-item label="房间名称">{{ viewReservation.roomName }}</el-descriptions-item>
          <el-descriptions-item label="房间类型">{{ viewReservation.roomType }}</el-descriptions-item>
          <el-descriptions-item label="预约日期">{{ viewReservation.reservationDate }}</el-descriptions-item>
          <el-descriptions-item label="入住时间">{{ viewReservation.checkInTime }}</el-descriptions-item>
          <el-descriptions-item label="退房时间">{{ viewReservation.checkOutTime }}</el-descriptions-item>
          <el-descriptions-item label="房间数量">{{ viewReservation.roomCount }}</el-descriptions-item>
          <el-descriptions-item label="总价格">¥{{ viewReservation.totalPrice }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(viewReservation.status)">{{ getStatusText(viewReservation.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="2">{{ viewReservation.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="更新时间" :span="2">{{ viewReservation.updatedAt }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ viewReservation.notes || '无' }}</el-descriptions-item>
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
.reservations-container {
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

.reservation-detail {
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
