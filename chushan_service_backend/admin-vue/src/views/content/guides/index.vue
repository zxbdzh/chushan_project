<template>
  <div class="guides-container">
    <div class="page-header">
      <h1>攻略管理</h1>
      <el-button type="primary" @click="openAddDialog">添加攻略</el-button>
    </div>

    <el-card class="table-card">
      <el-table :data="filteredGuides" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column label="图片" width="120">
          <template #default="scope">
            <el-image style="width: 80px; height: 50px" :src="scope.row.imageUrl" fit="cover"
              :preview-src-list="[scope.row.imageUrl]"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="浏览量" width="100" />
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

    <!-- 添加/编辑攻略对话框 -->
    <el-dialog :title="dialogType === 'add' ? '添加攻略' : '编辑攻略'" v-model="dialogVisible" width="50%">
      <el-form :model="guideForm" label-width="80px" :rules="rules" ref="formRef">
        <el-form-item label="类型" prop="type">
          <el-select v-model="guideForm.type" placeholder="请选择类型">
            <el-option v-for="type in types" :key="type" :label="type" :value="type" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="guideForm.title" placeholder="请输入攻略标题" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="guideForm.description" type="textarea" :rows="4" placeholder="请输入攻略描述" />
        </el-form-item>
        <el-form-item label="图片" prop="imageUrl">
          <div class="upload-container">
            <el-upload class="image-uploader" action="#" :http-request="uploadImage" :show-file-list="false"
              :before-upload="beforeImageUpload">
              <img v-if="guideForm.imageUrl" :src="guideForm.imageUrl" class="preview-image" />
              <el-icon v-else class="image-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import service from '@/utils/request'

interface GuideForm {
  id: string
  type: string
  title: string
  description: string
  imageUrl: string
  views: number
}

// 数据列表
const guidesList = ref<GuideForm[]>([])
const loading = ref(false)
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const types = ref<string[]>(['全部', '线路', '吃喝', '住宿', '购物', '其他'])

// 引入搜索状态管理
import { useSearchStore } from '@/stores/search'
const searchStore = useSearchStore()

// 过滤后的攻略列表
const filteredGuides = computed(() => {
  const keyword = searchStore.keyword.toLowerCase()
  if (!keyword) return guidesList.value

  return guidesList.value.filter(guide =>
    guide.title.toLowerCase().includes(keyword) ||
    guide.description.toLowerCase().includes(keyword)
  )
})

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance | null>(null)

// 表单数据
const guideForm = ref<GuideForm>({
  id: '',
  type: '',
  title: '',
  description: '',
  imageUrl: '',
  views: 0
})

// 表单验证规则
const rules = {
  type: [
    { required: true, message: '请选择类型', trigger: 'change' }
  ],
  title: [
    { required: true, message: '请输入攻略标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度在2到50个字符之间', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入攻略描述', trigger: 'blur' }
  ],
  imageUrl: [
    { required: true, message: '请上传攻略图片', trigger: 'change' }
  ]
}

// 获取攻略列表数据
const fetchGuidesList = async () => {
  loading.value = true
  try {
    const res = await service.get('/guideItems/type/all', {
      params: {
        page: currentPage.value,
        size: pageSize.value
      }
    })
    if (res.code === 200) {
      guidesList.value = res.data.records || []
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res.msg || '获取攻略列表失败')
    }
  } catch (error) {
    console.error('获取攻略列表失败:', error)
    ElMessage.error('获取攻略列表失败')
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
const handleEdit = (row: GuideForm) => {
  dialogType.value = 'edit'
  guideForm.value = { ...row }
  dialogVisible.value = true
}

// 处理删除
const handleDelete = (row: GuideForm) => {
  ElMessageBox.confirm('确认删除该攻略吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await service.delete(`/guideItems/${row.id}`, {
        params: {
          type: 'guide'
        }
      })
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchGuidesList()
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
const handleSubmit = () => {
  // 修改验证函数的返回类型
  const submitForm = async () => {
    if (!formRef.value) return;

    try {
      await formRef.value.validate();
      // 验证通过后的逻辑
      try {
        const submitData = { ...guideForm.value }
        if (dialogType.value === 'add') {
          // 添加操作
          const res = await service.post('/guideItems', submitData, {
            params: {
              type: 'guide'
            }
          })
          if (res.code === 200) {
            ElMessage.success('添加成功')
            dialogVisible.value = false
            fetchGuidesList()
          } else {
            ElMessage.error(res.msg || '添加失败')
          }
        } else {
          // 编辑操作
          const res = await service.put(`/guideItems/${submitData.id}`, submitData, {
            params: {
              type: 'guide'
            }
          })
          if (res.code === 200) {
            ElMessage.success('编辑成功')
            dialogVisible.value = false
            fetchGuidesList()
          } else {
            ElMessage.error(res.msg || '编辑失败')
          }
        }
      } catch (error) {
        console.error('提交表单失败:', error)
        ElMessage.error('提交表单失败')
      }
    } catch (error) {
      return;
    }
  };
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  guideForm.value = {
    id: '',
    type: '',
    title: '',
    description: '',
    imageUrl: '',
    views: 0
  }
}

// 图片上传前的验证
const beforeImageUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 上传图片
const uploadImage = async (options: any) => {
  try {
    const formData = new FormData()
    formData.append('file', options.file)
    const res = await service.post('/common/upload', formData)
    if (res.code === 200) {
      guideForm.value.imageUrl = res.data
      ElMessage.success('上传成功')
    } else {
      ElMessage.error(res.msg || '上传失败')
    }
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败')
  }
}

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchGuidesList()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchGuidesList()
}

onMounted(() => {
  fetchGuidesList()
})
</script>

<style scoped>
.guides-container {
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
  justify-content: center;
}

.image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.image-uploader:hover {
  border-color: #409EFF;
}

.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.preview-image {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
}
</style>
