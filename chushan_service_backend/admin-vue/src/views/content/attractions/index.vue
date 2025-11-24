<template>
  <div class="attractions-container">
    <div class="page-header">
      <h1>景点管理</h1>
      <el-button type="primary" @click="openAddDialog">添加景点</el-button>
    </div>

    <el-card class="table-card">
      <el-table :data="filteredAttractions" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="name" label="景点名称" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column label="图片" width="120">
          <template #default="scope">
            <el-image
              style="width: 80px; height: 50px"
              :src="scope.row.image"
              fit="cover"
              :preview-src-list="[scope.row.image]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="reservationDays" label="预约天数" width="100" />
        <el-table-column prop="reservationCount" label="预约数量" width="100" />
        <el-table-column prop="score" label="评分" width="80" />
        <el-table-column prop="visitCount" label="访问量" width="100" />
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

    <!-- 添加/编辑景点对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加景点' : '编辑景点'"
      v-model="dialogVisible"
      width="50%"
    >
      <el-form :model="attractionForm" label-width="80px" :rules="rules" ref="formRef">
        <el-form-item label="类型" prop="type">
          <el-input v-model="attractionForm.type" placeholder="请输入景点类型" disabled value="scenic" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="attractionForm.name" placeholder="请输入景点名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="attractionForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入景点描述"
          />
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <div class="upload-container">
            <el-upload
              class="image-uploader"
              action="#"
              :http-request="uploadImage"
              :show-file-list="false"
              :before-upload="beforeImageUpload">
              <img v-if="attractionForm.image" :src="attractionForm.image" class="preview-image" />
              <el-icon v-else class="upload-icon"><Plus /></el-icon>
            </el-upload>
            <div class="image-url" v-if="attractionForm.image">
              <el-input v-model="attractionForm.image" placeholder="图片URL" readonly />
              <el-button type="danger" size="small" @click="clearImage">清除</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="预约天数" prop="reservationDays">
          <el-input-number v-model="attractionForm.reservationDays" :min="0" :step="1" />
        </el-form-item>
        <el-form-item label="预约数量" prop="reservationCount">
          <el-input-number v-model="attractionForm.reservationCount" :min="0" :step="1" />
        </el-form-item>
        <el-form-item label="评分" prop="score">
          <el-rate v-model="attractionForm.score" :max="5" :allow-half="true" />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select v-model="attractionForm.tags" multiple placeholder="请选择标签">
            <el-option value="红色教育" label="红色教育" />
            <el-option value="党建基地" label="党建基地" />
            <el-option value="振兴乡村" label="振兴乡村" />
            <el-option value="自然风光" label="自然风光" />
            <el-option value="历史文化" label="历史文化" />
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
import { ref, reactive, onMounted, inject, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import service from '@/utils/request'
import { useSearchStore } from '@/stores/search'

// 表格数据
// 获取搜索store
const searchStore = useSearchStore()

// 数据列表
const attractionsList = ref([])
const loading = ref(false)
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)

// 过滤后的列表数据
const filteredAttractions = computed(() => {
  if (!searchStore.keyword) return attractionsList.value
  const keyword = searchStore.keyword.toLowerCase()
  return attractionsList.value.filter(item => {
    return item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
  })
})
// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'
const formRef = ref(null)

// 表单数据
const attractionForm = reactive({
  id: '',
  type: 'scenic',
  name: '',
  description: '',
  image: '',
  reservationDays: 7,
  reservationCount: 100,
  score: 4.5,
  visitCount: '0',
  tags: []
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入景点名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度在2到50个字符之间', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入景点描述', trigger: 'blur' }
  ],
  image: [
    { required: true, message: '请上传图片', trigger: 'blur' }
  ],
  reservationDays: [
    { required: true, message: '请输入预约天数', trigger: 'change' }
  ],
  reservationCount: [
    { required: true, message: '请输入预约数量', trigger: 'change' }
  ],
  score: [
    { required: true, message: '请输入评分', trigger: 'change' }
  ],
  tags: [
    { required: true, message: '请选择标签', trigger: 'change' }
  ]
}

