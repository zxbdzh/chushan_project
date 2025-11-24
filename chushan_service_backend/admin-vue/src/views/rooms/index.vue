<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import service from '@/utils/request'
import { useSearchStore } from '@/stores/search'

// 获取搜索store
const searchStore = useSearchStore()

// 数据列表
const roomsList = ref([])
const loading = ref(false)
const uploadLoading = ref(false)
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)

// 筛选表单
const filterForm = reactive({
  type: '',
  status: ''
})

// 过滤后的房间列表
const filteredRooms = computed(() => {
  let result = roomsList.value

  // 搜索关键词过滤
  if (searchStore.keyword) {
    const keyword = searchStore.keyword.toLowerCase()
    result = result.filter(item => {
      return item.name.toLowerCase().includes(keyword) ||
             item.type.toLowerCase().includes(keyword) ||
             item.description.toLowerCase().includes(keyword)
    })
  }

  // 房间类型过滤
  if (filterForm.type) {
    result = result.filter(item => item.type === filterForm.type)
  }

  // 状态过滤
  if (filterForm.status) {
    result = result.filter(item => item.status === filterForm.status)
  }

  return result
})

// 对话框相关
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'
const formRef = ref(null)

// 表单数据
const roomForm = reactive({
  id: '',
  name: '',
  type: '',
  description: '',
  image: '',
  totalCount: 1,
  availableCount: 1,
  price: 0,
  status: 'active',
  facilities: '',
  area: '',
  maxOccupancy: 1
})

// 查看房间详情数据
const viewRoom = ref({})

// 房间类型选项
const roomTypes = ref([
  { id: 1, label: '单人间', value: '单人间' },
  { id: 2, label: '双人间', value: '双人间' },
  { id: 3, label: '套房', value: '套房' },
  { id: 4, label: '总统套房', value: '总统套房' }
])

// 房间类型管理相关
const roomTypeDialogVisible = ref(false)
const roomTypeFormDialogVisible = ref(false)
const roomTypeDialogType = ref('add') // 'add' 或 'edit'
const roomTypeFormRef = ref(null)
const roomTypeForm = reactive({
  id: '',
  label: '',
  value: ''
})

// 房间类型表单验证规则
const roomTypeRules = {
  label: [
    { required: true, message: '请输入类型名称', trigger: 'blur' },
    { min: 2, max: 20, message: '类型名称长度在2到20个字符之间', trigger: 'blur' }
  ],
  value: [
    { required: true, message: '请输入类型值', trigger: 'blur' },
    { min: 2, max: 20, message: '类型值长度在2到20个字符之间', trigger: 'blur' }
  ]
}

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入房间名称', trigger: 'blur' },
    { min: 2, max: 50, message: '房间名称长度在2到50个字符之间', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择房间类型', trigger: 'change' }
  ],
  totalCount: [
    { required: true, message: '请输入房间总数量', trigger: 'change' },
    { type: 'number', min: 1, message: '房间总数量不能小于1', trigger: 'change' }
  ],
  availableCount: [
    { required: true, message: '请输入可用数量', trigger: 'change' },
    { type: 'number', min: 0, message: '可用数量不能小于0', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入房间价格', trigger: 'change' },
    { type: 'number', min: 0, message: '房间价格不能小于0', trigger: 'change' }
  ],
  maxOccupancy: [
    { required: true, message: '请输入最大容纳人数', trigger: 'change' },
    { type: 'number', min: 1, message: '最大容纳人数不能小于1', trigger: 'change' }
  ]
}

// 获取房间列表数据
const fetchRoomsList = async () => {
  loading.value = true
  try {
    const res = await service.get('/api/rooms/page', {
      params: {
        page: currentPage.value,
        size: pageSize.value
      }
    })
    if (res.code === 200) {
      roomsList.value = res.data.records || []
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res.message || '获取房间列表失败')
    }
  } catch (error) {
    console.error('获取房间列表失败:', error)
    ElMessage.error('获取房间列表失败')
  } finally {
    loading.value = false
  }
}

// 状态类型映射
const getStatusType = (status) => {
  const statusMap = {
    active: 'success',
    inactive: 'danger'
  }
  return statusMap[status] || 'info'
}

