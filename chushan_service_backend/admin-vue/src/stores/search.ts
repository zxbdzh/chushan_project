import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    keyword: ''
  }),
  actions: {
    setKeyword(keyword: string) {
      this.keyword = keyword.trim()
    },
    clearKeyword() {
      this.keyword = ''
    }
  }
})