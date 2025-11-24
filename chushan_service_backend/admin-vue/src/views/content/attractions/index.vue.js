import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import service from '@/utils/request';
// 表格数据
const attractionsList = ref([]);
const loading = ref(false);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);
// 对话框相关
const dialogVisible = ref(false);
const dialogType = ref('add'); // 'add' 或 'edit'
const formRef = ref(null);
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
});
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
};
// 获取景点列表数据
const fetchAttractionsList = async () => {
    loading.value = true;
    try {
        const res = await service.get('/tourism/type', {
            params: {
                type: 'scenic',
                page: currentPage.value,
                size: pageSize.value
            }
        });
        if (res.code === 200) {
            attractionsList.value = res.data.records || [];
            total.value = res.data.total || 0;
        }
        else {
            ElMessage.error(res.msg || '获取景点列表失败');
        }
    }
    catch (error) {
        console.error('获取景点列表失败:', error);
        ElMessage.error('获取景点列表失败');
    }
    finally {
        loading.value = false;
    }
};
// 打开添加对话框
const openAddDialog = () => {
    dialogType.value = 'add';
    resetForm();
    dialogVisible.value = true;
};
// 处理编辑
const handleEdit = (row) => {
    dialogType.value = 'edit';
    // 深拷贝行数据
    const rowData = JSON.parse(JSON.stringify(row));
    // 如果tags是字符串，则解析为数组
    if (typeof rowData.tags === 'string') {
        try {
            rowData.tags = JSON.parse(rowData.tags);
        }
        catch (e) {
            console.error('解析tags失败:', e);
            rowData.tags = [];
        }
    }
    Object.assign(attractionForm, rowData);
    dialogVisible.value = true;
};
// 处理删除
const handleDelete = (row) => {
    ElMessageBox.confirm(`确定要删除"${row.name}"景点吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(async () => {
        try {
            const res = await service.delete(`/tourism/${row.id}`, {
                params: {
                    type: 'scenic'
                }
            });
            if (res.code === 200) {
                ElMessage.success('删除成功');
                fetchAttractionsList();
            }
            else {
                ElMessage.error(res.msg || '删除失败');
            }
        }
        catch (error) {
            console.error('删除景点失败:', error);
            ElMessage.error('删除景点失败');
        }
    })
        .catch(() => {
        ElMessage.info('已取消删除');
    });
};
// 图片上传前的验证
const beforeImageUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isImage) {
        ElMessage.error('上传文件只能是图片格式!');
        return false;
    }
    if (!isLt2M) {
        ElMessage.error('上传图片大小不能超过 2MB!');
        return false;
    }
    return true;
};
// 上传图片
const uploadImage = async (options) => {
    try {
        const { file } = options;
        const formData = new FormData();
        formData.append('file', file);
        const res = await service.post('/common/upload', formData);
        if (res.code === 200) {
            attractionForm.image = res.data;
            ElMessage.success('图片上传成功');
        }
        else {
            ElMessage.error(res.msg || '图片上传失败');
        }
    }
    catch (error) {
        console.error('图片上传失败:', error);
        ElMessage.error('图片上传失败');
    }
};
// 清除图片
const clearImage = () => {
    attractionForm.image = '';
};
// 提交表单
const submitForm = async () => {
    if (!formRef.value)
        return;
    await formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                // 创建一个新对象用于提交，避免修改原始表单数据
                const submitData = JSON.parse(JSON.stringify(attractionForm));
                // 确保tags字段是JSON字符串
                if (Array.isArray(submitData.tags)) {
                    submitData.tags = JSON.stringify(submitData.tags);
                }
                if (dialogType.value === 'add') {
                    // 添加操作
                    const res = await service.post('/tourism', submitData, {
                        params: {
                            type: 'scenic'
                        }
                    });
                    if (res.code === 200) {
                        ElMessage.success('添加成功');
                        dialogVisible.value = false;
                        fetchAttractionsList();
                    }
                    else {
                        ElMessage.error(res.msg || '添加失败');
                    }
                }
                else {
                    // 编辑操作
                    const res = await service.put(`/tourism/${submitData.id}`, submitData, {
                        params: {
                            type: 'scenic'
                        }
                    });
                    if (res.code === 200) {
                        ElMessage.success('编辑成功');
                        dialogVisible.value = false;
                        fetchAttractionsList();
                    }
                    else {
                        ElMessage.error(res.msg || '编辑失败');
                    }
                }
            }
            catch (error) {
                console.error('提交表单失败:', error);
                ElMessage.error('提交表单失败');
            }
        }
        else {
            return false;
        }
    });
};
// 重置表单
const resetForm = () => {
    if (formRef.value) {
        formRef.value.resetFields();
    }
    attractionForm.id = '';
    attractionForm.type = 'scenic';
    attractionForm.name = '';
    attractionForm.description = '';
    attractionForm.image = '';
    attractionForm.reservationDays = 7;
    attractionForm.reservationCount = 100;
    attractionForm.score = 4.5;
    attractionForm.visitCount = '0';
    attractionForm.tags = [];
};
// 分页处理
const handleSizeChange = (size) => {
    pageSize.value = size;
    fetchAttractionsList();
};
const handleCurrentChange = (page) => {
    currentPage.value = page;
    fetchAttractionsList();
};
onMounted(() => {
    fetchAttractionsList();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['image-uploader']} */ ;
/** @type {__VLS_StyleScopedClasses['table-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-container']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "attractions-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.openAddDialog)
};
__VLS_3.slots.default;
var __VLS_3;
const __VLS_8 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "table-card" },
}));
const __VLS_10 = __VLS_9({
    ...{ class: "table-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    data: (__VLS_ctx.attractionsList),
    ...{ style: {} },
}));
const __VLS_14 = __VLS_13({
    data: (__VLS_ctx.attractionsList),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_15.slots.default;
const __VLS_16 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    prop: "id",
    label: "ID",
    width: "80",
}));
const __VLS_18 = __VLS_17({
    prop: "id",
    label: "ID",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const __VLS_20 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    prop: "type",
    label: "类型",
    width: "100",
}));
const __VLS_22 = __VLS_21({
    prop: "type",
    label: "类型",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    prop: "name",
    label: "景点名称",
}));
const __VLS_26 = __VLS_25({
    prop: "name",
    label: "景点名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    prop: "description",
    label: "描述",
    showOverflowTooltip: true,
}));
const __VLS_30 = __VLS_29({
    prop: "description",
    label: "描述",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "图片",
    width: "120",
}));
const __VLS_34 = __VLS_33({
    label: "图片",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_35.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_36 = {}.ElImage;
    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ style: {} },
        src: (scope.row.image),
        fit: "cover",
        previewSrcList: ([scope.row.image]),
    }));
    const __VLS_38 = __VLS_37({
        ...{ style: {} },
        src: (scope.row.image),
        fit: "cover",
        previewSrcList: ([scope.row.image]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
}
var __VLS_35;
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    prop: "reservationDays",
    label: "预约天数",
    width: "100",
}));
const __VLS_42 = __VLS_41({
    prop: "reservationDays",
    label: "预约天数",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    prop: "reservationCount",
    label: "预约数量",
    width: "100",
}));
const __VLS_46 = __VLS_45({
    prop: "reservationCount",
    label: "预约数量",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    prop: "score",
    label: "评分",
    width: "80",
}));
const __VLS_50 = __VLS_49({
    prop: "score",
    label: "评分",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "visitCount",
    label: "访问量",
    width: "100",
}));
const __VLS_54 = __VLS_53({
    prop: "visitCount",
    label: "访问量",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "操作",
    width: "200",
}));
const __VLS_58 = __VLS_57({
    label: "操作",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_59.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_60 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_62 = __VLS_61({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    let __VLS_64;
    let __VLS_65;
    let __VLS_66;
    const __VLS_67 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(scope.row);
        }
    };
    __VLS_63.slots.default;
    var __VLS_63;
    const __VLS_68 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }));
    const __VLS_70 = __VLS_69({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_72;
    let __VLS_73;
    let __VLS_74;
    const __VLS_75 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(scope.row);
        }
    };
    __VLS_71.slots.default;
    var __VLS_71;
}
var __VLS_59;
var __VLS_15;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination-container" },
});
const __VLS_76 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    background: true,
    layout: "total, sizes, prev, pager, next",
    total: (__VLS_ctx.total),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
}));
const __VLS_78 = __VLS_77({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    background: true,
    layout: "total, sizes, prev, pager, next",
    total: (__VLS_ctx.total),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
let __VLS_80;
let __VLS_81;
let __VLS_82;
const __VLS_83 = {
    onSizeChange: (__VLS_ctx.handleSizeChange)
};
const __VLS_84 = {
    onCurrentChange: (__VLS_ctx.handleCurrentChange)
};
var __VLS_79;
var __VLS_11;
const __VLS_85 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
    title: (__VLS_ctx.dialogType === 'add' ? '添加景点' : '编辑景点'),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "50%",
}));
const __VLS_87 = __VLS_86({
    title: (__VLS_ctx.dialogType === 'add' ? '添加景点' : '编辑景点'),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "50%",
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
__VLS_88.slots.default;
const __VLS_89 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    model: (__VLS_ctx.attractionForm),
    labelWidth: "80px",
    rules: (__VLS_ctx.rules),
    ref: "formRef",
}));
const __VLS_91 = __VLS_90({
    model: (__VLS_ctx.attractionForm),
    labelWidth: "80px",
    rules: (__VLS_ctx.rules),
    ref: "formRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_93 = {};
__VLS_92.slots.default;
const __VLS_95 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
    label: "类型",
    prop: "type",
}));
const __VLS_97 = __VLS_96({
    label: "类型",
    prop: "type",
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
__VLS_98.slots.default;
const __VLS_99 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    modelValue: (__VLS_ctx.attractionForm.type),
    placeholder: "请输入景点类型",
    disabled: true,
    value: "scenic",
}));
const __VLS_101 = __VLS_100({
    modelValue: (__VLS_ctx.attractionForm.type),
    placeholder: "请输入景点类型",
    disabled: true,
    value: "scenic",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
var __VLS_98;
const __VLS_103 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    label: "名称",
    prop: "name",
}));
const __VLS_105 = __VLS_104({
    label: "名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
__VLS_106.slots.default;
const __VLS_107 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
    modelValue: (__VLS_ctx.attractionForm.name),
    placeholder: "请输入景点名称",
}));
const __VLS_109 = __VLS_108({
    modelValue: (__VLS_ctx.attractionForm.name),
    placeholder: "请输入景点名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
var __VLS_106;
const __VLS_111 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    label: "描述",
    prop: "description",
}));
const __VLS_113 = __VLS_112({
    label: "描述",
    prop: "description",
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
__VLS_114.slots.default;
const __VLS_115 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
    modelValue: (__VLS_ctx.attractionForm.description),
    type: "textarea",
    rows: (4),
    placeholder: "请输入景点描述",
}));
const __VLS_117 = __VLS_116({
    modelValue: (__VLS_ctx.attractionForm.description),
    type: "textarea",
    rows: (4),
    placeholder: "请输入景点描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
var __VLS_114;
const __VLS_119 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
    label: "图片",
    prop: "image",
}));
const __VLS_121 = __VLS_120({
    label: "图片",
    prop: "image",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
__VLS_122.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "upload-container" },
});
const __VLS_123 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
    ...{ class: "image-uploader" },
    action: "#",
    httpRequest: (__VLS_ctx.uploadImage),
    showFileList: (false),
    beforeUpload: (__VLS_ctx.beforeImageUpload),
}));
const __VLS_125 = __VLS_124({
    ...{ class: "image-uploader" },
    action: "#",
    httpRequest: (__VLS_ctx.uploadImage),
    showFileList: (false),
    beforeUpload: (__VLS_ctx.beforeImageUpload),
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
__VLS_126.slots.default;
if (__VLS_ctx.attractionForm.image) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.attractionForm.image),
        ...{ class: "preview-image" },
    });
}
else {
    const __VLS_127 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
        ...{ class: "upload-icon" },
    }));
    const __VLS_129 = __VLS_128({
        ...{ class: "upload-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    __VLS_130.slots.default;
    const __VLS_131 = {}.Plus;
    /** @type {[typeof __VLS_components.Plus, ]} */ ;
    // @ts-ignore
    const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({}));
    const __VLS_133 = __VLS_132({}, ...__VLS_functionalComponentArgsRest(__VLS_132));
    var __VLS_130;
}
var __VLS_126;
if (__VLS_ctx.attractionForm.image) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "image-url" },
    });
    const __VLS_135 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
        modelValue: (__VLS_ctx.attractionForm.image),
        placeholder: "图片URL",
        readonly: true,
    }));
    const __VLS_137 = __VLS_136({
        modelValue: (__VLS_ctx.attractionForm.image),
        placeholder: "图片URL",
        readonly: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_136));
    const __VLS_139 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }));
    const __VLS_141 = __VLS_140({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_140));
    let __VLS_143;
    let __VLS_144;
    let __VLS_145;
    const __VLS_146 = {
        onClick: (__VLS_ctx.clearImage)
    };
    __VLS_142.slots.default;
    var __VLS_142;
}
var __VLS_122;
const __VLS_147 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({
    label: "预约天数",
    prop: "reservationDays",
}));
const __VLS_149 = __VLS_148({
    label: "预约天数",
    prop: "reservationDays",
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
__VLS_150.slots.default;
const __VLS_151 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
    modelValue: (__VLS_ctx.attractionForm.reservationDays),
    min: (0),
    step: (1),
}));
const __VLS_153 = __VLS_152({
    modelValue: (__VLS_ctx.attractionForm.reservationDays),
    min: (0),
    step: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
var __VLS_150;
const __VLS_155 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
    label: "预约数量",
    prop: "reservationCount",
}));
const __VLS_157 = __VLS_156({
    label: "预约数量",
    prop: "reservationCount",
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
__VLS_158.slots.default;
const __VLS_159 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
    modelValue: (__VLS_ctx.attractionForm.reservationCount),
    min: (0),
    step: (1),
}));
const __VLS_161 = __VLS_160({
    modelValue: (__VLS_ctx.attractionForm.reservationCount),
    min: (0),
    step: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
var __VLS_158;
const __VLS_163 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent(__VLS_163, new __VLS_163({
    label: "评分",
    prop: "score",
}));
const __VLS_165 = __VLS_164({
    label: "评分",
    prop: "score",
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
__VLS_166.slots.default;
const __VLS_167 = {}.ElRate;
/** @type {[typeof __VLS_components.ElRate, typeof __VLS_components.elRate, ]} */ ;
// @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent(__VLS_167, new __VLS_167({
    modelValue: (__VLS_ctx.attractionForm.score),
    max: (5),
    allowHalf: (true),
}));
const __VLS_169 = __VLS_168({
    modelValue: (__VLS_ctx.attractionForm.score),
    max: (5),
    allowHalf: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_168));
var __VLS_166;
const __VLS_171 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_172 = __VLS_asFunctionalComponent(__VLS_171, new __VLS_171({
    label: "标签",
    prop: "tags",
}));
const __VLS_173 = __VLS_172({
    label: "标签",
    prop: "tags",
}, ...__VLS_functionalComponentArgsRest(__VLS_172));
__VLS_174.slots.default;
const __VLS_175 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent(__VLS_175, new __VLS_175({
    modelValue: (__VLS_ctx.attractionForm.tags),
    multiple: true,
    placeholder: "请选择标签",
}));
const __VLS_177 = __VLS_176({
    modelValue: (__VLS_ctx.attractionForm.tags),
    multiple: true,
    placeholder: "请选择标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_176));
__VLS_178.slots.default;
const __VLS_179 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_180 = __VLS_asFunctionalComponent(__VLS_179, new __VLS_179({
    value: "红色教育",
    label: "红色教育",
}));
const __VLS_181 = __VLS_180({
    value: "红色教育",
    label: "红色教育",
}, ...__VLS_functionalComponentArgsRest(__VLS_180));
const __VLS_183 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_184 = __VLS_asFunctionalComponent(__VLS_183, new __VLS_183({
    value: "党建基地",
    label: "党建基地",
}));
const __VLS_185 = __VLS_184({
    value: "党建基地",
    label: "党建基地",
}, ...__VLS_functionalComponentArgsRest(__VLS_184));
const __VLS_187 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_188 = __VLS_asFunctionalComponent(__VLS_187, new __VLS_187({
    value: "振兴乡村",
    label: "振兴乡村",
}));
const __VLS_189 = __VLS_188({
    value: "振兴乡村",
    label: "振兴乡村",
}, ...__VLS_functionalComponentArgsRest(__VLS_188));
const __VLS_191 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_192 = __VLS_asFunctionalComponent(__VLS_191, new __VLS_191({
    value: "自然风光",
    label: "自然风光",
}));
const __VLS_193 = __VLS_192({
    value: "自然风光",
    label: "自然风光",
}, ...__VLS_functionalComponentArgsRest(__VLS_192));
const __VLS_195 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_196 = __VLS_asFunctionalComponent(__VLS_195, new __VLS_195({
    value: "历史文化",
    label: "历史文化",
}));
const __VLS_197 = __VLS_196({
    value: "历史文化",
    label: "历史文化",
}, ...__VLS_functionalComponentArgsRest(__VLS_196));
var __VLS_178;
var __VLS_174;
var __VLS_92;
{
    const { footer: __VLS_thisSlot } = __VLS_88.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dialog-footer" },
    });
    const __VLS_199 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_200 = __VLS_asFunctionalComponent(__VLS_199, new __VLS_199({
        ...{ 'onClick': {} },
    }));
    const __VLS_201 = __VLS_200({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_200));
    let __VLS_203;
    let __VLS_204;
    let __VLS_205;
    const __VLS_206 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_202.slots.default;
    var __VLS_202;
    const __VLS_207 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_208 = __VLS_asFunctionalComponent(__VLS_207, new __VLS_207({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_209 = __VLS_208({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_208));
    let __VLS_211;
    let __VLS_212;
    let __VLS_213;
    const __VLS_214 = {
        onClick: (__VLS_ctx.submitForm)
    };
    __VLS_210.slots.default;
    var __VLS_210;
}
var __VLS_88;
/** @type {__VLS_StyleScopedClasses['attractions-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['table-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-container']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-container']} */ ;
/** @type {__VLS_StyleScopedClasses['image-uploader']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-image']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['image-url']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
// @ts-ignore
var __VLS_94 = __VLS_93;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            attractionsList: attractionsList,
            loading: loading,
            total: total,
            pageSize: pageSize,
            currentPage: currentPage,
            dialogVisible: dialogVisible,
            dialogType: dialogType,
            formRef: formRef,
            attractionForm: attractionForm,
            rules: rules,
            openAddDialog: openAddDialog,
            handleEdit: handleEdit,
            handleDelete: handleDelete,
            beforeImageUpload: beforeImageUpload,
            uploadImage: uploadImage,
            clearImage: clearImage,
            submitForm: submitForm,
            handleSizeChange: handleSizeChange,
            handleCurrentChange: handleCurrentChange,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map