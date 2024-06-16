<template>
    <div class="app">
        <router-view />
        <div class="loading" :class="{ loadingShow: loadingShow }">
            <div class="loadingBox">
                <span class="loadingBoxText">{{ "WuHua Gacha\nOCR Export\n\n载入中……" }}</span>
                <v-progress-linear class="loadingBoxProgress" indeterminate rounded />
            </div>
        </div>
    </div>
</template>


<script setup>
import t from "@/utils/MatceTools.js";
import { ref } from "vue";
import { toast } from 'vue3-toastify';
const loadingShow = ref(false);
setTimeout(() => loadingShow.value = true, 0.2 * 1000)
import { useConfigStore } from "@/stores/config";
const configStore = useConfigStore()

const getItemDatabase = () => {
    const logName = "获取器者数据库"
    fetch('/wiki/%E5%99%A8%E8%80%85%E5%9B%BE%E9%89%B4', { referrer: '' })
        .then(res => res.ok ? res.text() : Promise.reject(new Error(res.statusText + "/ " + res.status)))
        .then(data => {
            const parser = new DOMParser(); // 创建 DOMParser 对象
            const origin = parser.parseFromString(data, 'text/html'); // 使用 parseFromString 方法解析 HTML 字符串
            const items = origin.querySelectorAll('.visible-xs .divsort'); // 查找所有包含数据的 divsort 元素
            const result = []; // 定义结果数组
            items.forEach(item => { // 遍历所有 divsort 元素并提取数据
                const name = item.querySelector('a').getAttribute('title');
                const rarity = item.getAttribute('data-param1');
                const type = item.getAttribute('data-param2');
                const image = item.querySelector('img').srcset.split(', ').pop().split(' ')[0];
                result.push({ // 创建对象并添加到结果数组中
                    item: name,
                    rarity: rarity,
                    type: type,
                    image: image
                });
            });
            t.log(t.GET, logName, result);
            configStore.saveItemDatabase(result)
        })
        .catch(error => {
            toast.error(logName + "失败！\n" + error)
            t.log(t.ERROR, logName, error)
        });
}
getItemDatabase()
</script>

<style lang="scss" scoped>
.app {
    .loadingShow:only-child {
        opacity: 1;
    }

    .loading {
        position: absolute;
        height: 100vh;
        width: 100vw;
        background: #121212CC;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        top: 0;
        z-index: 1004;
        pointer-events: none;
        opacity: 0;
        transition: opacity .2s ease;

        &Box {
            display: flex;
            flex-direction: column;
            gap: 6px;

            &Text {
                white-space: pre-wrap;
            }
        }
    }
}
</style>