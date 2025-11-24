import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
// 表格数据
const usersList = ref([]);
const loading = ref(false);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);
// 对话框相关
const dialogVisible = ref(false);
const dialogType = ref('add'); // 'add' 或 'edit'
const formRef = ref(null);
// 表单数据
const userForm = reactive({
    id: '',
    username: '',
    nickname: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    registerTime: '',
    status: 1
});
// 表单验证规则
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在3到20个字符之间', trigger: 'blur' }
    ],
    nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur', validator: (rule, value, callback) => {
                if (dialogType.value === 'add' && !value) {
                    callback(new Error('请输入密码'));
                }
                else {
                    callback();
                }
            } },
        { min: 6, max: 20, message: '密码长度在6到20个字符之间', trigger: 'blur' }
    ],
    role: [
        { required: true, message: '请选择角色', trigger: 'change' }
    ],
    status: [
        { required: true, message: '请选择状态', trigger: 'change' }
    ]
};
// 获取用户列表数据
const fetchUsersList = async () => {
    loading.value = true;
    try {
        // 模拟API请求
        setTimeout(() => {
            usersList.value = [
                {
                    id: 1,
                    username: 'admin',
                    nickname: '系统管理员',
                    email: 'admin@example.com',
                    phone: '13800138000',
                    role: 'admin',
                    registerTime: '2023-01-01 10:00:00',
                    status: 1
                },
                {
                    id: 2,
                    username: 'zhangsan',
                    nickname: '张三',
                    email: 'zhangsan@example.com',
                    phone: '13800138001',
                    role: 'user',
                    registerTime: '2023-02-15 14:30:00',
                    status: 1
                },
                {
                    id: 3,
                    username: 'lisi',
                    nickname: '李四',
                    email: 'lisi@example.com',
                    phone: '13800138002',
                    role: 'user',
                    registerTime: '2023-03-20 09:15:00',
                    status: 0
                }
            ];
            total.value = 3;
            loading.value = false;
        }, 500);
    }
    catch (error) {
        console.error('获取用户列表失败:', error);
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
    Object.assign(userForm, row);
    // 不显示密码
    userForm.password = '';
    dialogVisible.value = true;
};
// 处理删除
const handleDelete = (row) => {
    ElMessageBox.confirm(`确定要删除用户"${row.username}"吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
        // 模拟删除操作
        const index = usersList.value.findIndex(item => item.id === row.id);
        if (index !== -1) {
            usersList.value.splice(index, 1);
            total.value--;
            ElMessage.success('删除成功');
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
    await formRef.value.validate((valid) => {
        if (valid) {
            if (dialogType.value === 'add') {
                // 模拟添加操作
                const newUser = {
                    ...userForm,
                    id: usersList.value.length + 1,
                    registerTime: new Date().toLocaleString()
                };
                usersList.value.unshift(newUser);
                total.value++;
                ElMessage.success('添加成功');
            }
            else {
                // 模拟编辑操作
                const index = usersList.value.findIndex(item => item.id === userForm.id);
                if (index !== -1) {
                    usersList.value[index] = { ...userForm };
                    ElMessage.success('编辑成功');
                }
            }
            dialogVisible.value = false;
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
    userForm.id = '';
    userForm.username = '';
    userForm.nickname = '';
    userForm.email = '';
    userForm.phone = '';
    userForm.password = '';
    userForm.role = 'user';
    userForm.registerTime = '';
    userForm.status = 1;
};
// 分页处理
const handleSizeChange = (size) => {
    pageSize.value = size;
    fetchUsersList();
};
const handleCurrentChange = (page) => {
    currentPage.value = page;
    fetchUsersList();
};
onMounted(() => {
    fetchUsersList();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "users-container" },
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
    data: (__VLS_ctx.usersList),
    ...{ style: {} },
}));
const __VLS_14 = __VLS_13({
    data: (__VLS_ctx.usersList),
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
    prop: "username",
    label: "用户名",
}));
const __VLS_22 = __VLS_21({
    prop: "username",
    label: "用户名",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    prop: "nickname",
    label: "昵称",
}));
const __VLS_26 = __VLS_25({
    prop: "nickname",
    label: "昵称",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    prop: "email",
    label: "邮箱",
}));
const __VLS_30 = __VLS_29({
    prop: "email",
    label: "邮箱",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    prop: "phone",
    label: "手机号",
    width: "120",
}));
const __VLS_34 = __VLS_33({
    prop: "phone",
    label: "手机号",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    prop: "role",
    label: "角色",
    width: "100",
}));
const __VLS_38 = __VLS_37({
    prop: "role",
    label: "角色",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_39.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_40 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        type: (scope.row.role === 'admin' ? 'danger' : 'primary'),
    }));
    const __VLS_42 = __VLS_41({
        type: (scope.row.role === 'admin' ? 'danger' : 'primary'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    (scope.row.role === 'admin' ? '管理员' : '普通用户');
    var __VLS_43;
}
var __VLS_39;
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    prop: "registerTime",
    label: "注册时间",
    width: "180",
}));
const __VLS_46 = __VLS_45({
    prop: "registerTime",
    label: "注册时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    prop: "status",
    label: "状态",
    width: "100",
}));
const __VLS_50 = __VLS_49({
    prop: "status",
    label: "状态",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_51.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_52 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        type: (scope.row.status === 1 ? 'success' : 'info'),
    }));
    const __VLS_54 = __VLS_53({
        type: (scope.row.status === 1 ? 'success' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    (scope.row.status === 1 ? '正常' : '禁用');
    var __VLS_55;
}
var __VLS_51;
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
    title: (__VLS_ctx.dialogType === 'add' ? '添加用户' : '编辑用户'),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "50%",
}));
const __VLS_87 = __VLS_86({
    title: (__VLS_ctx.dialogType === 'add' ? '添加用户' : '编辑用户'),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "50%",
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
__VLS_88.slots.default;
const __VLS_89 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    model: (__VLS_ctx.userForm),
    labelWidth: "80px",
    rules: (__VLS_ctx.rules),
    ref: "formRef",
}));
const __VLS_91 = __VLS_90({
    model: (__VLS_ctx.userForm),
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
    label: "用户名",
    prop: "username",
}));
const __VLS_97 = __VLS_96({
    label: "用户名",
    prop: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
__VLS_98.slots.default;
const __VLS_99 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    modelValue: (__VLS_ctx.userForm.username),
    placeholder: "请输入用户名",
    disabled: (__VLS_ctx.dialogType === 'edit'),
}));
const __VLS_101 = __VLS_100({
    modelValue: (__VLS_ctx.userForm.username),
    placeholder: "请输入用户名",
    disabled: (__VLS_ctx.dialogType === 'edit'),
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
var __VLS_98;
const __VLS_103 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    label: "昵称",
    prop: "nickname",
}));
const __VLS_105 = __VLS_104({
    label: "昵称",
    prop: "nickname",
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
__VLS_106.slots.default;
const __VLS_107 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
    modelValue: (__VLS_ctx.userForm.nickname),
    placeholder: "请输入昵称",
}));
const __VLS_109 = __VLS_108({
    modelValue: (__VLS_ctx.userForm.nickname),
    placeholder: "请输入昵称",
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
var __VLS_106;
const __VLS_111 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    label: "邮箱",
    prop: "email",
}));
const __VLS_113 = __VLS_112({
    label: "邮箱",
    prop: "email",
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
__VLS_114.slots.default;
const __VLS_115 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
    modelValue: (__VLS_ctx.userForm.email),
    placeholder: "请输入邮箱",
}));
const __VLS_117 = __VLS_116({
    modelValue: (__VLS_ctx.userForm.email),
    placeholder: "请输入邮箱",
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
var __VLS_114;
const __VLS_119 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
    label: "手机号",
    prop: "phone",
}));
const __VLS_121 = __VLS_120({
    label: "手机号",
    prop: "phone",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
__VLS_122.slots.default;
const __VLS_123 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
    modelValue: (__VLS_ctx.userForm.phone),
    placeholder: "请输入手机号",
}));
const __VLS_125 = __VLS_124({
    modelValue: (__VLS_ctx.userForm.phone),
    placeholder: "请输入手机号",
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
var __VLS_122;
if (__VLS_ctx.dialogType === 'add') {
    const __VLS_127 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
        label: "密码",
        prop: "password",
    }));
    const __VLS_129 = __VLS_128({
        label: "密码",
        prop: "password",
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    __VLS_130.slots.default;
    const __VLS_131 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
        modelValue: (__VLS_ctx.userForm.password),
        type: "password",
        placeholder: "请输入密码",
        showPassword: true,
    }));
    const __VLS_133 = __VLS_132({
        modelValue: (__VLS_ctx.userForm.password),
        type: "password",
        placeholder: "请输入密码",
        showPassword: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_132));
    var __VLS_130;
}
const __VLS_135 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
    label: "角色",
    prop: "role",
}));
const __VLS_137 = __VLS_136({
    label: "角色",
    prop: "role",
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
__VLS_138.slots.default;
const __VLS_139 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
    modelValue: (__VLS_ctx.userForm.role),
    placeholder: "请选择角色",
}));
const __VLS_141 = __VLS_140({
    modelValue: (__VLS_ctx.userForm.role),
    placeholder: "请选择角色",
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
__VLS_142.slots.default;
const __VLS_143 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
    value: "admin",
    label: "管理员",
}));
const __VLS_145 = __VLS_144({
    value: "admin",
    label: "管理员",
}, ...__VLS_functionalComponentArgsRest(__VLS_144));
const __VLS_147 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({
    value: "user",
    label: "普通用户",
}));
const __VLS_149 = __VLS_148({
    value: "user",
    label: "普通用户",
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
var __VLS_142;
var __VLS_138;
const __VLS_151 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
    label: "状态",
    prop: "status",
}));
const __VLS_153 = __VLS_152({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
__VLS_154.slots.default;
const __VLS_155 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
    modelValue: (__VLS_ctx.userForm.status),
    placeholder: "请选择状态",
}));
const __VLS_157 = __VLS_156({
    modelValue: (__VLS_ctx.userForm.status),
    placeholder: "请选择状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
__VLS_158.slots.default;
const __VLS_159 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
    value: (1),
    label: "正常",
}));
const __VLS_161 = __VLS_160({
    value: (1),
    label: "正常",
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
const __VLS_163 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent(__VLS_163, new __VLS_163({
    value: (0),
    label: "禁用",
}));
const __VLS_165 = __VLS_164({
    value: (0),
    label: "禁用",
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
var __VLS_158;
var __VLS_154;
var __VLS_92;
{
    const { footer: __VLS_thisSlot } = __VLS_88.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dialog-footer" },
    });
    const __VLS_167 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_168 = __VLS_asFunctionalComponent(__VLS_167, new __VLS_167({
        ...{ 'onClick': {} },
    }));
    const __VLS_169 = __VLS_168({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_168));
    let __VLS_171;
    let __VLS_172;
    let __VLS_173;
    const __VLS_174 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_170.slots.default;
    var __VLS_170;
    const __VLS_175 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_176 = __VLS_asFunctionalComponent(__VLS_175, new __VLS_175({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_177 = __VLS_176({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_176));
    let __VLS_179;
    let __VLS_180;
    let __VLS_181;
    const __VLS_182 = {
        onClick: (__VLS_ctx.submitForm)
    };
    __VLS_178.slots.default;
    var __VLS_178;
}
var __VLS_88;
/** @type {__VLS_StyleScopedClasses['users-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['table-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-container']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
// @ts-ignore
var __VLS_94 = __VLS_93;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            usersList: usersList,
            loading: loading,
            total: total,
            pageSize: pageSize,
            currentPage: currentPage,
            dialogVisible: dialogVisible,
            dialogType: dialogType,
            formRef: formRef,
            userForm: userForm,
            rules: rules,
            openAddDialog: openAddDialog,
            handleEdit: handleEdit,
            handleDelete: handleDelete,
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