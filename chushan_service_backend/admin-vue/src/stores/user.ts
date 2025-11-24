import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const avatar = ref('')
    const changeToken = (newToken: string) => {
      token.value = newToken
    }

    return { token, changeToken, avatar }
  },
  {
    // 启用持久化
    persist: true,
  },
)
