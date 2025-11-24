import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import service from '@/utils/request';
// 表格数据
const newsList = ref([]);
const loading = ref(false);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);
// 对话框相关
const dialogVisible = ref(false);
const dialogType = ref('add'); // 'add' 或 'edit'
const formRef = ref(null);
// 表单数据
const newsForm = reactive({
    id: '',
    type: 'news',
    name: '',
    description: '',
    image: '',
    date: ''
});
// 表单验证规则
const rules = {
    name: [
        { required: true, message: '请输入动态标题', trigger: 'blur' },
        { min: 2, max: 50, message: '标题长度在2到50个字符之间', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '请输入动态描述', trigger: 'blur' }
    ],
    image: [
        { required: true, message: '请输入图片URL', trigger: 'blur' }
    ],
    date: [
        { required: true, message: '请选择日期', trigger: 'change' }
    ]
};
// 获取新闻列表数据
const fetchNewsList = async () => {
    loading.value = true;
    try {
        const res = await service.get('/tourism/type', {
            params: {
                type: 'news',
                page: currentPage.value,
                size: pageSize.value
            }
        });
        if (res.code === 200) {
            newsList.value = res.data.records || [];
            total.value = res.data.total || 0;
        }
        else {
            ElMessage.error(res.msg || '获取动态列表失败');
        }
    }
    catch (error) {
        console.error('获取动态列表失败:', error);
        ElMessage.error('获取动态列表失败');
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
    Object.assign(newsForm, row);
    dialogVisible.value = true;
};
// 处理删除
const handleDelete = (row) => {
    ElMessageBox.confirm(`确定要删除标题为"${row.name}"的动态吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(async () => {
        try {
            const res = await service.delete(`/tourism/${row.id}`, {
                params: {
                    type: 'news'
                }
            });
            if (res.code === 200) {
                ElMessage.success('删除成功');
                fetchNewsList();
            }
            else {
                ElMessage.error(res.msg || '删除失败');
            }
        }
        catch (error) {
            console.error('删除动态失败:', error);
            ElMessage.error('删除动态失败');
        }
    })
        .catch(() => {
        ElMessage.info('已取消删除');
    });
};
// 提交表单
const submitForm = async () => {
    if (!formRef.value)
        return;
    await formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                if (dialogType.value === 'add') {
                    // 添加操作
                    const res = await service.post('/tourism', newsForm, {
                        params: {
                            type: 'news'
                        }
                    });
                    if (res.code === 200) {
                        ElMessage.success('添加成功');
                        dialogVisible.value = false;
                        fetchNewsList();
                    }
                    else {
                        ElMessage.error(res.msg || '添加失败');
                    }
                }
                else {
                    // 编辑操作
                    const res = await service.put(`/tourism/${newsForm.id}`, newsForm, {
                        params: {
                            type: 'news'
                        }
                    });
                    if (res.code === 200) {
                        ElMessage.success('编辑成功');
                        dialogVisible.value = false;
                        fetchNewsList();
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
    newsForm.id = '';
    newsForm.type = 'news';
    newsForm.name = '';
    newsForm.description = '';
    newsForm.image = '';
    newsForm.date = '';
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
            newsForm.image = res.data;
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
    newsForm.image = '';
};
// 分页处理
const handleSizeChange = (size) => {
    pageSize.value = size;
    fetchNewsList();
};
const handleCurrentChange = (page) => {
    currentPage.value = page;
    fetchNewsList();
};
onMounted(() => {
    fetchNewsList();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['image-uploader']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dynamics-container" },
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
    data: (__VLS_ctx.newsList),
    ...{ style: {} },
}));
const __VLS_14 = __VLS_13({
    data: (__VLS_ctx.newsList),
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
    label: "标题",
}));
const __VLS_26 = __VLS_25({
    prop: "name",
    label: "标题",
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
    prop: "date",
    label: "日期",
    width: "180",
}));
const __VLS_42 = __VLS_41({
    prop: "date",
    label: "日期",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "操作",
    width: "200",
}));
const __VLS_46 = __VLS_45({
    label: "操作",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_47.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_48 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_52;
    let __VLS_53;
    let __VLS_54;
    const __VLS_55 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(scope.row);
        }
    };
    __VLS_51.slots.default;
    var __VLS_51;
    const __VLS_56 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }));
    const __VLS_58 = __VLS_57({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    let __VLS_60;
    let __VLS_61;
    let __VLS_62;
    const __VLS_63 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(scope.row);
        }
    };
    __VLS_59.slots.default;
    var __VLS_59;
}
var __VLS_47;
var __VLS_15;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination-container" },
});
const __VLS_64 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    background: true,
    layout: "total, sizes, prev, pager, next",
    total: (__VLS_ctx.total),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
}));
const __VLS_66 = __VLS_65({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    background: true,
    layout: "total, sizes, prev, pager, next",
    total: (__VLS_ctx.total),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_68;
let __VLS_69;
let __VLS_70;
const __VLS_71 = {
    onSizeChange: (__VLS_ctx.handleSizeChange)
};
const __VLS_72 = {
    onCurrentChange: (__VLS_ctx.handleCurrentChange)
};
var __VLS_67;
var __VLS_11;
const __VLS_73 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    title: (__VLS_ctx.dialogType === 'add' ? '添加动态' : '编辑动态'),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "50%",
}));
const __VLS_75 = __VLS_74({
    title: (__VLS_ctx.dialogType === 'add' ? '添加动态' : '编辑动态'),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "50%",
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
__VLS_76.slots.default;
const __VLS_77 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    model: (__VLS_ctx.newsForm),
    labelWidth: "80px",
    rules: (__VLS_ctx.rules),
    ref: "formRef",
}));
const __VLS_79 = __VLS_78({
    model: (__VLS_ctx.newsForm),
    labelWidth: "80px",
    rules: (__VLS_ctx.rules),
    ref: "formRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_81 = {};
__VLS_80.slots.default;
const __VLS_83 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    label: "类型",
    prop: "type",
}));
const __VLS_85 = __VLS_84({
    label: "类型",
    prop: "type",
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
__VLS_86.slots.default;
const __VLS_87 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    modelValue: (__VLS_ctx.newsForm.type),
    placeholder: "请输入动态类型",
    disabled: true,
    value: "news",
}));
const __VLS_89 = __VLS_88({
    modelValue: (__VLS_ctx.newsForm.type),
    placeholder: "请输入动态类型",
    disabled: true,
    value: "news",
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
var __VLS_86;
const __VLS_91 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    label: "标题",
    prop: "name",
}));
const __VLS_93 = __VLS_92({
    label: "标题",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
__VLS_94.slots.default;
const __VLS_95 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
    modelValue: (__VLS_ctx.newsForm.name),
    placeholder: "请输入动态标题",
}));
const __VLS_97 = __VLS_96({
    modelValue: (__VLS_ctx.newsForm.name),
    placeholder: "请输入动态标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
var __VLS_94;
const __VLS_99 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    label: "描述",
    prop: "description",
}));
const __VLS_101 = __VLS_100({
    label: "描述",
    prop: "description",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
__VLS_102.slots.default;
const __VLS_103 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    modelValue: (__VLS_ctx.newsForm.description),
    type: "textarea",
    rows: (4),
    placeholder: "请输入动态描述",
}));
const __VLS_105 = __VLS_104({
    modelValue: (__VLS_ctx.newsForm.description),
    type: "textarea",
    rows: (4),
    placeholder: "请输入动态描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
var __VLS_102;
const __VLS_107 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
    label: "图片",
    prop: "image",
}));
const __VLS_109 = __VLS_108({
    label: "图片",
    prop: "image",
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
__VLS_110.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "upload-container" },
});
const __VLS_111 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    ...{ class: "image-uploader" },
    action: "#",
    httpRequest: (__VLS_ctx.uploadImage),
    showFileList: (false),
    beforeUpload: (__VLS_ctx.beforeImageUpload),
}));
const __VLS_113 = __VLS_112({
    ...{ class: "image-uploader" },
    action: "#",
    httpRequest: (__VLS_ctx.uploadImage),
    showFileList: (false),
    beforeUpload: (__VLS_ctx.beforeImageUpload),
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
__VLS_114.slots.default;
if (__VLS_ctx.newsForm.image) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.newsForm.image),
        ...{ class: "preview-image" },
    });
}
else {
    const __VLS_115 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
        ...{ class: "upload-icon" },
    }));
    const __VLS_117 = __VLS_116({
        ...{ class: "upload-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_116));
    __VLS_118.slots.default;
    const __VLS_119 = {}.Plus;
    /** @type {[typeof __VLS_components.Plus, ]} */ ;
    // @ts-ignore
    const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({}));
    const __VLS_121 = __VLS_120({}, ...__VLS_functionalComponentArgsRest(__VLS_120));
    var __VLS_118;
}
var __VLS_114;
if (__VLS_ctx.newsForm.image) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "image-url" },
    });
    const __VLS_123 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
        modelValue: (__VLS_ctx.newsForm.image),
        placeholder: "图片URL",
        readonly: true,
    }));
    const __VLS_125 = __VLS_124({
        modelValue: (__VLS_ctx.newsForm.image),
        placeholder: "图片URL",
        readonly: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    const __VLS_127 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }));
    const __VLS_129 = __VLS_128({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    let __VLS_131;
    let __VLS_132;
    let __VLS_133;
    const __VLS_134 = {
        onClick: (__VLS_ctx.clearImage)
    };
    __VLS_130.slots.default;
    var __VLS_130;
}
var __VLS_110;
const __VLS_135 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
    label: "日期",
    prop: "date",
}));
const __VLS_137 = __VLS_136({
    label: "日期",
    prop: "date",
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
__VLS_138.slots.default;
const __VLS_139 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
    modelValue: (__VLS_ctx.newsForm.date),
    type: "date",
    placeholder: "选择日期",
    format: "YYYY-MM-DD",
    valueFormat: "YYYY-MM-DD",
}));
const __VLS_141 = __VLS_140({
    modelValue: (__VLS_ctx.newsForm.date),
    type: "date",
    placeholder: "选择日期",
    format: "YYYY-MM-DD",
    valueFormat: "YYYY-MM-DD",
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
var __VLS_138;
var __VLS_80;
{
    const { footer: __VLS_thisSlot } = __VLS_76.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dialog-footer" },
    });
    const __VLS_143 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
        ...{ 'onClick': {} },
    }));
    const __VLS_145 = __VLS_144({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_144));
    let __VLS_147;
    let __VLS_148;
    let __VLS_149;
    const __VLS_150 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_146.slots.default;
    var __VLS_146;
    const __VLS_151 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_153 = __VLS_152({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_152));
    let __VLS_155;
    let __VLS_156;
    let __VLS_157;
    const __VLS_158 = {
        onClick: (__VLS_ctx.submitForm)
    };
    __VLS_154.slots.default;
    var __VLS_154;
}
var __VLS_76;
/** @type {__VLS_StyleScopedClasses['dynamics-container']} */ ;
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
var __VLS_82 = __VLS_81;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            newsList: newsList,
            loading: loading,
            total: total,
            pageSize: pageSize,
            currentPage: currentPage,
            dialogVisible: dialogVisible,
            dialogType: dialogType,
            formRef: formRef,
            newsForm: newsForm,
            rules: rules,
            openAddDialog: openAddDialog,
            handleEdit: handleEdit,
            handleDelete: handleDelete,
            submitForm: submitForm,
            beforeImageUpload: beforeImageUpload,
            uploadImage: uploadImage,
            clearImage: clearImage,
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