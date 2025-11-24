import { ref } from 'vue';
import { defineStore } from 'pinia';
export const useUserStore = defineStore('user', () => {
    const token = ref('');
    const avatar = ref('');
    const changeToken = (newToken) => {
        token.value = newToken;
    };
    return { token, changeToken, avatar };
}, {
    // 启用持久化
    persist: true,
});
//# sourceMappingURL=user.js.map