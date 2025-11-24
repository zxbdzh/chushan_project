<template>
  <div class="specialties-container">
    <div class="page-header">
      <h1>特产管理</h1>
      <el-button type="primary" @click="openAddDialog">添加特产</el-button>
    </div>

    <el-card class="table-card">
      <el-table :data="filteredSpecialties" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="name" label="特产名称" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column label="图片" width="120">
          <template #default="scope">
            <el-image style="width: 80px; height: 50px" :src="scope.row.image" fit="cover"
              :preview-src-list="[scope.row.image]"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column label="标签" width="200">
          <template #default="scope">
            <el-tag v-for="tag in scope.row.tags" :key="tag" style="margin-right: 5px">
              {{ tag }}
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
        <el-pagination background layout="total, sizes, prev, pager, next" :total="total" :page-size="pageSize"
          :current-page="currentPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <!-- 添加/编辑特产对话框 -->
    <el-dialog :title="dialogType === 'add' ? '添加特产' : '编辑特产'" v-model="dialogVisible" width="50%">
      <el-form :model="specialtyForm" label-width="80px" :rules="rules" ref="formRef">
        <el-form-item label="类型" prop="type">
          <el-input v-model="specialtyForm.type" placeholder="请输入特产类型" disabled value="product" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="specialtyForm.name" placeholder="请输入特产名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="specialtyForm.description" type="textarea" :rows="4" placeholder="请输入特产描述" />
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <div class="upload-container">
            <el-upload class="image-uploader" action="#" :http-request="uploadImage" :show-file-list="false"
              :before-upload="beforeImageUpload">
              <img v-if="specialtyForm.image" :src="specialtyForm.image" class="preview-image" />
              <el-icon v-else class="upload-icon">
                <Plus />
              </el-icon>
            </el-upload>
            <div class="image-url" v-if="specialtyForm.image">
              <el-input v-model="specialtyForm.image" placeholder="图片URL" readonly />
              <el-button type="danger" size="small" @click="clearImage">清除</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="specialtyForm.date" type="date" placeholder="选择日期" format="YYYY-MM-DD"
            value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select v-model="specialtyForm.tags" multiple placeholder="请选择标签">
            <el-option value="传统中药" label="传统中药" />
            <el-option value="清热解毒" label="清热解毒" />
            <el-option value="地道药材" label="地道药材" />
          </el-select>
        </el-form-item>
        <el-form-item label="规格" prop="specs">
          <el-input v-model="specialtyForm.specs.产地" placeholder="请输入产地" />
          <el-input v-model="specialtyForm.specs.采摘时节" placeholder="请输入采摘时节" style="margin-top: 10px" />
          <el-input v-model="specialtyForm.specs.使用方法" placeholder="请输入使用方法" style="margin-top: 10px" />
          <el-input v-model="specialtyForm.specs.储存方法" placeholder="请输入储存方法" style="margin-top: 10px" />
          <el-input v-model="specialtyForm.specs.功效" placeholder="请输入功效" style="margin-top: 10px" />
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
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import service from '@/utils/request'
import { useSearchStore } from '@/stores/search'

// 表格数据
// 获取搜索store
const searchStore = useSearchStore()

// 数据列表
const specialtiesList = ref([])
const loading = ref(false)
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)

// 过滤后的列表数据
const filteredSpecialties = computed(() => {
  if (!searchStore.keyword) return specialtiesList.value
  const keyword = searchStore.keyword.toLowerCase()
  return specialtiesList.value.filter(item => {
    return item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
  })
})
// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'
const formRef = ref(null)

// 表单数据
const specialtyForm = reactive({
  id: '',
  type: 'product',
  name: '',
  description: '',
  image: '',
  date: '',
  tags: [],
  specs: {
    产地: '',
    采摘时节: '',
    使用方法: '',
    储存方法: '',
    功效: ''
  }
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入特产名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度在2到50个字符之间', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入特产描述', trigger: 'blur' }
  ],
  image: [
    { required: true, message: '请上传图片', trigger: 'blur' }
  ],
  date: [
    { required: true, message: '请选择日期', trigger: 'change' }
  ],
  tags: [
    { required: true, message: '请选择标签', trigger: 'change' }
  ]
}

// 获取特产列表数据
const fetchSpecialtiesList = async () => {
  loading.value = true
  try {
    const res = await service.get('/tourism/type', {
      params: {
        type: 'product',
        page: currentPage.value,
        size: pageSize.value
      }
    })
    if (res.code === 200) {
      specialtiesList.value = res.data.records || []
      specialtiesList.value.forEach(item => {
        item.specs = JSON.parse(item.specs)
        item.tags = JSON.parse(item.tags)
      })
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res.msg || '获取特产列表失败')
    }
  } catch (error) {
    console.error('获取特产列表失败:', error)
    ElMessage.error('获取特产列表失败')
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

  // 如果specs是字符串，则解析为对象
  if (typeof rowData.specs === 'string') {
    try {
      rowData.specs = JSON.parse(rowData.specs)
    } catch (e) {
      console.error('解析specs失败:', e)
      rowData.specs = {
        产地: '',
        采摘时节: '',
        使用方法: '',
        储存方法: '',
        功效: ''
      }
    }
  }

  Object.assign(specialtyForm, rowData)
  dialogVisible.value = true
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除"${row.name}"特产吗？`,
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
            type: 'product'
          }
        })
        if (res.code === 200) {
          ElMessage.success('删除成功')
          fetchSpecialtiesList()
        } else {
          ElMessage.error(res.msg || '删除失败')
        }
      } catch (error) {
        console.error('删除特产失败:', error)
        ElMessage.error('删除特产失败')
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
      specialtyForm.image = res.data
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
  specialtyForm.image = ''
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 创建一个新对象用于提交，避免修改原始表单数据
        const submitData = JSON.parse(JSON.stringify(specialtyForm))

        // 确保tags字段是JSON字符串
        if (Array.isArray(submitData.tags)) {
          submitData.tags = JSON.stringify(submitData.tags)
        }

        // 确保specs字段是JSON字符串
        if (typeof submitData.specs === 'object' && submitData.specs !== null) {
          submitData.specs = JSON.stringify(submitData.specs)
        }

        if (dialogType.value === 'add') {
          // 添加操作
          const res = await service.post('/tourism', submitData, {
            params: {
              type: 'product'
            }
          })
          if (res.code === 200) {
            ElMessage.success('添加成功')
            dialogVisible.value = false
            fetchSpecialtiesList()
          } else {
            ElMessage.error(res.msg || '添加失败')
          }
        } else {
          // 编辑操作
          const res = await service.put(`/tourism/${submitData.id}`, submitData, {
            params: {
              type: 'product'
            }
          })
          if (res.code === 200) {
            ElMessage.success('编辑成功')
            dialogVisible.value = false
            fetchSpecialtiesList()
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
  specialtyForm.id = ''
  specialtyForm.type = 'product'
  specialtyForm.name = ''
  specialtyForm.description = ''
  specialtyForm.image = ''
  specialtyForm.date = ''
  specialtyForm.tags = []
  specialtyForm.specs = {
    产地: '',
    采摘时节: '',
    使用方法: '',
    储存方法: '',
    功效: ''
  }
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchSpecialtiesList()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchSpecialtiesList()
}

onMounted(() => {
  fetchSpecialtiesList()
})
</script>

<style scoped>
.specialties-container {
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
</style>
