import { ref } from "vue";
import { defineStore } from 'pinia';

export const useConfigStore = defineStore('config', () => {
    const nav = ref([
        { title: "首页", url: "/", icon: "home" },
        // { title: "示例页面", url: "/test/test", icon: "palette-swatch" },
    ])

    return { nav }
});