// 状态文本映射
const getStatusText = (status) => {
  const statusMap = {
    active: '可用',
    inactive: '不可用'
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
  Object.assign(roomForm, {
    id: '',
    name: '',
    type: '',
    description: '',
    image: '',
    totalCount: 1,
    availableCount: 1,
    price: 0,
    status: 'active',
    facilities: '',
    area: '',
    maxOccupancy: 1
  })
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 处理查看
const handleView = (row) => {
  viewRoom.value = { ...row }
  viewDialogVisible.value = true
}

// 处理编辑
const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.assign(roomForm, { ...row })
  dialogVisible.value = true
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该房间吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await service.delete(`/api/rooms/${row.id}`)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchRoomsList()
      } else {
        ElMessage.error(res.message || '删除失败')
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
          res = await service.post('/api/rooms', roomForm)
        } else {
          res = await service.put(`/api/rooms/${roomForm.id}`, roomForm)
        }

        if (res.code === 200) {
          ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
          dialogVisible.value = false
          fetchRoomsList()
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
  fetchRoomsList()
}

// 重置筛选
const resetFilter = () => {
  Object.assign(filterForm, {
    type: '',
    status: ''
  })
  handleSearch()
}

// 导出数据
const exportData = () => {
  ElMessage.info('导出功能开发中...')
}

// 房间类型管理函数
// 获取房间类型列表
const fetchRoomTypes = async () => {
  try {
    const res = await service.get('/api/room-types')
    if (res.code === 200) {
      roomTypes.value = res.data || []
    } else {
      ElMessage.error(res.message || '获取房间类型失败')
    }
  } catch (error) {
    console.error('获取房间类型失败:', error)
    // 如果接口不存在，使用默认数据
    roomTypes.value = [
      { id: 1, label: '单人间', value: '单人间' },
      { id: 2, label: '双人间', value: '双人间' },
      { id: 3, label: '套房', value: '套房' },
      { id: 4, label: '总统套房', value: '总统套房' }
    ]
  }
}

// 打开房间类型管理对话框
const openRoomTypeManageDialog = () => {
  roomTypeDialogVisible.value = true
}

// 打开房间类型添加对话框
const openAddRoomTypeDialog = () => {
  roomTypeDialogType.value = 'add'
  resetRoomTypeForm()
  roomTypeFormDialogVisible.value = true
}

// 重置房间类型表单
const resetRoomTypeForm = () => {
  Object.assign(roomTypeForm, {
    id: '',
    label: '',
    value: ''
  })
  if (roomTypeFormRef.value) {
    roomTypeFormRef.value.clearValidate()
  }
}

// 处理房间类型编辑
const handleEditRoomType = (row) => {
  roomTypeDialogType.value = 'edit'
  Object.assign(roomTypeForm, { ...row })
  roomTypeFormDialogVisible.value = true
}

// 处理房间类型删除
const handleDeleteRoomType = (row) => {
  ElMessageBox.confirm('确认删除该房间类型吗？删除后相关房间的类型信息可能受影响。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await service.delete(`/api/room-types/${row.id}`)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchRoomTypes()
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      // 如果接口不存在，从本地数组中删除
      const index = roomTypes.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        roomTypes.value.splice(index, 1)
        ElMessage.success('删除成功')
      } else {
        ElMessage.error('删除失败')
      }
    }
  })
}

// 提交房间类型表单
const submitRoomTypeForm = () => {
  if (!roomTypeFormRef.value) return

  roomTypeFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let res
        if (roomTypeDialogType.value === 'add') {
          res = await service.post('/api/room-types', roomTypeForm)
        } else {
          res = await service.put(`/api/room-types/${roomTypeForm.id}`, roomTypeForm)
        }

        if (res.code === 200) {
          ElMessage.success(roomTypeDialogType.value === 'add' ? '添加成功' : '更新成功')
          roomTypeFormDialogVisible.value = false
          fetchRoomTypes()
        } else {
          ElMessage.error(res.message || '操作失败')
        }
      } catch (error) {
        console.error('提交失败:', error)
        // 如果接口不存在，操作本地数组
        if (roomTypeDialogType.value === 'add') {
          const newId = Math.max(...roomTypes.value.map(item => item.id)) + 1
          roomTypes.value.push({
            id: newId,
            label: roomTypeForm.label,
            value: roomTypeForm.value
          })
          ElMessage.success('添加成功')
        } else {
          const index = roomTypes.value.findIndex(item => item.id === roomTypeForm.id)
          if (index > -1) {
            roomTypes.value[index] = { ...roomTypeForm }
            ElMessage.success('更新成功')
          }
        }
        roomTypeFormDialogVisible.value = false
      }
    }
  })
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  fetchRoomsList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchRoomsList()
}

