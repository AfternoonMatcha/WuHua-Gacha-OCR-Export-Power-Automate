import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import path from 'path';
import vuetify from 'vite-plugin-vuetify'
import dotenv from 'dotenv';

// 加载 .env 文件
dotenv.config({ path: path.resolve(__dirname, '.env') });

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Pages(
            {
                dirs: 'src/pages',  // 需要生成路由的文件目录
                exclude: ['**/components/*.vue'],  // 排除在外的目录，即所有 components 目录下的 .vue 文件都不会生成路由
                importMode: "async" // 异步引入
            }
        ),
        Layouts(),
        vuetify({ autoImport: true }), // Enabled by default
    ],

    server: {
        host: '0.0.0.0',
        port: process.env.VITE_APP_PORT,
        proxy: {
            // 指定代理所有/api请求
            '/api': {
                // 代理请求之后的请求地址
                target: 'http://localhost:8080',
                // 跨域
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '')
            }
        }
    },


    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'), // 异步引入
        },
    },

    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                @import "node_modules/vuetify/lib/styles/settings/_colors.scss";
                @import "./src/assets/styles/main.scss";
                `
            }
        }
    }
})
