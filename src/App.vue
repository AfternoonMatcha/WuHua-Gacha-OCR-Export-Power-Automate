<template>
    <div class="app">
        <router-view v-if="!getDictLoading" />
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
const getDictLoading = ref(true)

const getDicts = () => {
    let logName = ""
    getDictLoading.value = true
    fetch('/wiki/%E5%99%A8%E8%80%85%E5%9B%BE%E9%89%B4', { referrer: '' })
        .then(res => res.ok ? res.text() : Promise.reject(new Error(res.statusText + "/ " + res.status)))
        .then(data => {
            logName = "获取器者数据库"
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
            configStore.saveItemDict(result)
        })
        .catch(error => {
            toast.error(logName + "失败！\n" + error)
            t.log(t.ERROR, logName, error)
        }).finally(() => {
            getDictLoading.value = false
        })
    fetch('/wiki/%E9%99%90%E6%97%B6%E6%8B%9B%E9%9B%86%E6%A1%A3%E6%A1%88', { referrer: '' })
        .then(res => res.ok ? res.text() : Promise.reject(new Error(res.statusText + "/ " + res.status)))
        .then(data => {
            logName = "获取限时招集数据库"
            const parser = new DOMParser(); // 创建 DOMParser 对象
            const origin = parser.parseFromString(data, 'text/html'); // 使用 parseFromString 方法解析 HTML 字符串
            const items = origin.querySelectorAll('.wikitable tr:not(:first-child)'); // 查找所有包含数据的 divsort 元素
            const result = []; // 定义结果数组
            items.forEach(item => { // 遍历所有 divsort 元素并提取数据
                const name = item.querySelector('a').getAttribute('title');
                const timeRange = item.querySelector('td:nth-child(3)').innerText;
                const image = item.querySelector('img').src;
                result.push({ // 创建对象并添加到结果数组中
                    item: name,
                    timeRange: timeRange,
                    image: image
                });
            });
            t.log(t.GET, logName, result);
            configStore.saveEventDict(result)
        })
        .catch(error => {
            toast.error(logName + "失败！\n" + error)
            t.log(t.ERROR, logName, error)
        });
}
getDicts()
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


<style lang="scss">
.Toastify__toast {
    backdrop-filter: blur(20px);
}

:root {
    --toastify-color-info: #{rgba(map-get($blue, "darken-4"), .5)} !important;
    --toastify-color-success: #{rgba(map-get($light-green, "darken-4"), .5)} !important;
    --toastify-color-warning: #{rgba(map-get($orange, "darken-4"), .5)} !important;
    --toastify-color-error: #{rgba(map-get($red, "darken-4"), .5)} !important;
}
</style>