// 获取景点列表数据
const fetchAttractionsList = async () => {
  loading.value = true
  try {
    const res = await service.get('/tourism/type', {
      params: {
        type: 'scenic',
        page: currentPage.value,
        size: pageSize.value
      }
    })
    if (res.code === 200) {
      attractionsList.value = res.data.records || []
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res.msg || '获取景点列表失败')
    }
  } catch (error) {
    console.error('获取景点列表失败:', error)
    ElMessage.error('获取景点列表失败')
  } finally {
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
  // 深拷贝行数据
  const rowData = JSON.parse(JSON.stringify(row))

  // 如果tags是字符串，则解析为数组
  if (typeof rowData.tags === 'string') {
    try {
      rowData.tags = JSON.parse(rowData.tags)
    } catch (e) {
      console.error('解析tags失败:', e)
      rowData.tags = []
    }
  }

  Object.assign(attractionForm, rowData)
  dialogVisible.value = true
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除"${row.name}"景点吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        const res = await service.delete(`/tourism/${row.id}`, {
          params: {
            type: 'scenic'
          }
        })
        if (res.code === 200) {
          ElMessage.success('删除成功')
          fetchAttractionsList()
        } else {
          ElMessage.error(res.msg || '删除失败')
        }
      } catch (error) {
        console.error('删除景点失败:', error)
        ElMessage.error('删除景点失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 图片上传前的验证
const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传文件只能是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 上传图片
const uploadImage = async (options) => {
  try {
    const { file } = options
    const formData = new FormData()
    formData.append('file', file)

    const res = await service.post('/common/upload', formData)
    if (res.code === 200) {
      attractionForm.image = res.data
      ElMessage.success('图片上传成功')
    } else {
      ElMessage.error(res.msg || '图片上传失败')
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error('图片上传失败')
  }
}

// 清除图片
const clearImage = () => {
  attractionForm.image = ''
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 创建一个新对象用于提交，避免修改原始表单数据
        const submitData = JSON.parse(JSON.stringify(attractionForm))

        // 确保tags字段是JSON字符串
        if (Array.isArray(submitData.tags)) {
          submitData.tags = JSON.stringify(submitData.tags)
        }

        if (dialogType.value === 'add') {
          // 添加操作
          const res = await service.post('/tourism', submitData, {
            params: {
              type: 'scenic'
            }
          })
          if (res.code === 200) {
            ElMessage.success('添加成功')
            dialogVisible.value = false
            fetchAttractionsList()
          } else {
            ElMessage.error(res.msg || '添加失败')
          }
        } else {
          // 编辑操作
          const res = await service.put(`/tourism/${submitData.id}`, submitData, {
            params: {
              type: 'scenic'
            }
          })
          if (res.code === 200) {
            ElMessage.success('编辑成功')
            dialogVisible.value = false
            fetchAttractionsList()
          } else {
            ElMessage.error(res.msg || '编辑失败')
          }
        }
      } catch (error) {
        console.error('提交表单失败:', error)
        ElMessage.error('提交表单失败')
      }
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
  attractionForm.id = ''
  attractionForm.type = 'scenic'
  attractionForm.name = ''
  attractionForm.description = ''
  attractionForm.image = ''
  attractionForm.reservationDays = 7
  attractionForm.reservationCount = 100
  attractionForm.score = 4.5
  attractionForm.visitCount = '0'
  attractionForm.tags = []
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchAttractionsList()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchAttractionsList()
}

onMounted(() => {
  fetchAttractionsList()
})
</script>

<style scoped>
.attractions-container {
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

.upload-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-uploader:hover {
  border-color: #409EFF;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.preview-image {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}

.image-url {
  display: flex;
  align-items: center;
  gap: 10px;
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
