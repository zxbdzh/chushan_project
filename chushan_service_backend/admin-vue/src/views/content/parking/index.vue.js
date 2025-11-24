import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import service from '@/utils/request';
// 数据列表
const parkingList = ref([]);
const loading = ref(false);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);
// 对话框相关
const dialogVisible = ref(false);
const dialogType = ref('add');
const formRef = ref(null);
// 表单数据
const parkingForm = ref({
    id: '',
    type: 'parking',
    name: '',
    description: '',
    capacity: 50,
    available: 50,
    price: '免费',
    reservationDays: 7
});
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
};
// 获取停车场列表数据
const fetchParkingList = async () => {
    loading.value = true;
    try {
        const res = await service.get('/tourism/type', {
            params: {
                type: 'parking',
                page: currentPage.value,
                size: pageSize.value
            }
        });
        if (res.code === 200) {
            parkingList.value = res.data.records || [];
            total.value = res.data.total || 0;
        }
        else {
            ElMessage.error(res.msg || '获取停车场列表失败');
        }
    }
    catch (error) {
        console.error('获取停车场列表失败:', error);
        ElMessage.error('获取停车场列表失败');
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
    parkingForm.value = { ...row };
    dialogVisible.value = true;
};
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
            });
            if (res.code === 200) {
                ElMessage.success('删除成功');
                fetchParkingList();
            }
            else {
                ElMessage.error(res.msg || '删除失败');
            }
        }
        catch (error) {
            console.error('删除失败:', error);
            ElMessage.error('删除失败');
        }
    });
};
// 提交表单
const handleSubmit = () => {
    if (!formRef.value)
        return;
    formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                const submitData = { ...parkingForm.value };
                if (dialogType.value === 'add') {
                    // 添加操作
                    const res = await service.post('/tourism', submitData, {
                        params: {
                            type: 'parking'
                        }
                    });
                    if (res.code === 200) {
                        ElMessage.success('添加成功');
                        dialogVisible.value = false;
                        fetchParkingList();
                    }
                    else {
                        ElMessage.error(res.msg || '添加失败');
                    }
                }
                else {
                    // 编辑操作
                    const res = await service.put(`/tourism/${submitData.id}`, submitData, {
                        params: {
                            type: 'parking'
                        }
                    });
                    if (res.code === 200) {
                        ElMessage.success('编辑成功');
                        dialogVisible.value = false;
                        fetchParkingList();
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
    parkingForm.value = {
        id: '',
        type: 'parking',
        name: '',
        description: '',
        capacity: 50,
        available: 50,
        price: '免费',
        reservationDays: 7
    };
};
// 分页处理
const handleSizeChange = (size) => {
    pageSize.value = size;
    fetchParkingList();
};
const handleCurrentChange = (page) => {
    currentPage.value = page;
    fetchParkingList();
};
onMounted(() => {
    fetchParkingList();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "parking-container" },
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
    data: (__VLS_ctx.parkingList),
    ...{ style: {} },
}));
const __VLS_14 = __VLS_13({
    data: (__VLS_ctx.parkingList),
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
    label: "停车场名称",
}));
const __VLS_26 = __VLS_25({
    prop: "name",
    label: "停车场名称",
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
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    prop: "capacity",
    label: "总容量",
    width: "100",
}));
const __VLS_34 = __VLS_33({
    prop: "capacity",
    label: "总容量",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    prop: "available",
    label: "可用数量",
    width: "100",
}));
const __VLS_38 = __VLS_37({
    prop: "available",
    label: "可用数量",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    prop: "price",
    label: "价格",
    width: "100",
}));
const __VLS_42 = __VLS_41({
    prop: "price",
    label: "价格",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    prop: "reservationDays",
    label: "预约天数",
    width: "100",
}));
const __VLS_46 = __VLS_45({
    prop: "reservationDays",
    label: "预约天数",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "操作",
    width: "200",
}));
const __VLS_50 = __VLS_49({
    label: "操作",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_51.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_52 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_56;
    let __VLS_57;
    let __VLS_58;
    const __VLS_59 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(scope.row);
        }
    };
    __VLS_55.slots.default;
    var __VLS_55;
    const __VLS_60 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }));
    const __VLS_62 = __VLS_61({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    let __VLS_64;
    let __VLS_65;
    let __VLS_66;
    const __VLS_67 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(scope.row);
        }
    };
    __VLS_63.slots.default;
    var __VLS_63;
}
var __VLS_51;
var __VLS_15;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination-container" },
});
const __VLS_68 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    background: true,
    layout: "total, sizes, prev, pager, next",
    total: (__VLS_ctx.total),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
}));
const __VLS_70 = __VLS_69({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    background: true,
    layout: "total, sizes, prev, pager, next",
    total: (__VLS_ctx.total),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
let __VLS_72;
let __VLS_73;
let __VLS_74;
const __VLS_75 = {
    onSizeChange: (__VLS_ctx.handleSizeChange)
};
const __VLS_76 = {
    onCurrentChange: (__VLS_ctx.handleCurrentChange)
};
var __VLS_71;
var __VLS_11;
const __VLS_77 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    title: (__VLS_ctx.dialogType === 'add' ? '添加停车场' : '编辑停车场'),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "50%",
}));
const __VLS_79 = __VLS_78({
    title: (__VLS_ctx.dialogType === 'add' ? '添加停车场' : '编辑停车场'),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "50%",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_80.slots.default;
const __VLS_81 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    model: (__VLS_ctx.parkingForm),
    labelWidth: "80px",
    rules: (__VLS_ctx.rules),
    ref: "formRef",
}));
const __VLS_83 = __VLS_82({
    model: (__VLS_ctx.parkingForm),
    labelWidth: "80px",
    rules: (__VLS_ctx.rules),
    ref: "formRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_85 = {};
__VLS_84.slots.default;
const __VLS_87 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    label: "类型",
    prop: "type",
}));
const __VLS_89 = __VLS_88({
    label: "类型",
    prop: "type",
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
__VLS_90.slots.default;
const __VLS_91 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    modelValue: (__VLS_ctx.parkingForm.type),
    placeholder: "请输入类型",
    disabled: true,
    value: "parking",
}));
const __VLS_93 = __VLS_92({
    modelValue: (__VLS_ctx.parkingForm.type),
    placeholder: "请输入类型",
    disabled: true,
    value: "parking",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
var __VLS_90;
const __VLS_95 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
    label: "名称",
    prop: "name",
}));
const __VLS_97 = __VLS_96({
    label: "名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
__VLS_98.slots.default;
const __VLS_99 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    modelValue: (__VLS_ctx.parkingForm.name),
    placeholder: "请输入停车场名称",
}));
const __VLS_101 = __VLS_100({
    modelValue: (__VLS_ctx.parkingForm.name),
    placeholder: "请输入停车场名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
var __VLS_98;
const __VLS_103 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    label: "描述",
    prop: "description",
}));
const __VLS_105 = __VLS_104({
    label: "描述",
    prop: "description",
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
__VLS_106.slots.default;
const __VLS_107 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
    modelValue: (__VLS_ctx.parkingForm.description),
    type: "textarea",
    rows: (4),
    placeholder: "请输入停车场描述",
}));
const __VLS_109 = __VLS_108({
    modelValue: (__VLS_ctx.parkingForm.description),
    type: "textarea",
    rows: (4),
    placeholder: "请输入停车场描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
var __VLS_106;
const __VLS_111 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    label: "总容量",
    prop: "capacity",
}));
const __VLS_113 = __VLS_112({
    label: "总容量",
    prop: "capacity",
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
__VLS_114.slots.default;
const __VLS_115 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
    modelValue: (__VLS_ctx.parkingForm.capacity),
    min: (1),
    max: (1000),
}));
const __VLS_117 = __VLS_116({
    modelValue: (__VLS_ctx.parkingForm.capacity),
    min: (1),
    max: (1000),
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
var __VLS_114;
const __VLS_119 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
    label: "可用数量",
    prop: "available",
}));
const __VLS_121 = __VLS_120({
    label: "可用数量",
    prop: "available",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
__VLS_122.slots.default;
const __VLS_123 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
    modelValue: (__VLS_ctx.parkingForm.available),
    min: (0),
    max: (__VLS_ctx.parkingForm.capacity),
}));
const __VLS_125 = __VLS_124({
    modelValue: (__VLS_ctx.parkingForm.available),
    min: (0),
    max: (__VLS_ctx.parkingForm.capacity),
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
var __VLS_122;
const __VLS_127 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
    label: "价格",
    prop: "price",
}));
const __VLS_129 = __VLS_128({
    label: "价格",
    prop: "price",
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
__VLS_130.slots.default;
const __VLS_131 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
    modelValue: (__VLS_ctx.parkingForm.price),
    placeholder: "请输入价格",
}));
const __VLS_133 = __VLS_132({
    modelValue: (__VLS_ctx.parkingForm.price),
    placeholder: "请输入价格",
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
var __VLS_130;
const __VLS_135 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
    label: "预约天数",
    prop: "reservationDays",
}));
const __VLS_137 = __VLS_136({
    label: "预约天数",
    prop: "reservationDays",
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
__VLS_138.slots.default;
const __VLS_139 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
    modelValue: (__VLS_ctx.parkingForm.reservationDays),
    min: (1),
    max: (30),
}));
const __VLS_141 = __VLS_140({
    modelValue: (__VLS_ctx.parkingForm.reservationDays),
    min: (1),
    max: (30),
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
var __VLS_138;
var __VLS_84;
{
    const { footer: __VLS_thisSlot } = __VLS_80.slots;
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
        onClick: (__VLS_ctx.handleSubmit)
    };
    __VLS_154.slots.default;
    var __VLS_154;
}
var __VLS_80;
/** @type {__VLS_StyleScopedClasses['parking-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['table-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-container']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
// @ts-ignore
var __VLS_86 = __VLS_85;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            parkingList: parkingList,
            loading: loading,
            total: total,
            pageSize: pageSize,
            currentPage: currentPage,
            dialogVisible: dialogVisible,
            dialogType: dialogType,
            formRef: formRef,
            parkingForm: parkingForm,
            rules: rules,
            openAddDialog: openAddDialog,
            handleEdit: handleEdit,
            handleDelete: handleDelete,
            handleSubmit: handleSubmit,
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