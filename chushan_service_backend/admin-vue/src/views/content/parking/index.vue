<template>
  <div class="parking-container">
    <div class="page-header">
      <h1>停车场管理</h1>
      <el-button type="primary" @click="openAddDialog">添加停车场</el-button>
    </div>

    <el-card class="table-card">
      <el-table :data="filteredParking" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="name" label="停车场名称" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="capacity" label="总容量" width="100" />
        <el-table-column prop="available" label="可用数量" width="100" />
        <el-table-column prop="price" label="价格" width="100" />
        <el-table-column prop="reservationDays" label="预约天数" width="100" />
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

    <!-- 添加/编辑停车场对话框 -->
    <el-dialog :title="dialogType === 'add' ? '添加停车场' : '编辑停车场'" v-model="dialogVisible" width="50%">
      <el-form :model="parkingForm" label-width="80px" :rules="rules" ref="formRef">
        <el-form-item label="类型" prop="type">
          <el-input v-model="parkingForm.type" placeholder="请输入类型" disabled value="parking" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="parkingForm.name" placeholder="请输入停车场名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="parkingForm.description" type="textarea" :rows="4" placeholder="请输入停车场描述" />
        </el-form-item>
        <el-form-item label="总容量" prop="capacity">
          <el-input-number v-model="parkingForm.capacity" :min="1" :max="1000" />
        </el-form-item>
        <el-form-item label="可用数量" prop="available">
          <el-input-number v-model="parkingForm.available" :min="0" :max="parkingForm.capacity" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="parkingForm.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="预约天数" prop="reservationDays">
          <el-input-number v-model="parkingForm.reservationDays" :min="1" :max="30" />
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
import service from '@/utils/request'
import { useSearchStore } from '@/stores/search'

interface ParkingForm {
  id: string
  type: string
  name: string
  description: string
  capacity: number
  available: number
  price: string
  reservationDays: number
}

// 获取搜索store
const searchStore = useSearchStore()

// 数据列表
const parkingList = ref<ParkingForm[]>([])
const loading = ref(false)
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)

// 过滤后的列表数据
const filteredParking = computed(() => {
  if (!searchStore.keyword) return parkingList.value
  const keyword = searchStore.keyword.toLowerCase()
  return parkingList.value.filter(item => {
    return item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
  })
})

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance | null>(null)

// 表单数据
const parkingForm = ref<ParkingForm>({
  id: '',
  type: 'parking',
  name: '',
  description: '',
  capacity: 50,
  available: 50,
  price: '免费',
  reservationDays: 7
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入停车场名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度在2到50个字符之间', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入停车场描述', trigger: 'blur' }
  ],
  capacity: [
    { required: true, message: '请输入总容量', trigger: 'change' }
  ],
  available: [
    { required: true, message: '请输入可用数量', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' }
  ],
  reservationDays: [
    { required: true, message: '请输入预约天数', trigger: 'change' }
  ]
}

// 获取停车场列表数据
const fetchParkingList = async () => {
  loading.value = true
  try {
    const res = await service.get('/tourism/type', {
      params: {
        type: 'parking',
        page: currentPage.value,
        size: pageSize.value
      }
    })
    if (res.code === 200) {
      parkingList.value = res.data.records || []
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res.msg || '获取停车场列表失败')
    }
  } catch (error) {
    console.error('获取停车场列表失败:', error)
    ElMessage.error('获取停车场列表失败')
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
  parkingForm.value = { ...row }
  dialogVisible.value = true
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该停车场吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await service.delete(`/tourism/${row.id}`, {
        params: {
          type: 'parking'
        }
      })
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchParkingList()
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
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    // 验证通过后的逻辑
    const submitData = { ...parkingForm.value };
    if (dialogType.value === 'add') {
      // 添加操作
      const res = await service.post('/tourism', submitData, {
        params: { type: 'parking' }
      });
      if (res.code === 200) {
        ElMessage.success('添加成功');
        dialogVisible.value = false;
        fetchParkingList();
      } else {
        ElMessage.error(res.msg || '添加失败');
      }
    } else {
      // 编辑操作
      const res = await service.put(`/tourism/${submitData.id}`, submitData, {
        params: { type: 'parking' }
      });
      if (res.code === 200) {
        ElMessage.success('编辑成功');
        dialogVisible.value = false;
        fetchParkingList();
      } else {
        ElMessage.error(res.msg || '编辑失败');
      }
    }
  } catch (error) {
    console.error('提交表单失败:', error);
    ElMessage.error('表单验证失败');
  }
};

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  parkingForm.value = {
    id: '',
    type: 'parking',
    name: '',
    description: '',
    capacity: 50,
    available: 50,
    price: '免费',
    reservationDays: 7
  }
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchParkingList()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchParkingList()
}

onMounted(() => {
  fetchParkingList()
})
</script>

<style scoped>
.parking-container {
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
