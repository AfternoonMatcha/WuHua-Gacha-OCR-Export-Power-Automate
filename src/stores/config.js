import { ref } from "vue";
import { defineStore } from 'pinia';

export const useConfigStore = defineStore('config', () => {
    const nav = ref([
        { title: "首页", url: "/", icon: "home" },
        { title: "导入", url: "/import", icon: "login-variant" },
        // { title: "示例页面", url: "/test/test", icon: "palette-swatch" },
    ])

    const itemDict = ref([])

    const saveItemDict = (obj) => {
        itemDict.value = obj
    }

    const eventDict = ref([])

    const saveEventDict = (obj) => {
        eventDict.value = obj
    }

    return { nav, itemDict, saveItemDict, eventDict, saveEventDict }
});