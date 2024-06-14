import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import App from './App.vue'
import pinia from './stores'
import vuetify from '@/plugins/vuetify'
import Vue3Toasity from 'vue3-toastify';

import 'vue3-toastify/dist/index.css'

import t from "@/utils/MatceTools.js"; // JS 方法工具箱

const routes = setupLayouts(generatedRoutes)

// console.clear()
// t.logs('Routers', routes)
import config from "/package.json";
t.logTitle([
    "WuHua-Gacha-OCR-Export-Power-Automate",
    "By: Matce",
    "Ver. " + config.version
]);

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(vuetify)
app.use(
    Vue3Toasity,
    {
        autoClose: 5000, // 自动关闭通知的时间（以毫秒为单位）
        position: "top-center", // 通知的位置，例如：top-left、top-right、bottom-left、bottom-right
        hideProgressBar: true, // 是否隐藏进度条
        transition: "slide", // 自定义的过渡效果
        closeButton: null, // 自定义关闭按钮，设置为 null 则不显示关闭按钮
        theme: "colored", // 主题颜色，"colored" 表示彩色主题
        newestOnTop: true // 新的通知是否显示在顶部，如果为 true，新的通知将显示在旧的通知之上
    },
)

app.mount('#app')

// 引入字体
import '@/assets/fonts/fonts.css';
import '@/assets/styles/main.css';