import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useDark, useToggle } from '@vueuse/core';
const Dark = useDark();
const toggleDark = useToggle(Dark);
export const useThemeStore = defineStore('theme', () => {
    // 主题模式：light, dark, auto
    const themeMode = ref('auto');
    const isDark = ref(false);
    // 初始化主题
    const initTheme = () => {
        // 从本地存储获取主题设置
        const savedThemeMode = localStorage.getItem('themeMode');
        if (savedThemeMode) {
            themeMode.value = savedThemeMode;
            if (themeMode.value === 'auto') {
                // 自动模式下，根据系统主题设置
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                isDark.value = prefersDark;
            }
            else {
                isDark.value = themeMode.value === 'dark';
            }
        }
        else {
            // 如果没有保存的主题设置，则默认使用自动模式
            themeMode.value = 'auto';
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            isDark.value = prefersDark;
        }
        applyTheme();
    };
    // 切换主题模式
    const setThemeMode = (mode) => {
        themeMode.value = mode;
        if (mode === 'auto') {
            // 自动模式下，根据系统主题设置
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            isDark.value = prefersDark;
        }
        else {
            isDark.value = mode === 'dark';
        }
        applyTheme();
        // 保存主题设置到本地存储
        localStorage.setItem('themeMode', mode);
    };
    // 切换亮暗主题（仅供兼容旧代码）
    const toggleTheme = () => {
        if (themeMode.value === 'auto') {
            // 如果当前是自动模式，切换到手动模式
            setThemeMode(isDark.value ? 'light' : 'dark');
        }
        else {
            // 如果当前是手动模式，切换亮暗
            setThemeMode(themeMode.value === 'dark' ? 'light' : 'dark');
        }
    };
    // 应用主题
    const applyTheme = () => {
        toggleDark(isDark.value);
        const html = document.documentElement;
        // 设置data-theme属性
        if (isDark.value) {
            html.setAttribute('data-theme', 'dark');
            html.style.setProperty('--color-background', 'var(--vt-c-black)');
            html.style.setProperty('--color-background-soft', 'var(--vt-c-black-soft)');
            html.style.setProperty('--color-background-mute', 'var(--vt-c-black-mute)');
            html.style.setProperty('--color-border', 'var(--vt-c-divider-dark-2)');
            html.style.setProperty('--color-border-hover', 'var(--vt-c-divider-dark-1)');
            html.style.setProperty('--color-heading', 'var(--vt-c-text-dark-1)');
            html.style.setProperty('--color-text', 'var(--vt-c-text-dark-2)');
            html.style.setProperty('--login-gradient', 'var(--login-gradient-dark)');
            html.style.setProperty('--color-heading-card', 'var(--vt-c-text-dark-1)');
        }
        else {
            html.setAttribute('data-theme', 'light');
            html.style.setProperty('--color-background', 'var(--vt-c-white)');
            html.style.setProperty('--color-background-soft', 'var(--vt-c-white-soft)');
            html.style.setProperty('--color-background-mute', 'var(--vt-c-white-mute)');
            html.style.setProperty('--color-border', 'var(--vt-c-divider-light-2)');
            html.style.setProperty('--color-border-hover', 'var(--vt-c-divider-light-1)');
            html.style.setProperty('--color-heading', 'var(--vt-c-text-light-1)');
            html.style.setProperty('--color-text', 'var(--vt-c-text-light-1)');
            html.style.setProperty('--login-gradient', 'var(--login-gradient-light)');
            html.style.setProperty('--color-heading-card', 'var(--vt-heading-light)');
        }
    };
    return { isDark, themeMode, toggleTheme, initTheme, setThemeMode };
}, {
    // 启用持久化
    persist: true,
});
//# sourceMappingURL=theme.js.map