// 处理图片上传
const handleImageChange = async (file) => {
  const isImage = file.raw.type.startsWith('image/')
  const isLt15M = file.raw.size / 1024 / 1024 < 15

  if (!isImage) {
    ElMessage.error('只能上传图片格式的文件!')
    return false
  }
  if (!isLt15M) {
    ElMessage.error('上传图片大小不能超过 15MB!')
    return false
  }

  // 使用 FormData 上传文件到服务器
  const formData = new FormData()
  formData.append('file', file.raw)

  uploadLoading.value = true
  try {
    const res = await service.post('/common/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (res.code === 200) {
      roomForm.image = res.data
      ElMessage.success('图片上传成功')
    } else {
      ElMessage.error(res.message || '图片上传失败')
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error('图片上传失败')
  } finally {
    uploadLoading.value = false
  }
}

// 删除图片
const removeImage = () => {
  roomForm.image = ''
}

// 初始化
onMounted(() => {
  fetchRoomTypes()
  fetchRoomsList()
})
</script>

<template>
  <div class="rooms-container">
    <div class="page-header">
      <h1>房间管理</h1>
      <div class="header-actions">
        <el-button type="success" @click="openRoomTypeManageDialog">管理房间类型</el-button>
        <el-button type="primary" @click="openAddDialog">添加房间</el-button>
        <el-button @click="exportData">导出数据</el-button>
      </div>
    </div>

    <!-- 搜索筛选区域 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="房间类型">
          <el-select v-model="filterForm.type" placeholder="请选择类型" clearable style="width: 150px">
            <el-option
              v-for="type in roomTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="房间状态">
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option label="可用" value="active" />
            <el-option label="不可用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table :data="filteredRooms" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="房间ID" width="80" />
        <el-table-column prop="name" label="房间名称" width="150" show-overflow-tooltip />
        <el-table-column prop="type" label="房间类型" width="100" />
        <el-table-column prop="totalCount" label="总数量" width="80" />
        <el-table-column prop="availableCount" label="可用数量" width="100" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="area" label="面积" width="80" />
        <el-table-column prop="maxOccupancy" label="最大容纳" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看</el-button>
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

    <!-- 添加/编辑房间对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加房间' : '编辑房间'"
      v-model="dialogVisible"
      width="60%"
    >
      <el-form :model="roomForm" label-width="120px" :rules="rules" ref="formRef">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="房间名称" prop="name">
              <el-input v-model="roomForm.name" placeholder="请输入房间名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="房间类型" prop="type">
              <el-select v-model="roomForm.type" placeholder="请选择房间类型">
                <el-option
                  v-for="type in roomTypes"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="总数量" prop="totalCount">
              <el-input-number v-model="roomForm.totalCount" :min="1" :max="100" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可用数量" prop="availableCount">
              <el-input-number v-model="roomForm.availableCount" :min="0" :max="roomForm.totalCount" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="价格" prop="price">
              <el-input-number v-model="roomForm.price" :min="0" :precision="2" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="面积">
              <el-input v-model="roomForm.area" placeholder="如：30㎡" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大容纳" prop="maxOccupancy">
              <el-input-number v-model="roomForm.maxOccupancy" :min="1" :max="10" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select v-model="roomForm.status" placeholder="请选择状态">
                <el-option label="可用" value="active" />
                <el-option label="不可用" value="inactive" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="房间图片">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleImageChange"
            :show-file-list="false"
            accept="image/*"
            :loading="uploadLoading"
          >
            <el-button size="small" type="primary">选择图片</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持 jpg/png 格式，文件大小不超过 15MB
              </div>
            </template>
          </el-upload>
          <div v-if="roomForm.image" class="image-preview">
            <el-image
              :src="roomForm.image"
              fit="cover"
              style="width: 100px; height: 100px; margin-top: 10px;"
            />
            <el-button
              size="small"
              type="danger"
              @click="removeImage"
              style="margin-left: 10px;"
            >
              删除图片
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="房间设施">
          <el-input
            v-model="roomForm.facilities"
            type="textarea"
            :rows="2"
            placeholder="请输入房间设施，如：空调,WiFi,电视,独立卫浴"
          />
        </el-form-item>
        <el-form-item label="房间描述">
          <el-input
            v-model="roomForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入房间描述"
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

    <!-- 查看房间详情对话框 -->
    <el-dialog title="房间详情" v-model="viewDialogVisible" width="50%">
      <div class="room-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="房间ID">{{ viewRoom.id }}</el-descriptions-item>
          <el-descriptions-item label="房间名称">{{ viewRoom.name }}</el-descriptions-item>
          <el-descriptions-item label="房间类型">{{ viewRoom.type }}</el-descriptions-item>
          <el-descriptions-item label="总数量">{{ viewRoom.totalCount }}</el-descriptions-item>
          <el-descriptions-item label="可用数量">{{ viewRoom.availableCount }}</el-descriptions-item>
          <el-descriptions-item label="价格">¥{{ viewRoom.price }}</el-descriptions-item>
          <el-descriptions-item label="面积">{{ viewRoom.area }}</el-descriptions-item>
          <el-descriptions-item label="最大容纳">{{ viewRoom.maxOccupancy }}人</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(viewRoom.status)">{{ getStatusText(viewRoom.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="2">{{ viewRoom.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="更新时间" :span="2">{{ viewRoom.updatedAt }}</el-descriptions-item>
          <el-descriptions-item label="房间设施" :span="2">{{ viewRoom.facilities || '无' }}</el-descriptions-item>
          <el-descriptions-item label="房间描述" :span="2">{{ viewRoom.description || '无' }}</el-descriptions-item>
        </el-descriptions>
        <div v-if="viewRoom.image" class="room-image">
          <el-image :src="viewRoom.image" fit="cover" style="width: 100%; height: 200px; margin-top: 20px;" />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 房间类型管理对话框 -->
    <el-dialog title="房间类型管理" v-model="roomTypeDialogVisible" width="70%">
      <div class="room-type-header">
        <el-button type="primary" @click="openAddRoomTypeDialog">添加房间类型</el-button>
      </div>

      <!-- 房间类型列表 -->
      <el-table :data="roomTypes" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="label" label="类型名称" min-width="120" />
        <el-table-column prop="value" label="类型值" min-width="120" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEditRoomType(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDeleteRoomType(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roomTypeDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加/编辑房间类型对话框 -->
    <el-dialog
      :title="roomTypeDialogType === 'add' ? '添加房间类型' : '编辑房间类型'"
      v-model="roomTypeFormDialogVisible"
      width="40%"
      :close-on-click-modal="false"
    >
      <el-form :model="roomTypeForm" label-width="100px" :rules="roomTypeRules" ref="roomTypeFormRef">
        <el-form-item label="类型名称" prop="label">
          <el-input v-model="roomTypeForm.label" placeholder="请输入类型名称，如：单人间" />
        </el-form-item>
        <el-form-item label="类型值" prop="value">
          <el-input v-model="roomTypeForm.value" placeholder="请输入类型值，如：单人间" />
        </el-form-item>
      </el-form>
      <template #footer>
         <span class="dialog-footer">
           <el-button @click="roomTypeFormDialogVisible = false">取消</el-button>
           <el-button type="primary" @click="submitRoomTypeForm">确定</el-button>
         </span>
       </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.rooms-container {
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

.room-detail {
  padding: 10px 0;
}

.room-image {
  text-align: center;
}

.image-preview {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.upload-demo .el-upload__tip {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
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

/* 房间类型管理样式 */
.room-type-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.room-type-header .el-button {
  margin-left: 10px;
}

/* 房间类型对话框样式优化 */
.el-dialog .el-table {
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.el-dialog .el-table .el-table__header {
  background-color: #f5f7fa;
}

.el-dialog .el-table .el-table__row:hover {
  background-color: #f5f7fa;
}
</style>
